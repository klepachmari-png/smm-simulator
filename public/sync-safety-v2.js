(function(){
  "use strict";
  if(window.__MK_SYNC_SAFETY_V2__) return;
  window.__MK_SYNC_SAFETY_V2__ = true;

  function clone(o){ try{return JSON.parse(JSON.stringify(o));}catch(e){return null;} }
  function fullState(){
    var s=window.S||{};
    return {
      name:s.name||"",
      track:s.track||"",
      about:s.about||"",
      f:clone(s.f||{})||{},
      ft:clone(s.ft||{})||{},
      done:clone(s.done||{})||{},
      updated:Number(s.updated||Date.now()),
      view:s.view||"welcome"
    };
  }
  function flushVisible(){
    if(!window.S) return;
    window.S.f=window.S.f||{}; window.S.ft=window.S.ft||{};
    document.querySelectorAll('[data-k]').forEach(function(el){
      var k=el.getAttribute('data-k'); if(!k) return;
      var value;
      if(el.type==='checkbox') value=el.checked?'1':'';
      else if(el.type==='radio'){ if(!el.checked) return; value=el.value; }
      else value=el.value;
      if(value===undefined) return;
      if(window.S.f[k]!==value){
        window.S.f[k]=value;
        window.S.ft[k]=Date.now();
        try{ if(window.DF) window.DF[k]=window.S.ft[k]; }catch(e){}
      }
    });
    window.S.updated=Date.now();
    try{ if(typeof window.save==='function') window.save(true); }catch(e){}
    try{
      var uid=localStorage.getItem('mk_auth_uid')||'';
      if(uid) localStorage.setItem('smm-ai-week0-v3-'+uid+'-backup',JSON.stringify(fullState()));
    }catch(e){}
  }

  // Critical fix: the old payload contained only dirty fields. Supabase stores one JSON object,
  // so a later save could replace all previous answers with that tiny partial object.
  if(typeof window.payload==='function'){
    window.payload=function(){
      var s=fullState();
      return {k:(window.S&&window.S.key)||'',data:s};
    };
  }

  if(window.MKCloud && window.MKCloud.client && window.MKCloud.ready){
    var cloud=window.MKCloud;
    var originalSave=cloud.save.bind(cloud);

    // Every cloud write is a complete snapshot, never a partial set of fields.
    cloud.save=function(){
      flushVisible();
      return originalSave(fullState());
    };

    // Read cloud without destructively replacing runtime state before simulator merge logic runs.
    cloud.load=async function(){
      var user=await cloud.ready;
      var r=await cloud.client.from('simulator_progress').select('data,updated_at').eq('user_id',user.id).maybeSingle();
      if(r.error) throw r.error;
      return r.data&&r.data.data?r.data.data:null;
    };
  }

  // Save all currently visible answers synchronously before changing a lesson/stage
  // or opening ChatGPT. This protects against missed input/change events on mobile browsers.
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest&&e.target.closest('[data-storynext],[data-storyback],[data-storyjump],[data-mcprompt],a[href*="chatgpt.com"]');
    if(!t) return;
    flushVisible();
    if(window.MKCloud&&typeof window.MKCloud.save==='function'){
      try{ window.MKCloud.save(fullState()).catch(function(){}); }catch(err){}
    }
  },true);

  window.addEventListener('pagehide',flushVisible);
})();
