(function(){
  "use strict";

  function meaningful(s){
    return !!(s && (s.name || s.track || s.about || Object.keys(s.f||{}).length || Object.keys(s.done||{}).length || (s.view && s.view!=="welcome")));
  }

  async function repairSync(){
    if(window.TESTMODE || !window.MKCloud || !window.MKCloud.ready) return;
    try{
      var user = await window.MKCloud.ready;
      if(!user || !user.id || !window.S) return;

      // The authenticated Supabase user is the only sync identity.
      // New participants previously had an empty S.key, which blocked every cloud push.
      if(!window.S.key) window.S.key = "user_" + user.id;

      // Load cloud first. If cloud is empty, MKCloud.load() migrates the
      // meaningful local progress from this browser into Supabase.
      var remote = await window.MKCloud.load();

      if(window.SYNC){
        window.SYNC.ready = true;
        window.SYNC.dirty = false;
      }

      if(typeof window.save === "function"){
        try{ window.save(true); }catch(e){}
      }
      if(typeof window.render === "function" && remote && meaningful(remote)){
        try{ window.render(); }catch(e){}
      }

      // If this browser has meaningful local state and cloud load returned
      // nothing, persist the full current state immediately.
      if(!remote && meaningful(window.S)){
        await window.MKCloud.save({
          name: window.S.name || "",
          track: window.S.track || "",
          about: window.S.about || "",
          f: window.S.f || {},
          ft: window.S.ft || {},
          done: window.S.done || {},
          updated: Number(window.S.updated || Date.now()),
          view: window.S.view || "welcome"
        });
      }
    }catch(e){
      // Keep local progress intact; normal retry logic can recover later.
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(repairSync, 0); }, {once:true});
  }else{
    setTimeout(repairSync, 0);
  }
})();
