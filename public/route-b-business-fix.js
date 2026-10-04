(function(){
  "use strict";
  if(window.__MK_ROUTE_B_BUSINESS_FIX__) return;
  window.__MK_ROUTE_B_BUSINESS_FIX__ = true;

  var ZOOM_CHANNEL = "https://t.me/+Ynzkri8sHuQ5MjRk";
  var BOT_LINK = "https://t.me/smm_ai_mariia_klepach_bot";
  var PROGRAM_LINK = "index.html#program";

  function doneCountSafe(){ return typeof window.doneCount === "function" ? window.doneCount() : Object.keys((window.S&&window.S.done)||{}).length; }
  function canOpenFinal(){ return doneCountSafe() >= 6; }
  function patchLegacyFinal(html){
    html = String(html || "");
    html = html.replace(/https:\/\/t\.me\/smm_ai_mariia_klepach_bot\?start=6abfc3a54f310df5b2040566/g, ZOOM_CHANNEL);
    html = html.replace(/https:\/\/t\.me\/smm_ai_mariia_klepach_bot\?start=6abfc4bbb2d1a4a7430d1931/g, BOT_LINK);
    html = html.replace(/>Отримати доступ до Zoom 10 жовтня</g, '>Приєднатися до Zoom-каналу<');
    html = html.replace(/>Доєднатися до Zoom 10 жовтня</g, '>Приєднатися до Zoom-каналу<');
    html = html.replace(/href="index\.html#price"/g, 'href="'+PROGRAM_LINK+'"');
    return html;
  }

  function isB(){ return window.S && window.S.track === "B"; }
  function E(s){ return typeof window.esc === "function" ? window.esc(s) : String(s==null?"":s).replace(/[&<>\"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function val(k){ return typeof window.v === "function" ? window.v(k) : ((window.S&&window.S.f&&window.S.f[k])||""); }
  function markDone(i, text){
    if(!window.S) return;
    window.S.done = window.S.done || {};
    if(!window.S.done[i]) window.S.done[i] = text || "здано";
    window.S.view = i < 5 ? "d"+(i+1) : "final";
    if(typeof window.save === "function") window.save();
    try{ if(window.SYNC) { clearTimeout(window.SYNC.t); if(window.S.key && window.SYNC.ready && typeof window.push === "function") window.push(); } }catch(e){}
  }
  function noJumpRender(){
    if(typeof window.render !== "function") return;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var old = window.scrollTo;
    window.scrollTo = function(){};
    try{ window.render(); }catch(e){}
    window.scrollTo = old;
    setTimeout(function(){ try{ old.call(window,0,y); }catch(e){} },0);
  }
  function toast(t){ if(typeof window.toast === "function") window.toast(t); }
  function sec(ic,t,id){ return typeof window.secTitle === "function" ? window.secTitle(ic,t,id) : '<div class="sec-title" id="'+id+'"><i>'+ic+'</i><h2>'+E(t)+'</h2></div>'; }
  function f(k,l,h,o){ return typeof window.field === "function" ? window.field(k,l,h,o||{}) : ""; }
  function radios(k,l,a){ return typeof window.radios === "function" ? window.radios(k,l,a) : ""; }
  function prompt(title, fn){ return typeof window.promptBox === "function" ? window.promptBox(title,fn) : '<div class="prompt"><div class="h"><b>'+E(title)+'</b></div><pre>'+E(fn())+'</pre></div>'; }
  function card(title, body){ return '<div class="card stack"><h3>'+title+'</h3>'+body+'</div>'; }
  function benefit(why, impact, result, example){
    return '<div class="card stack"><p><b>Навіщо:</b> '+why+'</p><p><b>Як це вплине на бізнес:</b> '+impact+'</p><p><b>Після заповнення:</b> '+result+'</p><div class="brand-ex"><b>Приклад — не твоє завдання.</b> '+example+'</div></div>';
  }

  var B_DAYS = [
    {n:"00",title:"Старт власного проєкту",sub:"Маркетинг, SMM, продукт і дані про твій бізнес",time:"≈ 40–60 хв"},
    {n:"01",title:"Що ми продаємо і яку задачу вирішуємо",sub:"Продукт, ціль і конкретна задача просування",time:"≈ 1,5 години"},
    {n:"02",title:"Кому ми продаємо",sub:"2–3 реальні сегменти аудиторії без вигаданого персонажа",time:"≈ 2 години"},
    {n:"03",title:"Чому мають обрати саме нас",sub:"Позиціонування, докази, офер і наступна дія",time:"≈ 2 години"},
    {n:"04",title:"Сторінка і контент, які ведуть до дії",sub:"Аудит профілю і три одиниці контенту",time:"≈ 2–3 години"},
    {n:"05",title:"Система на 30 днів + AI",sub:"План, метрики, автоматизація і фінальний AI-промпт",time:"≈ 2–3 години"}
  ];

  function contextLine(label,k){ var x=val(k); return label+": "+(x||"—"); }
  function allBContext(){
    var keys = [
      ["Проєкт","b0_project"],["Тип","b0_type"],["Країна/місто","b0_city"],["Що продає","b0_sell"],["Пріоритетний продукт","b0_first_product"],["Ціна","b0_price"],["Звідки зараз клієнти","b0_clients_now"],["Соцмережі","b0_socials"],["Що не працює","b0_not_working"],["Бажаний результат","b0_result"],
      ["Бізнес-ціль","b1_business_goal"],["Маркетингова ціль","b1_marketing_goal"],["Контентна задача","b1_content_task"],["Картка продукту","b1_product_card"],["Конкурентоспроможність","b1_compete"],["Формула задачі","b1_formula"],
      ["Хто вже купує","b2_buyers"],["Сегмент 1","b2_seg1"],["Сегмент 2","b2_seg2"],["Сегмент 3","b2_seg3"],
      ["Позиціонування","b3_positioning"],["Офер","b3_offer"],["Докази","b3_proofs"],
      ["Аудит профілю","b4_audit"],["Контент 1","b4_content1"],["Контент 2","b4_content2"],["Контент 3","b4_content3"],
      ["30-денний план","b5_plan"],["AI-задачі","b5_ai_tasks"],["Що перевірити додатково","b5_check_more"]
    ];
    var out = keys.map(function(x){return contextLine(x[0],x[1]);});
    for(var n=1;n<=3;n++){
      out.push("Таблиця пропозиції · сегмент "+n+": "+[
        val("b3_t"+n+"_seg"), val("b3_t"+n+"_sit"), val("b3_t"+n+"_prop"),
        val("b3_t"+n+"_why"), val("b3_t"+n+"_proof"), val("b3_t"+n+"_action")
      ].join(" | "));
    }
    return out.join("\n");
  }

  function bWork(i){
    var h="";
    if(i===0){
      h += sec("0","Перед стартом: що ти будуєш","work");
      h += card("Просто про маркетинг, SMM і AI",
        '<p><b>Маркетинг</b> — це не просто реклама. Це відповідь на питання: що ми продаємо, кому, навіщо людині це потрібно і чому вона має обрати нас.</p>'+ 
        '<p><b>SMM</b> — це частина маркетингу в соцмережах. Він допомагає пояснити продукт, прогріти довіру, привести людину до дії і не губити контакт після першого перегляду.</p>'+ 
        '<p>Красивий Instagram і перегляди ще не означають продажі. Якщо незрозуміло, що ти продаєш, для кого, яка ціна, доказ і наступний крок — люди можуть дивитися, але не купувати.</p>'+ 
        '<p>До контенту власник має зрозуміти: продукт, аудиторію, цінність, пропозицію, доказ, шлях клієнта і метрику.</p>'+ 
        '<p><b>AI</b> може забрати рутину: структурувати відповіді, зібрати таблиці, зробити чернетки сценаріїв і контент-план. Але AI не може вирішити за власника, що, кому і навіщо продавати.</p>'+ 
        '<p class="brand-ex"><b>Результат маршруту:</b> за п’ять днів ти збереш основу системи просування власного проєкту: продукт, аудиторію, пропозицію, профіль, контент і план наступних дій.</p>');
      h += benefit("щоб усі наступні завдання працювали з твоїм реальним проєктом, а не з абстрактним кейсом.","AI і таблиці будуть підставляти твої дані в наступні дні.","є короткий бриф власного бізнесу/блогу/експертності.","Майстриня манікюру у Вроцлаві спочатку фіксує місто, послугу, ціну, джерела клієнтів і проблему: записів мало у будні.");
      h += '<div class="card stack"><h3>Заповни один раз</h3>'+ 
        f("b0_project","1. Як називається проєкт?","назва бізнесу, блогу або експертності",{input:true})+
        radios("b0_type","2. Що це?",["бізнес","послуга","продукт","експертність","блог"])+
        f("b0_city","3. У якій країні та місті працює?","",{input:true,ph:"Напр.: Албанія, Дуррес"})+
        f("b0_sell","4. Що продає?","простими словами",{h:70})+
        f("b0_first_product","5. Який продукт або послугу хоче просувати першою?","обери один пріоритет",{h:70})+
        f("b0_price","6. Яка ціна?","якщо ціна різна — діапазон або умови",{input:true})+
        f("b0_clients_now","7. Як зараз приходять клієнти?","рекомендації, Google, Instagram, знайомі, реклама…",{h:70})+
        f("b0_socials","8. Якими соцмережами користується?","Instagram, TikTok, Facebook, Telegram…",{input:true})+
        f("b0_not_working","9. Що зараз не працює?","що болить: немає заявок, мало довіри, неясна сторінка, слабкий продаж…",{h:80})+
        f("b0_result","10. Який результат від соцмереж хоче отримати?","конкретна дія або показник",{h:80})+
      '</div>';
    }
    if(i===1){
      h += sec("1","Продукт і задача просування","work");
      h += benefit("щоб не просувати все одразу і не міряти успіх підписниками.","ти зрозумієш, яку дію має робити людина після контенту.","готова картка продукту і конкретна задача просування.","Не «хочу більше підписників», а «хочу 20 заявок на діагностику шкіри за місяць з Instagram». ");
      h += card("Пояснення",
        '<p><b>Бізнес-ціль</b> — що має змінитися в бізнесі: заявки, записи, продажі, повторні покупки.</p>'+ 
        '<p><b>Маркетингова ціль</b> — як ми підведемо людину до покупки: пояснимо цінність, знімемо страх, покажемо доказ.</p>'+ 
        '<p><b>Контентна задача</b> — що має зробити конкретний пост або відео: пояснити, довести, залучити, привести до повідомлення.</p>'+ 
        '<p>SMM впливає на увагу, довіру, пояснення, заявки і повторний контакт. Але якщо продукт слабкий, ціна неясна, сервіс не відповідає або в Direct не продають — контент сам усе не врятує.</p>');
      h += '<div class="card stack"><h3>Картка продукту</h3>'+ 
        f("b1_product_card","Опиши пріоритетний продукт","що це, для кого, який результат, ціна, умови, чим сильний",{h:120})+
        f("b1_business_goal","Бізнес-ціль","що має змінитися в грошах, заявках, записах або продажах",{h:70})+
        f("b1_marketing_goal","Маркетингова ціль","що має зрозуміти/відчути людина перед покупкою",{h:70})+
        f("b1_content_task","Контентна задача","до якої дії має вести контент",{h:70})+
        f("b1_compete","Чи конкурентоспроможний продукт?","ціна, результат, сервіс, докази, швидкість, локація, гарантії — лише реальні факти",{h:100})+
        f("b1_formula","Заповни формулу","Мій проєкт продає ___ для ___. Зараз основна проблема ___. За допомогою соцмереж я хочу привести людину до дії ___. Результат перевірятиму за показником ___.",{h:120})+
      '</div>';
    }
    if(i===2){
      h += sec("2","Реальні сегменти аудиторії","work");
      h += benefit("щоб не писати для всіх і не вигадувати персонажа з повітря.","контент стане точнішим: для ситуації, болю, заперечення і рішення конкретної людини.","2–3 реальні сегменти з діями, доказами й питаннями.","Не «жінки 25–45», а «мама в Дурресі, якій потрібен трансфер з аеропорту без нервів і з дитячим багажем». ");
      h += card("Пояснення",
        '<p><b>ЦА</b> — люди, які можуть купити. <b>Сегмент</b> — частина ЦА в конкретній ситуації.</p>'+ 
        '<p>Сегмент — це не біль. Біль — що людину турбує. Страх — чого вона боїться. Заперечення — чому відкладає покупку. Рішення залежить від ціни, довіри, терміновості, доказів, альтернатив і простоти наступного кроку.</p>'+ 
        '<p>Дані шукаємо в продажах, Direct, коментарях, відгуках, пошуку, питаннях клієнтів і в конкурентів.</p>');
      h += '<div class="card stack"><h3>Сегменти для твого бізнесу</h3>'+ 
        f("b2_buyers","Хто вже купує або цікавиться?","що ти знаєш не з фантазії, а з реальних контактів",{h:90})+
        f("b2_seg1","Сегмент 1","хто; у якій ситуації шукає; який результат хоче; що заважає купити; які питання ставить; з ким порівнює; який доказ потрібен; до якої дії ведемо",{h:160})+
        f("b2_seg2","Сегмент 2","за тією самою схемою",{h:150})+
        f("b2_seg3","Сегмент 3","необов’язково, якщо реально є третій сегмент",{h:150})+
      '</div>';
    }
    if(i===3){
      h += sec("3","Пропозиція і докази","work");
      h += benefit("щоб людина зрозуміла, чому їй варто обрати саме тебе, а не альтернативу.","ти збереш офер без порожніх фраз і без знижки як єдиного аргументу.","готова пропозиція для одного пріоритетного сегмента.","Замість «якісний сервіс» — «водій зустрічає з табличкою, допомагає з багажем і чекає при затримці рейсу». ");
      h += card("Пояснення",
        '<p><b>Цінність</b> — чому продукт важливий для людини. <b>Позиціонування</b> — як тебе мають запам’ятати. <b>УТП</b> — конкретна причина обрати тебе, заснована на фактах.</p>'+ 
        '<p><b>Офер</b> — пропозиція: для кого, який результат, умови, доказ і наступна дія. Знижка може бути частиною оферу, але не замінює цінність.</p>');
      h += '<div class="card stack"><h3>Сформуй пропозицію</h3>'+ 
        f("b3_positioning","Позиціонування","для кого ти найкращий вибір і в якій ситуації",{h:90})+
        f("b3_offer","Офер","що пропонуєш, для кого, результат, умови, наступна дія",{h:100})+
        f("b3_proofs","Докази","відгуки, фото, кейси, цифри, процес, сертифікати, досвід — лише те, що реально є",{h:100})+
        '<div class="tbl"><table><thead><tr><th>Сегмент</th><th>Його ситуація</th><th>Що пропонуємо</th><th>Чому це важливо</th><th>Який доказ показуємо</th><th>Наступна дія</th></tr></thead><tbody>'+[1,2,3].map(function(n){return '<tr><td><textarea data-k="b3_t'+n+'_seg">'+E(val('b3_t'+n+'_seg'))+'</textarea></td><td><textarea data-k="b3_t'+n+'_sit">'+E(val('b3_t'+n+'_sit'))+'</textarea></td><td><textarea data-k="b3_t'+n+'_prop">'+E(val('b3_t'+n+'_prop'))+'</textarea></td><td><textarea data-k="b3_t'+n+'_why">'+E(val('b3_t'+n+'_why'))+'</textarea></td><td><textarea data-k="b3_t'+n+'_proof">'+E(val('b3_t'+n+'_proof'))+'</textarea></td><td><textarea data-k="b3_t'+n+'_action">'+E(val('b3_t'+n+'_action'))+'</textarea></td></tr>';}).join('')+'</tbody></table></div>'+ 
      '</div>';
    }
    if(i===4){
      h += sec("4","Профіль і контент, які ведуть до дії","work");
      h += benefit("щоб людина після перегляду контенту не губилася у профілі.","профіль почне пояснювати продукт, довіру, умови і наступний крок.","аудит сторінки та три готові контентні напрямки.","Reels привів людину в профіль, але в шапці немає міста, ціни й кнопки запису — продаж зривається. ");
      h += card("Шлях клієнта",'<p><b>контент → профіль → пояснення продукту → доказ → ціна/умови → дія → відповідь бізнесу → покупка.</b></p><p>Якщо одна ланка випадає, SMM може давати перегляди, але не продажі.</p>');
      h += '<div class="card stack"><h3>Аудит власної сторінки</h3>'+ 
        f("b4_audit","Перевір профіль","чи зрозуміло за кілька секунд: хто ми; що продаємо; для кого; де працюємо; локальність; чому довіряти; де ціни/умови; як зробити наступний крок; чи працюють кнопки й посилання",{h:180})+
        f("b4_content1","Контент 1: проблема або ситуація сегмента","Сегмент | Задача | Hook | Основна думка | Доказ | CTA | Метрика",{h:130})+
        f("b4_content2","Контент 2: доказ","Сегмент | Задача | Hook | Основна думка | Доказ | CTA | Метрика",{h:130})+
        f("b4_content3","Контент 3: пояснення продукту і дія","Сегмент | Задача | Hook | Основна думка | Доказ | CTA | Метрика",{h:130})+
      '</div>';
    }
    if(i===5){
      h += sec("5","30 днів системи + AI","work");
      h += benefit("щоб не створювати контент хаотично й не починати кожен день з питання «що викласти?». ","ти побачиш, які функції має виконувати контент і що можна автоматизувати.","план на 30 днів, список задач для AI і фінальний промпт без повторного збору даних.","AI може зробити таблицю і чернетки, але не має вигадувати відгуки, ціни, гарантії чи результати. ");
      h += card("Пояснення",
        '<p>Контент має виконувати функції: продавати, пояснювати, доводити, будувати довіру, навігувати, залучати і повертати людину до дії.</p>'+ 
        '<p>AI можна дати рутину: структурувати бриф, зібрати таблицю конкурентів, групувати питання клієнтів, шукати повторювані теми, створювати чернетки сценаріїв, адаптувати одну ідею під кілька платформ, формувати контент-план, готувати звіт, створювати документи й таблиці, контролювати повторювані задачі.</p>'+ 
        '<p><b>AI не має вигадувати:</b> факти, клієнтів, відгуки, результати, характеристики продукту, ціни, гарантії.</p>');
      h += '<div class="card stack"><h3>Фінальна система</h3>'+ 
        f("b5_plan","План на 30 днів","як поєднати продажний, експертний, довірчий і навігаційний контент; які теми; які формати; які метрики",{h:180})+
        f("b5_ai_tasks","Що автоматизувати через AI","таблиці, сценарії, адаптації, звіти, контроль повторюваних задач",{h:110})+
        f("b5_check_more","Що треба додатково перевірити","факти, ціни, конкурентів, попит, відгуки, процес продажу, аналітику",{h:110})+
      '</div>';
      h += prompt("Фінальний AI-промпт на основі всіх твоїх відповідей",function(){return "Ти — мій навчальний AI-асистент із маркетингу. Пиши українською, просто, через конкретні приклади. Не вигадуй фактів, цитат, доходів, гарантій, властивостей або відгуків. Чітко розділяй: дані з моїх відповідей, висновки, гіпотези, що потрібно перевірити.\n\nОсь усі мої дані зі старту і п’яти днів:\n\n"+allBContext()+"\n\nЗадача: склади для мого проєкту основу системи просування на 30 днів. Дай структуру: 1) коротка суть проєкту; 2) продукт і задача просування; 3) 2–3 сегменти; 4) пропозиція для пріоритетного сегмента; 5) шлях клієнта; 6) що виправити в профілі; 7) три контентні напрямки; 8) план на 30 днів; 9) що автоматизувати через AI; 10) що треба перевірити додатково. Не проси мене повторювати дані, які вже є вище. Якщо чогось не вистачає — не вигадуй і не став повторних запитань: познач «НЕМАЄ ДАНИХ» та винеси це в пункт «Що потрібно додатково перевірити / дозібрати».";});
    }
    return h;
  }

  var oldDash = window.dash;
  window.dash = function(){
    if(!isB()) return oldDash ? oldDash() : "";
    var html='<section class="dayhead"><span class="pill">Трек Б · власна справа</span><h1>Привіт'+(window.S.name?', '+E(window.S.name.split(" ")[0]):'')+'! <span class="gt">Система для твого проєкту</span></h1><p class="muted">Ти працюєш не з вигаданим персонажем, а зі своїм бізнесом, блогом, продуктом або експертністю. Один день — один блок системи просування.</p>'+ (typeof window.syncCard==="function"?window.syncCard():"") +'</section><section class="days">';
    B_DAYS.forEach(function(d,i){
      var st = window.S.done && window.S.done[i] ? "done" : ((typeof window.unlocked==="function" ? window.unlocked(i) : i===0) ? "open" : "locked");
      var label = window.S.done && window.S.done[i] ? "✓ "+window.S.done[i] : (st==="open" ? "Відкрито" : "Закрито");
      html+='<button type="button" class="day '+st+'" data-open="'+i+'" '+(st==="locked"?'aria-disabled="true"':'')+'><span class="n gt">'+d.n+'</span><span class="t"><b>'+(i===0?"Старт":"День "+i)+' · '+E(d.title)+'</b><span class="small">'+E(d.sub)+' · '+E(d.time)+'</span></span><span class="st">'+E(label)+'</span></button>';
    });
    var allDone = typeof window.doneCount === "function" && window.doneCount()===6;
    html+='<button type="button" class="day '+(allDone?'open':'locked')+'" data-final="1" '+(allDone?'':'aria-disabled="true"')+'><span class="n" style="color:var(--lime)">★</span><span class="t"><b>Фінал · Система просування</b><span class="small">Здати систему, подивитися програму, перейти в Zoom-канал</span></span><span class="st">'+(allDone?'Відкрито':'Після Дня 5')+'</span></button></section>';
    return html;
  };

  var oldDayView = window.dayView;
  window.dayView = function(i){
    if(!isB()) return oldDayView ? oldDayView(i) : "";
    var d = B_DAYS[i];
    var h='<section class="dayhead"><div class="row"><button type="button" class="btn ghost sm" data-go="dash">← Усі кроки</button><span class="pill">'+(i===0?"Старт":"День "+i)+'</span><span class="time">⏱ '+E(d.time)+'</span></div><h1>'+E(d.title)+'</h1><p class="muted">'+E(d.sub)+'</p></section>';
    h+='<nav class="tabs" aria-label="Розділи дня"><a href="#why">Навіщо</a><a href="#work">Робоче поле</a><a href="#check">Здача</a></nav>';
    h+='<section class="stack" id="why"><div class="letter"><span class="av">Б</span><div class="from">Твій бізнес</div><q>Сьогодні ти працюєш зі своїм реальним проєктом. Приклади нижче — лише приклади, не твоє завдання.</q></div></section>';
    h+='<section class="stack">'+bWork(i)+'</section>';
    h+='<section class="card stack" id="check"><h3>Перед здачею перевір</h3><div class="checklist"><label><input type="checkbox" data-k="b_chk'+i+'_1" '+(val('b_chk'+i+'_1')?'checked':'')+'>Я відповіла/відповів на основі свого реального бізнесу, а не вигаданого прикладу.</label><label><input type="checkbox" data-k="b_chk'+i+'_2" '+(val('b_chk'+i+'_2')?'checked':'')+'>У відповідях є конкретика: продукт, сегмент, доказ, дія або метрика.</label></div></section>';
    h+='<section><div class="submit"><h2>Завершити крок</h2><ol class="steps"><li><span><b>Заповнити</b> — внеси стільки даних, скільки реально маєш зараз.</span></li><li><span><b>Здати</b> — Марія побачить роботу в архіві та зможе дати фідбек.</span></li><li><span><b>Пропустити</b> — якщо даних поки немає, день відкриє наступний крок, але це буде позначено як пропущено.</span></li></ol><div class="row"><a class="btn ghost" href="#work">Заповнити</a><button type="button" class="btn lime" data-submit="'+i+'">Здати</button><button type="button" class="btn ghost" data-skip-b="'+i+'">Пропустити</button></div>'+(window.S.done&&window.S.done[i]?'<p class="small">✓ '+E(window.S.done[i])+'</p>':'')+'</div></section>';
    return h;
  };

  var oldFinal = window.finalView;
  window.finalView = function(){
    if(isB()){
      return '<section class="dayhead"><div class="row"><button type="button" class="btn ghost sm" data-go="dash">← Усі кроки</button></div><span class="pill">★ Фінал маршруту Б</span><h1>Ти зібрала <span class="gt">основу просування</span></h1><p class="muted" style="max-width:70ch">Ти не просто пройшла симулятор — ти зібрала основу просування власного проєкту. Це ще не повна маркетингова стратегія, але тепер у тебе є продукт, сегменти, пропозиція, шлях клієнта, контентні напрямки та план наступних дій.</p><p class="muted" style="max-width:70ch">Марія бачить твої відповіді в архіві й може дати особистий фідбек. Якщо хочеш перетворити цю основу на повну систему продажів через соцмережі — подивись програму МК SMM 1.0 або приєднуйся до Zoom-каналу.</p></section>'+ 
      '<section class="grid2"><div class="card stack"><h3>Що вже зібрано</h3><p>✓ основа стратегії</p><p>✓ 2–3 сегменти</p><p>✓ пропозиція</p><p>✓ шлях клієнта</p><p>✓ аудит профілю</p><p>✓ три контентні напрямки</p><p>✓ план на 30 днів</p><p>✓ задачі для AI і список перевірок</p></div><div class="card stack"><h3>Фінальний AI-контекст</h3><p class="small">У фінальному промпті Дня 5 уже зібрані відповіді зі старту та всіх днів. ChatGPT не має просити ці дані повторно.</p><button type="button" class="btn ghost" data-copyall="1">Скопіювати всі мої відповіді</button></div></section>'+ 
      '<section class="row"><button type="button" class="btn lime" id="mk-submit-system">Здати систему Марії</button><a class="btn ghost" href="'+PROGRAM_LINK+'">Подивитися програму</a><a class="btn" href="'+ZOOM_CHANNEL+'" target="_blank" rel="noopener">Приєднатися до Zoom-каналу</a></section>';
    }
    return patchLegacyFinal(oldFinal ? oldFinal() : "");
  };

  document.addEventListener("click", function(e){
    var finalBtn = e.target.closest && e.target.closest("[data-final],[data-v8final],[data-v9final]");
    if(finalBtn && !canOpenFinal()){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      toast("Фінал відкриється після завершення всіх 6 кроків");
      return false;
    }
    var submit = e.target.closest && e.target.closest("[data-submit]");
    if(submit && isB()){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      var i = Number(submit.getAttribute("data-submit"));
      try{ if(typeof window.copy === "function" && typeof window.dayText === "function") window.copy(window.dayText(i)); }catch(err){}
      markDone(i,"здано"); toast("Здано. Відповіді збережені ✓"); noJumpRender();
      return false;
    }
    var skip = e.target.closest && e.target.closest("[data-skip-b]");
    if(skip && isB()){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      var j = Number(skip.getAttribute("data-skip-b"));
      markDone(j,"пропущено"); toast("Крок пропущено. Можна повернутися пізніше."); noJumpRender();
      return false;
    }
    var sys = e.target.closest && e.target.closest("#mk-submit-system");
    if(sys && isB()){
      e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      submitSystem(sys);
      return false;
    }
  }, true);

  async function submitSystem(btn){
    try{
      if(!window.MKCloud || !window.MKCloud.client || !window.MKCloud.ready){ toast("Немає зв'язку з архівом"); return; }
      btn.disabled = true;
      var user = await window.MKCloud.ready;
      var sb = window.MKCloud.client;
      var r = await sb.from('feedback_entries').insert({
        user_id:user.id,
        kind:'personal_feedback',
        stage:'Фінал маршруту Б · система просування',
        message:'Учасниця/учасник здав(ла) фінальну систему маршруту «Просуваю власну справу». Прошу переглянути відповіді в архіві та дати фідбек.',
        wants_personal_feedback:true,
        context:{view:'final',completed_steps:(typeof window.doneCount==='function'?window.doneCount():0),track:'B'}
      });
      btn.disabled = false;
      if(r.error){ toast("Не вдалося здати систему. Спробуй ще раз."); return; }
      toast("Система здана Марії ✓");
    }catch(e){ btn.disabled=false; toast("Не вдалося здати систему. Спробуй ще раз."); }
  }

  var renderBeforeGuard = window.render;
  if(typeof renderBeforeGuard === "function"){
    window.render = function(){
      if(window.S && window.S.view === "final" && !canOpenFinal()){
        window.S.view = "dash";
        try{ if(typeof window.save === "function") window.save(true); }catch(e){}
      }
      var out = renderBeforeGuard.apply(this, arguments);
      if(!canOpenFinal()){
        document.querySelectorAll("[data-final],[data-v8final],[data-v9final]").forEach(function(b){
          b.setAttribute("aria-disabled","true");
          b.classList.add("locked");
          var st=b.querySelector&&b.querySelector(".st"); if(st) st.textContent="Після Дня 5";
        });
      }
      return out;
    };
  }

  if(window.CONFIG){
    window.CONFIG.ZOOM_TEXT = "Фінальний Zoom — у Zoom-каналі.";
    window.CONFIG.CALL_URL = ZOOM_CHANNEL;
    window.CONFIG.MYLINK = BOT_LINK;
    window.CONFIG.CHAT_URL = BOT_LINK;
  }

  setTimeout(function(){
    if(window.S && window.S.view === "final" && !canOpenFinal()){
      window.S.view = "dash";
      try{ if(typeof window.save === "function") window.save(true); }catch(e){}
    }
    if((isB() || (window.S && window.S.view === "final")) && typeof window.render === "function") noJumpRender();
  },0);
})();
