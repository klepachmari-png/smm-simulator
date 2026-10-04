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
    if (c.source) url += sep + "source=" + encodeURIComponent(c.source);
    return url;
  }

  function loginUrl() {
    var next = location.pathname.split("/").pop() || "simulator.html";
    var p = new URLSearchParams(location.search);
    var url = "login.html?next=" + encodeURIComponent(next);
    if (p.get("u")) url += "&u=" + encodeURIComponent(p.get("u"));
    var c = context();
    if (c.sendpulse_contact_id) url += "&sp_contact=" + encodeURIComponent(c.sendpulse_contact_id);
    if (c.telegram_id) url += "&tg=" + encodeURIComponent(c.telegram_id);
    if (c.source) url += "&source=" + encodeURIComponent(c.source);
    return url;
  }

  function compactState(raw) {
    if (!raw || typeof raw !== "object") return null;
    return {
      name: typeof raw.name === "string" ? raw.name : "",
      track: typeof raw.track === "string" ? raw.track : "",
      about: typeof raw.about === "string" ? raw.about : "",
      f: raw.f && typeof raw.f === "object" ? raw.f : {},
      ft: raw.ft && typeof raw.ft === "object" ? raw.ft : {},
      done: raw.done && typeof raw.done === "object" ? raw.done : {},
      updated: Number(raw.updated || 0),
      view: typeof raw.view === "string" ? raw.view : "welcome"
    };
  }

  function meaningfulState(s) {
    return !!(s && (s.name || s.track || s.about || Object.keys(s.f || {}).length || Object.keys(s.done || {}).length || (s.view && s.view !== "welcome")));
  }

  function readState(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? compactState(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  function localStateForUser(userId) {
    // Never read another participant's legacy/unscoped localStorage.
    // Authenticated Supabase user id is the only local progress identity.
    return readState("smm-ai-week0-v3-" + userId);
  }

  function mergeState(existing, incoming) {
    var e = compactState(existing) || { name:"", track:"", about:"", f:{}, ft:{}, done:{}, updated:0, view:"welcome" };
    var n = compactState(incoming) || { name:"", track:"", about:"", f:{}, ft:{}, done:{}, updated:0, view:"welcome" };
    var newer = Number(n.updated || 0) >= Number(e.updated || 0);
    var out = {
      name: newer ? (n.name || e.name || "") : (e.name || n.name || ""),
      track: newer ? (n.track || e.track || "") : (e.track || n.track || ""),
      about: newer ? (n.about || e.about || "") : (e.about || n.about || ""),
      f: Object.assign({}, e.f || {}),
      ft: Object.assign({}, e.ft || {}),
      done: Object.assign({}, e.done || {}, n.done || {}),
      updated: Math.max(Number(e.updated || 0), Number(n.updated || 0)),
      view: newer ? (n.view || e.view || "welcome") : (e.view || n.view || "welcome")
    };

    Object.keys(n.f || {}).forEach(function(k){
      var et = Number((e.ft || {})[k] || 0);
      var nt = Number((n.ft || {})[k] || 0);
      if (!Object.prototype.hasOwnProperty.call(out.f, k) || nt >= et) {
        out.f[k] = n.f[k];
        if (nt) out.ft[k] = nt;
      }
    });
    return out;
  }

  function applyRemoteToRuntime(userId, remote) {
    remote = compactState(remote);
    if (!meaningfulState(remote)) return remote;

    try {
      localStorage.setItem("smm-ai-week0-v3-" + userId, JSON.stringify(remote));
    } catch (e) {}

    if (window.S && typeof window.S === "object") {
      Object.keys(window.S).forEach(function (k) { delete window.S[k]; });
      Object.keys(remote).forEach(function (k) { window.S[k] = remote[k]; });
      window.S.key = "user_" + userId;
      window.S.synced = true;
    }
    return remote;
  }

  async function touch(extra) {
    if (!client) return null;
    var c = context(); extra = extra || {};
    var r = await client.rpc("touch_participant", {
      p_sendpulse_contact_id: extra.sendpulse_contact_id || c.sendpulse_contact_id || null,
      p_telegram_id: extra.telegram_id || c.telegram_id || null,
      p_source: extra.source || c.source || null,
      p_current_view: extra.current_view || null,
      p_completed_steps: Number.isFinite(extra.completed_steps) ? extra.completed_steps : null,
      p_metadata: extra.metadata || null
    });
    if (r.error) throw r.error;
    return r.data;
  }

  async function track(eventType, metadata) {
    if (!client) return null;
    await api.ready;
    var r = await client.rpc("track_simulator_event", {
      p_event_type: String(eventType || "").slice(0, 80),
      p_metadata: metadata && typeof metadata === "object" ? metadata : {}
    });
    if (r.error) throw r.error;
    return r.data;
  }

  async function requireUser() {
    if (!client) throw new Error("auth_not_configured");
    var r = await client.auth.getSession();
    var session = r.data && r.data.session;
    if (!session || !session.user) {
      localStorage.removeItem("mk_auth_uid");
      localStorage.removeItem("mk_auth_email");
      location.replace(loginUrl());
      return new Promise(function () {});
    }
    localStorage.setItem("mk_auth_uid", session.user.id);
    localStorage.setItem("mk_auth_email", session.user.email || "");
    touch({ metadata: { user_agent: navigator.userAgent.slice(0, 300) } }).catch(function () {});
    document.documentElement.style.visibility = "visible";
    return session.user;
  }

  async function directSave(user, data) {
    var incoming = compactState(data) || data;
    var current = await client.from("simulator_progress")
      .select("data").eq("user_id", user.id).maybeSingle();
    if (current.error) throw current.error;

    var cleaned = mergeState(current.data && current.data.data, incoming);
    var r = await client.from("simulator_progress").upsert({
      user_id: user.id,
      data: cleaned,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" }).select("data").single();
    if (r.error) throw r.error;

    return { ok: true, data: r.data && r.data.data };
  }

  async function save(data) {
    var user = await api.ready;
    return directSave(user, data);
  }

  async function load() {
    var user = await api.ready;
    var r = await client.from("simulator_progress")
      .select("data,updated_at").eq("user_id", user.id).maybeSingle();
    if (r.error) throw r.error;

    if (r.data && meaningfulState(r.data.data)) {
      return applyRemoteToRuntime(user.id, r.data.data);
    }

    var local = localStateForUser(user.id);
    if (meaningfulState(local)) {
      var migrated = await directSave(user, local);
      var saved = compactState((migrated && migrated.data) || local);
      applyRemoteToRuntime(user.id, saved);
      track("local_progress_migrated", {
        view: saved.view || "welcome",
        completed_steps: Object.keys(saved.done || {}).length
      }).catch(function () {});
      return saved;
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
      location.replace("login.html?next=simulator.html&source=direct");
    }
  };
  window.MKCloud = api;

  function loadEngagement(){
    if(!/simulator\.html$/i.test(location.pathname) || document.getElementById('mk-engagement-script')) return;
    var s=document.createElement('script');
    s.id='mk-engagement-script';
    s.src='engagement.js?v=20261004-2';
    s.defer=true;
    document.head.appendChild(s);
  }

  api.ready.then(function () {
    loadEngagement();
    return track("simulator_opened", { path: location.pathname, source: context().source });
  }).catch(function () {});
})();