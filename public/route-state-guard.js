(function(){
  'use strict';
  if(window.__MK_ROUTE_STATE_GUARD__) return;
  window.__MK_ROUTE_STATE_GUARD__=true;

  function currentTrack(){ return (window.S && window.S.track) || ''; }
  function markerCount(track){
    if(!window.S || !window.S.f || !track) return 0;
    var n=0;
    for(var i=0;i<6;i++) if(window.S.f['mc_done_'+track+'_'+i]) n++;
    return n;
  }
  function sharedDoneCount(){
    if(!window.S || !window.S.done) return 0;
    var n=0; for(var i=0;i<6;i++) if(window.S.done[i]) n++; return n;
  }
  function routeDoneCount(){
    var t=currentTrack();
    // A and C have route-specific completion markers in minicourse.js.
    // B is rendered by route-b-business-fix.js and its submitted/skipped state
    // is the shared done map. Route switching is locked once work has begun,
    // so B cannot inherit completion from another route going forward.
    if(t==='A' || t==='C') return markerCount(t);
    if(t==='B') return sharedDoneCount();
    return 0;
  }
  function routeStarted(){ return routeDoneCount()>0; }
  function routeComplete(){ return routeDoneCount()>=6; }
  function notify(msg){ try{ if(typeof window.toast==='function') window.toast(msg); }catch(e){} }

  function decorate(){
    // A participant can correct a route choice before completing anything.
    // Once a route has progress, switching is disabled to prevent A/B/C state
    // from being mixed in one account. Test mode remains free for QA.
    document.querySelectorAll('[data-mcroute]').forEach(function(b){
      if(!window.TESTMODE && routeStarted()){
        b.hidden=true;
        b.setAttribute('aria-hidden','true');
      }
    });

    if(!routeComplete()){
      document.querySelectorAll('[data-final],[data-v8final],[data-v9final]').forEach(function(b){
        b.setAttribute('aria-disabled','true');
        b.classList.add('locked');
      });
    }
  }

  document.addEventListener('click',function(e){
    var route=e.target && e.target.closest && e.target.closest('[data-mcroute]');
    if(route && !window.TESTMODE && routeStarted()){
      e.preventDefault(); e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      notify('Маршрут уже розпочато. Продовжуй його — прогрес і відповіді збережені.');
      return false;
    }

    var finalBtn=e.target && e.target.closest && e.target.closest('[data-final],[data-v8final],[data-v9final]');
    if(finalBtn && !routeComplete()){
      e.preventDefault(); e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      notify('Фінал відкриється після завершення всіх 6 кроків цього маршруту.');
      return false;
    }
  },true);

  var prevRender=window.render;
  if(typeof prevRender==='function'){
    window.render=function(){
      if(window.S && window.S.view==='final' && !routeComplete()) window.S.view='dash';
      var out=prevRender.apply(this,arguments);
      decorate();
      return out;
    };
  }

  setTimeout(function(){
    if(window.S && window.S.view==='final' && !routeComplete()){
      window.S.view='dash';
      try{ if(typeof window.save==='function') window.save(true); }catch(e){}
      try{ if(typeof window.render==='function') window.render(); }catch(e){}
    } else decorate();
  },0);
})();
