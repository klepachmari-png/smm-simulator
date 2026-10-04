(function(){
  'use strict';
  if(window.__MK_STATE_INTEGRITY__) return;
  window.__MK_STATE_INTEGRITY__=true;

  var uid='';
  try{ uid=localStorage.getItem('mk_auth_uid')||''; }catch(e){}
  var scopedKey=uid ? 'smm-ai-week0-v3-'+uid : '';
  var before=null;
  if(scopedKey){
    try{ var raw=localStorage.getItem(scopedKey); if(raw) before=JSON.parse(raw); }catch(e){}
  }

  function obj(x){return x&&typeof x==='object'?x:{}}
  function copy(x){try{return JSON.parse(JSON.stringify(x))}catch(e){return x}}
  function meaningful(s){return !!(s&&(s.track||s.name||s.about||Object.keys(obj(s.f)).length||Object.keys(obj(s.done)).length||(s.view&&s.view!=='welcome')))}

  function merge(a,b){
    a=a&&typeof a==='object'?a:{}; b=b&&typeof b==='object'?b:{};
    var au=Number(a.updated||0), bu=Number(b.updated||0), newer=bu>=au?b:a, older=bu>=au?a:b;
    var out={
      name:newer.name||older.name||'',
      track:newer.track||older.track||'',
      about:newer.about||older.about||'',
      f:Object.assign({},obj(a.f)),
      ft:Object.assign({},obj(a.ft)),
      done:Object.assign({},obj(a.done),obj(b.done)),
      updated:Math.max(au,bu),
      view:newer.view||older.view||'welcome'
    };
    Object.keys(obj(b.f)).forEach(function(k){
      var at=Number(obj(a.ft)[k]||0), bt=Number(obj(b.ft)[k]||0);
      if(!Object.prototype.hasOwnProperty.call(out.f,k)||bt>=at){
        out.f[k]=b.f[k];
        if(bt) out.ft[k]=bt;
      }
    });
    return out;
  }

  function fullState(){
    var s=window.S&&typeof window.S==='object'?window.S:{};
    return {
      name:s.name||'', track:s.track||'', about:s.about||'',
      f:Object.assign({},obj(s.f)), ft:Object.assign({},obj(s.ft)),
      done:Object.assign({},obj(s.done)), updated:Number(s.updated||Date.now()),
      view:s.view||'welcome'
    };
  }

  function installFullPayload(){
    if(typeof window.payload==='function'){
      window.payload=function(){ var s=fullState(); return {k:(window.S&&window.S.key)||'',data:s}; };
    }
    if(typeof window.save==='function'&&!window.save.__mkFullSync){
      var oldSave=window.save, timer=null;
      var wrapped=function(noBump){
        var r=oldSave.apply(this,arguments);
        clearTimeout(timer);
        timer=setTimeout(function(){
          try{
            if(!window.TESTMODE&&window.MKCloud&&window.MKCloud.save&&window.S&&window.S.key){
              window.MKCloud.save(fullState()).then(function(){
                if(typeof window.setSync==='function') window.setSync('ok');
              }).catch(function(){ if(typeof window.setSync==='function') window.setSync('err'); });
            }
          }catch(e){}
        },500);
        return r;
      };
      wrapped.__mkFullSync=true;
      window.save=wrapped;
    }
  }

  async function reconcile(){
    if(window.TESTMODE||!window.MKCloud||!window.MKCloud.ready) return;
    try{
      var user=await window.MKCloud.ready;
      if(!user||!user.id||!window.S) return;
      installFullPayload();

      var r=await window.MKCloud.client.from('simulator_progress').select('data').eq('user_id',user.id).maybeSingle();
      if(r.error) throw r.error;
      var remote=r.data&&r.data.data?r.data.data:null;
      var current=fullState();
      var merged=merge(remote,current);
      if(before&&meaningful(before)) merged=merge(merged,before);
      merged.updated=Math.max(Number(merged.updated||0),Date.now());

      Object.keys(window.S).forEach(function(k){delete window.S[k]});
      Object.keys(merged).forEach(function(k){window.S[k]=copy(merged[k])});
      window.S.key='user_'+user.id;
      window.S.synced=true;
      try{localStorage.setItem('smm-ai-week0-v3-'+user.id,JSON.stringify(window.S))}catch(e){}

      await window.MKCloud.save(fullState());
      if(window.SYNC){window.SYNC.ready=true;window.SYNC.dirty=false;}
      if(typeof window.render==='function') window.render();
      if(typeof window.setSync==='function') window.setSync('ok');
    }catch(e){
      try{if(typeof window.setSync==='function') window.setSync('err')}catch(_){}
    }
  }

  document.addEventListener('DOMContentLoaded',function(){
    installFullPayload();
    setTimeout(reconcile,0);
  },{once:true});
})();
