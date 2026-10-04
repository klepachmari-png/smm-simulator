(function(){
  "use strict";

  function mount(user){
    if(document.getElementById("mk-account-bar")) return;
    var email=(user&&user.email)||localStorage.getItem("mk_auth_email")||"";
    var bar=document.createElement("div");
    bar.id="mk-account-bar";
    bar.setAttribute("role","region");
    bar.setAttribute("aria-label","Акаунт");
    bar.innerHTML='<span class="mk-account-email"></span><button type="button" class="mk-account-logout">Вийти</button>';
    var style=document.createElement("style");
    style.textContent='#mk-account-bar{position:fixed;right:14px;top:14px;z-index:9999;display:flex;align-items:center;gap:10px;max-width:calc(100vw - 28px);padding:8px 10px;border:1px solid rgba(160,255,205,.18);border-radius:999px;background:rgba(6,18,13,.92);backdrop-filter:blur(12px);box-shadow:0 10px 30px rgba(0,0,0,.2);font:500 12px/1.2 Onest,system-ui,sans-serif;color:#EAF7F0}.mk-account-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;color:#9DB8AA}.mk-account-logout{border:0;border-radius:999px;padding:8px 11px;background:rgba(255,255,255,.08);color:#EAF7F0;font:700 12px Onest,system-ui,sans-serif;cursor:pointer}.mk-account-logout:hover{background:rgba(255,255,255,.14)}@media(max-width:640px){#mk-account-bar{top:auto;bottom:12px;right:12px;left:12px;justify-content:space-between}.mk-account-email{max-width:65vw}}';
    document.head.appendChild(style);
    bar.querySelector(".mk-account-email").textContent=email||"Вхід активний";
    bar.querySelector(".mk-account-logout").onclick=async function(){
      var btn=this; btn.disabled=true; btn.textContent="Виходжу…";
      try{
        if(window.MKCloud && typeof window.MKCloud.signOut==="function") await window.MKCloud.signOut();
        else location.href="login.html?next=simulator.html&source=direct";
      }catch(e){
        btn.disabled=false; btn.textContent="Вийти";
        location.href="login.html?next=simulator.html&source=direct";
      }
    };
    document.body.appendChild(bar);
  }

  if(window.MKCloud && window.MKCloud.ready){
    window.MKCloud.ready.then(mount).catch(function(){});
  }else{
    window.addEventListener("load",function(){
      if(window.MKCloud && window.MKCloud.ready) window.MKCloud.ready.then(mount).catch(function(){});
    },{once:true});
  }
})();