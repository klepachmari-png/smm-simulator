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

      if(!window.S.key) window.S.key = "user_" + user.id;

      // Cloud is authoritative on startup. Load it first and never immediately
      // write the pre-load local state back over it.
      var remote = await window.MKCloud.load();

      if(window.SYNC){
        window.SYNC.ready = true;
        window.SYNC.dirty = false;
      }

      if(remote && meaningful(remote)){
        if(typeof window.render === "function"){
          try{ window.render(); }catch(e){}
        }
        return;
      }

      // Only if cloud is truly empty do we persist this user's local state.
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