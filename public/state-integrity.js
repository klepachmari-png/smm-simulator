(function(){
  'use strict';
  if(window.__MK_STATE_INTEGRITY__) return;
  window.__MK_STATE_INTEGRITY__=true;

  function obj(x){return x&&typeof x==='object'?x:{}}

  function fullState(){
    var s=window.S&&typeof window.S==='object'?window.S:{};
    return {
      name:s.name||'',
      track:s.track||'',
      about:s.about||'',
      f:Object.assign({},obj(s.f)),
      ft:Object.assign({},obj(s.ft)),
      done:Object.assign({},obj(s.done)),
      updated:Number(s.updated||Date.now()),
      view:s.view||'welcome'
    };
  }

  function installFullPayload(){
    if(typeof window.payload==='function'){
      window.payload=function(){
        return {k:(window.S&&window.S.key)||'',data:fullState()};
      };
    }

    if(typeof window.save==='function'&&!window.save.__mkFullSync){
      var oldSave=window.save;
      var timer=null;
      var wrapped=function(){
        var r=oldSave.apply(this,arguments);
        clearTimeout(timer);
        timer=setTimeout(function(){
          try{
            if(!window.TESTMODE&&window.MKCloud&&window.MKCloud.save&&window.S&&window.S.key){
              window.MKCloud.save(fullState()).then(function(){
                if(typeof window.setSync==='function') window.setSync('ok');
              }).catch(function(){
                if(typeof window.setSync==='function') window.setSync('err');
              });
            }
          }catch(e){}
        },500);
        return r;
      };
      wrapped.__mkFullSync=true;
      window.save=wrapped;
    }
  }

  // IMPORTANT: do not merge local/runtime state into cloud on startup here.
  // cloud.js + sync-fix.js are the single startup authority:
  // 1) load this authenticated user's cloud record;
  // 2) only if cloud is empty, use this SAME user's scoped localStorage key.
  // This prevents progress from one account leaking into another account.
  function boot(){
    installFullPayload();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
