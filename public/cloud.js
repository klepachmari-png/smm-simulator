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

  function loginUrl() {
    var next = location.pathname.split("/").pop() || "simulator.html";
    var params = new URLSearchParams(location.search);
    var url = "login.html?next=" + encodeURIComponent(next);
    if (params.get("u")) url += "&u=" + encodeURIComponent(params.get("u"));
    return url;
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
    document.documentElement.style.visibility = "";
    return session.user;
  }

  async function load() {
    var user = await api.ready;
    var result = await client.from("simulator_progress")
      .select("data,updated_at").eq("user_id", user.id).maybeSingle();
    if (result.error) throw result.error;
    return result.data ? result.data.data : null;
  }

  async function save(data) {
    await api.ready;
    var result = await client.rpc("save_simulator_progress", { p_data: data });
    if (result.error) throw result.error;
    return { ok: true, data: result.data };
  }

  var api = {
    client: client,
    ready: requireUser(),
    load: load,
    save: save,
    signOut: async function () {
      if (client) await client.auth.signOut();
      localStorage.removeItem("mk_auth_uid");
      localStorage.removeItem("mk_auth_email");
      location.replace("login.html");
    }
  };
  window.MKCloud = api;
})();

