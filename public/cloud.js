(function () {
  "use strict";

  var cfg = window.MK_CONFIG || {};
  var configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
    cfg.SUPABASE_URL.indexOf("__") !== 0 && cfg.SUPABASE_ANON_KEY.indexOf("__") !== 0;
  var client = configured && window.supabase
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  function safeParam(name, max) {
    try {
      var v = (new URLSearchParams(location.search).get(name) || "").trim();
      return v.slice(0, max || 200);
    } catch (e) { return ""; }
  }

  function context() {
    return {
      sendpulse_contact_id: safeParam("sp_contact", 160),
      telegram_id: safeParam("tg", 80),
      source: safeParam("source", 80) || "web"
    };
  }

  function appendContext(url) {
    var c = context();
    var sep = url.indexOf("?") >= 0 ? "&" : "?";
    if (c.sendpulse_contact_id) { url += sep + "sp_contact=" + encodeURIComponent(c.sendpulse_contact_id); sep = "&"; }
    if (c.telegram_id) { url += sep + "tg=" + encodeURIComponent(c.telegram_id); sep = "&"; }
    if (c.source) { url += sep + "source=" + encodeURIComponent(c.source); }
    return url;
  }

  function loginUrl() {
    var next = location.pathname.split("/").pop() || "simulator.html";
    var params = new URLSearchParams(location.search);
    var url = "login.html?next=" + encodeURIComponent(next);
    if (params.get("u")) url += "&u=" + encodeURIComponent(params.get("u"));
    var c = context();
    if (c.sendpulse_contact_id) url += "&sp_contact=" + encodeURIComponent(c.sendpulse_contact_id);
    if (c.telegram_id) url += "&tg=" + encodeURIComponent(c.telegram_id);
    if (c.source) url += "&source=" + encodeURIComponent(c.source);
    return url;
  }

  function compactState(raw) {
    if (!raw || typeof raw !== "object") return null;
    var out = {
      name: typeof raw.name === "string" ? raw.name : "",
      track: typeof raw.track === "string" ? raw.track : "",
      about: typeof raw.about === "string" ? raw.about : "",
      f: raw.f && typeof raw.f === "object" ? raw.f : {},
      ft: raw.ft && typeof raw.ft === "object" ? raw.ft : {},
      done: raw.done && typeof raw.done === "object" ? raw.done : {},
      updated: Number(raw.updated || 0),
      view: typeof raw.view === "string" ? raw.view : "welcome"
    };
    return out;
  }

  function meaningfulState(state) {
    if (!state) return false;
    return !!(
      state.name ||
      state.track ||
      state.about ||
      Object.keys(state.f || {}).length ||
      Object.keys(state.done || {}).length ||
      (state.view && state.view !== "welcome")
    );
  }

  function localStateForUser(userId) {
    try {
      var exactKey = "smm-ai-week0-v3-" + userId;
      var raw = localStorage.getItem(exactKey);
      if (!raw) return null;
      return compactState(JSON.parse(raw));
    } catch (e) {
      console.warn("MKCloud local migration read failed", e);
      return null;
    }
  }

  async function touch(extra) {
    if (!client) return null;
    var c = context();
    extra = extra || {};
    var result = await client.rpc("touch_participant", {
      p_sendpulse_contact_id: extra.sendpulse_contact_id || c.sendpulse_contact_id || null,
      p_telegram_id: extra.telegram_id || c.telegram_id || null,
      p_source: extra.source || c.source || null,
      p_current_view: extra.current_view || null,
      p_completed_steps: Number.isFinite(extra.completed_steps) ? extra.completed_steps : null,
      p_metadata: extra.metadata || null
    });
    if (result.error) throw result.error;
    return result.data;
  }

  async function track(eventType, metadata) {
    if (!client) return null;
    await api.ready;
    var result = await client.rpc("track_simulator_event", {
      p_event_type: String(eventType || "").slice(0, 80),
      p_metadata: metadata && typeof metadata === "object" ? metadata : {}
    });
    if (result.error) throw result.error;
    return result.data;
  }

  async function requireUser() {
    if (!client) throw new Error("auth_not_configured");
    var result = await client.auth.getSession();
    var session = result.data && result.data.session;
    if (!session || !session.user) {
      localStorage.removeItem("mk_auth_uid");
      localStorage.removeItem("mk_auth_email");
      location.replace(loginUrl());
      return new Promise(function () {});
    }
    localStorage.setItem("mk_auth_uid", session.user.id);
    localStorage.setItem("mk_auth_email", session.user.email || "");
    touch({ metadata: { user_agent: navigator.userAgent.slice(0, 300) } }).catch(function (e) {
      console.warn("MKCloud touch failed", e);
    });
    document.documentElement.style.visibility = "visible";
    return session.user;
  }

  async function save(data) {
    var user = await api.ready;
    var cleaned = compactState(data) || data;
    var result = await client.rpc("save_simulator_progress", { p_data: cleaned });
    if (!result.error) return { ok: true, data: result.data };

    console.warn("RPC progress save failed, trying direct upsert", result.error);
    var fallback = await client.from("simulator_progress").upsert({
      user_id: user.id,
      data: cleaned,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" }).select("data").single();
    if (fallback.error) throw fallback.error;
    return { ok: true, data: fallback.data && fallback.data.data };
  }

  async function load() {
    var user = await api.ready;
    var result = await client.from("simulator_progress")
      .select("data,updated_at").eq("user_id", user.id).maybeSingle();
    if (result.error) throw result.error;
    if (result.data && result.data.data) return compactState(result.data.data);

    // One-time safe migration: if this device already has real progress for
    // the same authenticated Supabase user, upload it before returning.
    var local = localStateForUser(user.id);
    if (meaningfulState(local)) {
      try {
        var migrated = await save(local);
        await track("local_progress_migrated", {
          view: local.view || "welcome",
          completed_steps: Object.keys(local.done || {}).length
        }).catch(function () {});
        return compactState((migrated && migrated.data) || local);
      } catch (e) {
        console.warn("MKCloud local migration failed", e);
      }
    }
    return null;
  }

  var api = {
    client: client,
    ready: requireUser(),
    load: load,
    save: save,
    touch: touch,
    track: track,
    context: context,
    appendContext: appendContext,
    signOut: async function () {
      if (client) await client.auth.signOut();
      localStorage.removeItem("mk_auth_uid");
      localStorage.removeItem("mk_auth_email");
      location.replace(appendContext("login.html"));
    }
  };
  window.MKCloud = api;

  api.ready.then(function () {
    return track("simulator_opened", { path: location.pathname, source: context().source });
  }).catch(function (e) {
    console.warn("MKCloud open event failed", e);
  });
})();
