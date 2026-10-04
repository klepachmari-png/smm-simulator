(function(){
  'use strict';
  if(window.__MK_FINAL_FUNNEL_FIX__) return;
  window.__MK_FINAL_FUNNEL_FIX__=true;
  var ZOOM='https://t.me/+Ynzkri8sHuQ5MjRk';
  var BOT='https://t.me/smm_ai_mariia_klepach_bot';
  var PROGRAM='index.html#program';
  var prev=window.finalView;
  if(typeof prev!=='function') return;
  function has(html,needle){return String(html||'').indexOf(needle)!==-1;}
  window.finalView=function(){
    var html=String(prev.apply(this,arguments)||'');
    html=html.replace(/https:\/\/t\.me\/smm_ai_mariia_klepach_bot\?start=[^\"']+/g,BOT);
    html=html.replace(/href=\"index\.html#price\"/g,'href="'+PROGRAM+'"');
    html=html.replace(/https:\/\/t\.me\/\+Ynzkri8sHuQ5MjRk/g,ZOOM);
    var needProgram=!has(html,PROGRAM);
    var needZoom=!has(html,ZOOM);
    var needPersonal=!has(html,BOT);
    if(needProgram||needZoom||needPersonal){
      html += '<section class="mc-section final-next"><span class="mc-label">Що далі</span><h2>Обери наступний крок</h2><p>Можеш перейти в канал з інформацією про Zoom, подивитися повну програму МК SMM 1.0 або особисто написати Марії.</p><div class="final-actions">'+
        '<a class="btn" href="'+ZOOM+'" target="_blank" rel="noopener">Приєднатися до Zoom-каналу</a>'+ 
        '<a class="btn ghost" href="'+PROGRAM+'">Подивитися програму навчання</a>'+ 
        '<a class="btn ghost" href="'+BOT+'" target="_blank" rel="noopener">Особисто поговорити з Марією</a>'+ 
      '</div></section>';
    }
    return html;
  };
})();
