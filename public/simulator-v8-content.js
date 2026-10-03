/* SMM + AI simulator v8: value-first producer funnel. Preserves the existing visual system and saved progress. */
(function(){
  var previousBind=bind;

  document.head.insertAdjacentHTML('beforeend', `<style>
  .v8-hero{display:grid;gap:18px;padding-top:34px}.v8-lead{max-width:72ch;font-size:1.06rem}
  .v8-outcomes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v8-outcome{padding:16px;border-radius:17px;background:var(--card);border:1px solid var(--stroke)}.v8-outcome b{display:block;color:var(--mint);margin-bottom:4px}
  .v8-map{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.v8-map div{padding:13px 10px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid var(--stroke);font-weight:700;font-size:.86rem;text-align:center}.v8-map small{display:block;color:var(--muted);font-weight:500;margin-top:4px}
  .v8-value{padding:18px;border-radius:18px;background:linear-gradient(135deg,rgba(216,255,114,.11),rgba(63,224,208,.06));border:1px solid rgba(216,255,114,.28);display:grid;gap:7px}.v8-value b{color:var(--lime)}
  .v8-examples{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v8-example{padding:17px;border-radius:18px;background:var(--card);border:1px solid var(--stroke);display:grid;gap:8px}.v8-example .eyebrow{color:var(--mint);font-size:.78rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.v8-example p{font-size:.91rem}.v8-example strong{color:var(--text)}
  .v8-tool{display:grid;gap:13px;padding:21px;border-radius:21px;background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025));border:1px solid var(--stroke)}.v8-tool h3{font-size:1.08rem}.v8-tool ul{margin:0;padding-left:20px}.v8-tool li+li{margin-top:7px}
  .v8-template{white-space:pre-wrap;padding:16px;border-radius:15px;background:rgba(0,0,0,.24);border:1px solid var(--stroke);font-size:.9rem;line-height:1.55}
  .v8-result{padding:18px;border-radius:18px;background:rgba(23,201,121,.1);border:1px solid rgba(23,201,121,.35);display:grid;gap:6px}.v8-result b{color:var(--mint)}
  .v8-gap{padding:17px;border-left:3px solid var(--copper);background:rgba(255,138,91,.07);border-radius:0 16px 16px 0;display:grid;gap:6px}.v8-gap b{color:#ffb092}
  .v8-funnel{display:grid;gap:12px;padding:21px;border-radius:22px;background:linear-gradient(135deg,#103b2a,#082017);border:1px solid rgba(216,255,114,.28)}
  .v8-index{display:flex;gap:8px;flex-wrap:wrap}.v8-index button{background:var(--card);border:1px solid var(--stroke);padding:8px 12px;border-radius:999px;font-weight:700;font-size:.82rem}.v8-index button:hover{border-color:var(--mint)}
  .v8-check{display:grid;gap:9px}.v8-check div{display:grid;grid-template-columns:28px 1fr;gap:9px;align-items:start}.v8-check i{width:25px;height:25px;border-radius:8px;display:grid;place-items:center;background:rgba(23,201,121,.16);color:var(--mint);font-style:normal;font-weight:900}
  .v8-compare{overflow:auto}.v8-compare table{width:100%;border-collapse:collapse;min-width:680px}.v8-compare th,.v8-compare td{padding:12px;border-bottom:1px solid var(--stroke);text-align:left;vertical-align:top}.v8-compare th{color:var(--mint);font-size:.82rem}.v8-compare td{font-size:.88rem}
  .v8-daynav{display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-top:28px;padding:20px;border-radius:20px;background:var(--card);border:1px solid var(--stroke)}
  .v8-open{font-size:.84rem;color:var(--muted)}
  details.v8-details{border:1px solid var(--stroke);border-radius:17px;background:var(--card)}details.v8-details summary{cursor:pointer;padding:16px 18px;font-weight:800}details.v8-details>div{padding:0 18px 18px;display:grid;gap:12px}
  @media(max-width:820px){.v8-outcomes,.v8-examples{grid-template-columns:1fr}.v8-map{grid-template-columns:1fr 1fr}.v8-map div:last-child{grid-column:1/-1}}
  </style>`);

  var BRIEF_TEMPLATE=`БРИФ ДЛЯ SMM-ПРОЄКТУ

1. Що саме ви продаєте зараз? Назвіть продукти, послуги, ціни та умови.
2. Який продукт для вас пріоритетний і чому: прибуток, завантаження, повторні продажі?
3. Яку бізнес-задачу мають підтримати соцмережі протягом найближчих 1–3 місяців?
4. Як зараз люди дізнаються про вас, звертаються і купують?
5. Хто найчастіше купує? У якій ситуації людина починає шукати ваш продукт?
6. Які запитання, сумніви та заперечення виникають перед покупкою?
7. Чому клієнти обирають вас? Які факти це підтверджують?
8. Кого ви вважаєте конкурентами? Чим ваш продукт відрізняється насправді?
9. Що вже робили в соцмережах? Що дало звернення, продажі або інший результат?
10. Які фото, відео, кейси, відгуки, цифри й експерти є для створення контенту?
11. Хто погоджує матеріали, відповідає в Direct і продає після звернення?
12. За якими показниками зрозуміємо, що робота дала результат?`;

  var COMP_TEMPLATE=`КАРТКА АНАЛІЗУ КОНКУРЕНТА

1. Який продукт і для кого продають?
2. Яка ціна, формат, умови та шлях до покупки?
3. Яку цінність обіцяють і чим її доводять?
4. Які питання та заперечення видно в коментарях і відгуках?
5. Який контент приводить увагу, який будує довіру, який продає?
6. Де їхня пропозиція сильніша за нашу?
7. Де є незакрита потреба або слабке місце?
8. Що потрібно змінити в продукті, сервісі чи комунікації до створення контенту?

Висновок — не «роблять гарні Reels», а одне бізнес-рішення для нашого проєкту.`;

  var AI_PROMPT=`Ти допомагаєш мені як аналітичний асистент. Не вигадуй фактів і не приймай маркетингові рішення замість мене.

Ось перевірені дані про проєкт:
[встав бриф]

Моє рішення:
[встав сегмент, цінність, доказ і потрібну дію]

Допоможи:
1. знайти логічні прогалини;
2. поставити до 5 уточнювальних запитань;
3. запропонувати 3 способи подати МОЮ ідею у форматі Reels;
4. окремо позначити все, що потребує перевірки.

Не додавай неіснуючих переваг, цифр, відгуків або властивостей продукту.`;

  function route(){return S.track==='B'?'для власної справи':S.track==='C'?'для чинного SMM-спеціаліста':'для старту в професії';}
  function trackOutcome(){
    if(S.track==='B') return 'Ти побачиш, що можна виправити у просуванні власного бізнесу або блогу без хаотичного контенту.';
    if(S.track==='C') return 'Ти перевіриш, чи працюєш як стратег, а не лише як виконавець, і де втрачається результат та вищий чек.';
    return 'Ти приміряєш реальні задачі SMM-спеціаліста й зрозумієш, чи хочеш навчитися цій професії.';
  }
  function copyButton(label,text){return '<button type="button" class="btn ghost sm" data-v8copy="'+esc(text)+'">'+label+'</button>';}
  function valueBox(title,text){return '<div class="v8-value"><b>Що забереш із цього блоку</b><h3>'+title+'</h3><p class="small">'+text+'</p></div>';}
  function gapBox(text){return '<div class="v8-gap"><b>Що важливо врахувати далі</b><p class="small">'+text+'</p></div>';}
  function examples(items){return '<div class="v8-examples">'+items.map(function(x){return '<div class="v8-example"><span class="eyebrow">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p></div>';}).join('')+'</div>';}
  function funnel(text,label){return '<div class="v8-funnel"><div><b>'+text+'</b><p class="small">Марія перегляне твій результат і підкаже, де саме втрачається логіка.</p></div><div class="row"><a class="btn lime" href="'+esc(CONFIG.CHAT_URL)+'" target="_blank" rel="noopener">'+label+'</a></div></div>';}

  DAYS=[
    {n:'00',title:'Побачити справжню роботу SMM',sub:'Що робить спеціаліст і де соцмережі впливають на продаж',time:'7–10 хв'},
    {n:'01',title:'Зібрати сильний бриф',sub:'12 запитань, які захищають від контенту навмання',time:'10–15 хв'},
    {n:'02',title:'Перевірити ринок і продукт',sub:'Конкуренти, відгуки та рішення до створення контенту',time:'10–15 хв'},
    {n:'03',title:'Знайти свій сегмент',sub:'Не “жінки 25–45”, а реальна ситуація покупки',time:'10–15 хв'},
    {n:'04',title:'Перевірити упаковку профілю',sub:'Що людина має зрозуміти за перші 10 секунд',time:'10–15 хв'},
    {n:'05',title:'Зібрати контент, який має задачу',sub:'Ідея, сценарій, CapCut та AI після маркетингового рішення',time:'15–25 хв'}
  ];

  welcome=function(){
    return '<section class="v8-hero"><span class="pill">Безкоштовний SMM-симулятор</span><h1>Не тест. <span class="gt">Спроба реальної роботи</span></h1><p class="muted v8-lead">За один короткий маршрут ти побачиш, із чого насправді складається SMM, забереш п’ять робочих шаблонів і створиш один власний результат. Будь-який блок можна пропустити або пройти окремо.</p></section>'+
    '<section class="stack"><div class="v8-outcomes"><div class="v8-outcome"><b>Якщо починаєш з нуля</b><span class="small">Зрозумієш, чи підходить тобі професія й які задачі виконує спеціаліст.</span></div><div class="v8-outcome"><b>Якщо просуваєш себе</b><span class="small">Побачиш, чому охоплення не завжди стають зверненнями та що перевіряти.</span></div><div class="v8-outcome"><b>Якщо вже працюєш</b><span class="small">Знайдеш різницю між виробництвом контенту і стратегічним SMM.</span></div></div>'+
    '<div><b>Обери, з якої точки ти заходиш</b><p class="small">Це змінить підказки й фінальну рекомендацію. Ім’я та реєстрація не потрібні.</p></div><div class="tracks">'+
    '<button type="button" class="track" data-track="A" aria-pressed="'+(S.track==='A')+'"><span class="tag gt">01</span><h3>Хочу спробувати професію</h3><span class="muted">Побачити реальні задачі й приміряти роль SMM-спеціаліста.</span></button>'+
    '<button type="button" class="track" data-track="B" aria-pressed="'+(S.track==='B')+'"><span class="tag gt">02</span><h3>Просуваю бізнес або блог</h3><span class="muted">Знайти слабкі місця й забрати інструменти для своєї сторінки.</span></button>'+
    '<button type="button" class="track" data-track="C" aria-pressed="'+(S.track==='C')+'"><span class="tag gt">03</span><h3>Вже працюю в SMM</h3><span class="muted">Перевірити стратегічну глибину, результат і основу для вищого чека.</span></button></div><div id="aboutWrap" hidden></div>'+
    '<div class="v8-value"><b>Що буде на виході</b><p>Бриф · картка аналізу конкурентів · формула сегмента · структура біо · сценарій Reels · правильний спосіб підключити AI.</p></div><div class="row"><button type="button" class="btn" id="startBtn">Почати з першого корисного блоку</button></div></section>';
  };

  unlocked=function(){return true;};
  dash=function(){
    var h='<section class="dayhead"><span class="pill">Маршрут '+route()+'</span><h1>Бери користь <span class="gt">в будь-якому порядку</span></h1><p class="muted">Тут немає екзамену й обов’язкових відповідей. Кожен блок самодостатній: відкрий той, який потрібен зараз.</p></section><section class="days">';
    DAYS.forEach(function(d,i){h+='<button type="button" class="day '+(S.done[i]?'done':'open')+'" data-open="'+i+'"><span class="n gt">'+d.n+'</span><span class="t"><b>'+(i===0?'Старт':'Блок '+i)+' · '+d.title+'</b><span class="small">'+d.sub+' · '+d.time+'</span></span><span class="st">'+(S.done[i]?'✓ Переглянуто':'Відкрити')+'</span></button>';});
    h+='<button type="button" class="day open" data-v8final="1"><span class="n" style="color:var(--lime)">★</span><span class="t"><b>Фінал · Мій наступний крок</b><span class="small">Що вже можу зробити сама/сам і де потрібна система</span></span><span class="st">Відкрити</span></button></section>';
    return h;
  };

  function day0(){return valueBox('Карта роботи SMM-спеціаліста','Зможеш швидко визначити, де саме ламається просування: у продукті, пропозиції, контенті, шляху до покупки чи аналітиці.')+
    '<div class="v8-tool"><h3>SMM — це частина маркетингу</h3><p><b>Маркетинг</b> — це система, за допомогою якої бізнес вивчає потреби людей, створює цінну пропозицію, доносить її, організовує продаж і утримує клієнтів. <b>SMM</b> виконує частину цієї роботи через соціальні мережі.</p><div class="v8-map"><div>1. Продукт<small>що продаємо</small></div><div>2. Людина<small>кому і в якій ситуації</small></div><div>3. Цінність<small>чому обрати нас</small></div><div>4. Контент<small>як донести й привести</small></div><div>5. Результат<small>що змінилося</small></div></div><p class="small">Тому SMM-спеціаліст не просто публікує пости. Він збирає дані, досліджує ринок і людей, формує логіку комунікації, створює контент, організовує шлях до звернення та аналізує результат.</p></div>'+
    examples([['Локальний бізнес','80 000 переглядів і два запити','Проблема може бути не в кількості Reels. Спочатку перевіряємо: чи зрозумілий продукт, для кого він, чим підтверджена цінність і як зробити наступний крок.'],['Експертний блог','Багато збережень, але немає записів','Контент може бути корисним, але не вести до продукту. Перевіряємо точку входу, обіцянку результату, докази, заперечення і механіку запису.'],['Чинний SMM-проєкт','Контент виходить стабільно, результату немає','План публікацій не дорівнює стратегії. Потрібні бізнес-задача, сегмент, гіпотези, воронка, метрики та рішення після аналізу.']])+
    '<div class="v8-tool"><h3>Швидка діагностика, яку можна забрати собі</h3><div class="v8-check"><div><i>1</i><p><b>Є перегляди, немає звернень:</b> перевір продукт, пропозицію, докази та шлях до дії.</p></div><div><i>2</i><p><b>Є переходи в профіль, немає підписок:</b> перевір позиціонування, біо, закріплені матеріали й відповідність контенту профілю.</p></div><div><i>3</i><p><b>Є звернення, немає продажів:</b> перевір ціну, продукт, кваліфікацію ліда, довіру та процес продажу.</p></div><div><i>4</i><p><b>Немає охоплення:</b> перевір тему, перші секунди, утримання, формат і дистрибуцію — але тільки після бази вище.</p></div></div></div>'+
    '<div class="ai-zero"><span class="pill">AI без завдання</span><h3>Що підготувати</h3><p class="small">AI — програма-помічник, а не заміна маркетолога. На комп’ютері відкрий <a href="https://chatgpt.com" target="_blank" rel="noopener">ChatGPT</a> у браузері; на телефоні можна встановити офіційний застосунок зі сторінки <a href="https://chatgpt.com/download" target="_blank" rel="noopener">завантаження</a>. Безкоштовної версії достатньо. Поки нічого вводити не потрібно: спершу ми зберемо дані, і лише потім дамо AI конкретне завдання.</p></div>'+gapBox('Ця діагностика покаже напрямок, але не замінить дослідження, стратегію, роботу з різними платформами та практику на реальних проєктах.')+funnel('Хочеш, щоб Марія підказала, де слабке місце саме у твоїй ситуації?','Описати ситуацію Марії');}

  function day1(){return valueBox('Готовий бриф із 12 ключових запитань','Можеш скопіювати його для клієнта, власного бізнесу або перевірки вже чинного SMM-проєкту.')+
    '<div class="v8-tool"><h3>Навіщо потрібен бриф</h3><p>Контент неможливо створювати професійно, поки незрозуміло: що продаємо, кому, за яких умов, яка бізнес-задача, що вже пробували і чим можемо довести цінність. Бриф не є формальністю — він захищає від місяця красивої, але безрезультатної роботи.</p><div class="v8-template">'+esc(BRIEF_TEMPLATE)+'</div><div class="row">'+copyButton('Скопіювати бриф',BRIEF_TEMPLATE)+'</div></div>'+
    examples([['Кав’ярня','Питаємо про бізнес, а не про улюблений колір','Середній чек, завантаження за годинами, маржинальні позиції, повторні гості, меню, локація, ресурси на зйомку та хто відповідає на звернення.'],['Салон краси','Інша ніша — інші ключові дані','Завантаження кожного майстра, пріоритетні послуги, повторний цикл, скасування, ціни, географія клієнтів, портфоліо і вільні вікна.'],['Експерт','Не починаємо з “розкажіть про себе”','Конкретний продукт, трансформація, кому не підходить, метод, кейси, точка входу, місткість, процес продажу та юридичні межі обіцянок.']])+
    '<details class="v8-details"><summary>Спробувати на своєму прикладі — за бажанням</summary><div>'+field('v8_product','Що саме продається?','Продукт, ціна, формат і результат для покупця',{h:75})+field('v8_goal','Яка одна бізнес-задача зараз найважливіша?','Не “вести Instagram”, а зміна в бізнесі',{h:75})+'<div class="v8-result" data-v8result="brief"></div></div></details>'+gapBox('Один шаблон не навчить проводити інтерв’ю, знаходити суперечності, ставити додаткові питання й перетворювати відповіді на стратегію для різних ніш.')+funnel('Можеш надіслати Марії два заповнені пункти й отримати короткий напрямок для брифу.','Надіслати бриф на фідбек');}

  function day2(){return valueBox('Картка аналізу конкурентів','Вона допомагає знайти не теми для копіювання, а рішення щодо продукту, ціни, доказів і комунікації.')+
    '<div class="v8-tool"><h3>Що насправді аналізує маркетолог</h3><p>Ми дивимося не лише Instagram. Перевіряємо сайт, Google Maps, маркетплейси, рекламу, коментарі, відгуки, ціни, умови, продукт і шлях до покупки. Конкурентом може бути й інший спосіб вирішити ту саму задачу.</p><div class="v8-template">'+esc(COMP_TEMPLATE)+'</div><div class="row">'+copyButton('Скопіювати картку аналізу',COMP_TEMPLATE)+'</div></div>'+
    '<div class="v8-compare"><table><thead><tr><th>Слабкий висновок</th><th>Професійний висновок</th><th>Рішення</th></tr></thead><tbody><tr><td>«У конкурента красивіші Reels»</td><td>У профілі одразу видно ціни, результати й запис; у нас людина шукає це вручну.</td><td>Спершу спростити шлях до вибору й запису.</td></tr><tr><td>«У них дешевше»</td><td>Різниця в ціні не пояснена доказами, сервісом або результатом.</td><td>Не скидка автоматично, а перевірка цінності й конкурентності продукту.</td></tr><tr><td>«Треба повторити їхню тему»</td><td>У коментарях регулярно питають про умову, яку ринок погано пояснює.</td><td>Перевірити свою можливість і закрити незадоволену потребу.</td></tr></tbody></table></div>'+
    examples([['Кав’ярня','Проблема може бути в продукті','Якщо поруч є бізнес-ланч за тією самою ціною, а у нас лише кава й десерт, контент не створить конкурентну пропозицію сам.'],['Салон','Відгуки показують критерій вибору','Якщо люди пишуть про стійкість покриття і пунктуальність, доказ процесу та носіння важливіший за ще одну фотографію кольору.'],['Експерт','Воронка важливіша за кількість дописів','Якщо конкурент дає зрозумілу діагностику, кейс і простий запис, а у нас лише “корисний блог”, причина може бути у відсутності точки входу.']])+gapBox('Аналіз стає стратегією лише тоді, коли ми вміємо відділити сильний сигнал від випадковості, оцінити продукт і перевірити гіпотезу даними.')+funnel('Хочеш показати одного конкурента й перевірити свій висновок?','Надіслати висновок Марії');}

  function day3(){return valueBox('Формула сильного сегмента','Вона допоможе перестати говорити з абстрактною аудиторією та створювати повідомлення під реальну ситуацію вибору.')+
    '<div class="v8-tool"><h3>Сегмент — це не стать і вік</h3><p><b>Робоча формула:</b> людина + конкретна ситуація + задача/бажаний результат + бар’єр + критерій вибору. Демографія може доповнювати опис, але сама не пояснює, чому людина купить.</p><div class="v8-template">СИТУАЦІЯ → ЩО ЛЮДИНА ХОЧЕ ЗРОБИТИ → ЩО ЗАВАЖАЄ → ЩО ВОНА МАЄ ПОБАЧИТИ ЯК ДОКАЗ → ЯКИЙ НАСТУПНИЙ КРОК ЛОГІЧНИЙ</div></div>'+
    examples([['Локальний бізнес','Фрилансер між двома дзвінками','Шукає місце на 60–90 хвилин. Бар’єр: не знає про шум, розетки й Wi‑Fi. Доказ: реальні умови. Дія: відкрити маршрут або меню.'],['Експерт','Власниця бізнесу після невдалого запуску','Не хоче “ще один контент-план”; хоче зрозуміти причину відсутності продажів. Бар’єр: недовіра до загальних обіцянок. Доказ: розбір логіки й кейс.'],['Чинний SMM','Спеціаліст із низьким чеком','Уміє знімати й оформлювати, але не може пояснити вплив на бізнес. Бар’єр: немає системи дослідження й аналітики. Доказ: стратегічний кейс із рішеннями та цифрами.']])+
    '<details class="v8-details"><summary>Зібрати свій сегмент — за бажанням</summary><div>'+field('v8_situation','У якій конкретній ситуації перебуває людина?','Що сталося перед тим, як вона почала шукати рішення?',{h:70})+field('v8_want','Якого результату вона хоче?','Не назва продукту, а зміна для людини',{h:70})+field('v8_barrier','Що заважає обрати або повірити?','Сумнів, ризик, незнання, попередній досвід',{h:70})+'<div class="v8-result" data-v8result="segment"></div></div></details>'+gapBox('Один сегмент — лише початок. У повній стратегії ми оцінюємо пріоритетність, економіку, шлях клієнта, канали, повідомлення, докази та окремі воронки для різних груп.')+funnel('Надішли свій сегмент — Марія скаже, чи він описує реальну ситуацію, а не загальну аудиторію.','Перевірити сегмент');}

  function day4(){return valueBox('Аудит профілю за 10 секунд і формулу біо','Зможеш перевірити, чи розуміє нова людина, куди потрапила, що тут можна отримати й що робити далі.')+
    '<div class="v8-tool"><h3>Профіль — це частина шляху до покупки</h3><div class="v8-check"><div><i>1</i><p><b>Поле імені:</b> чи є слова, за якими вас можуть шукати?</p></div><div><i>2</i><p><b>Перший екран:</b> хто ви, що продаєте, для кого і в якій ситуації?</p></div><div><i>3</i><p><b>Цінність і доказ:</b> чому людині варто розглядати саме вас?</p></div><div><i>4</i><p><b>Одна наступна дія:</b> запис, меню, консультація, каталог — без п’яти різних закликів.</p></div><div><i>5</i><p><b>Закріплені матеріали:</b> продукт, результат, заперечення, процес і важливі умови.</p></div></div></div>'+
    examples([['Кав’ярня','Не “кава з любов’ю”','Сніданки й кава біля університету · місця з розетками · меню та маршрут за посиланням. Лише підтверджені умови.'],['Салон','Не “створюємо красу”','Складне фарбування у Вроцлаві · план і вартість після діагностики · кейси та запис за посиланням.'],['Експерт','Не список регалій','Допомагаю власникам знайти, де соцмережі втрачають продаж · 19 років у продажах, 3 роки в SMM · запис на розбір.']])+
    '<details class="v8-details" open><summary>Зібрати чернетку свого біо</summary><div>'+field('v8_bio1','Хто ви і що пропонуєте?','Один зрозумілий рядок',{input:true})+field('v8_bio2','Для кого або якої ситуації?','Не “для всіх”',{input:true})+field('v8_bio3','Який доказ або конкретика?','Цифра, досвід, умова, результат',{input:true})+field('v8_bio4','Яка одна наступна дія?','Записатися, відкрити меню, отримати розбір',{input:true})+'<div class="v8-result" data-v8result="bio"></div></div></details>'+gapBox('Біо не врятує слабку пропозицію. Упаковка працює разом із позиціонуванням, актуальними, контентом, доказами, воронкою та процесом продажу.')+funnel('Хочеш отримати короткий голосовий коментар до своєї чернетки біо?','Надіслати біо Марії');}

  function day5(){return valueBox('Каркас Reels, який походить із маркетингового рішення','Ти отримаєш готову послідовність від ситуації людини до доказу й наступної дії, а не випадкову “тему для контенту”.')+
    '<div class="v8-tool"><h3>Перед контентом мають бути чотири відповіді</h3><div class="v8-template">1. Для кого цей матеріал саме зараз?\n2. Яку одну думку людина має зрозуміти?\n3. Який факт, кадр, кейс або демонстрація це доводить?\n4. Яку одну дію логічно зробити після перегляду?</div><p class="small">Лише після цього обираємо формат: Reels, карусель, Stories, пост, ефір або повідомлення в боті.</p></div>'+
    examples([['Кав’ярня','Не “ранок починається з кави”','Гачок: “Між парами 47 хвилин?” → показ маршруту, швидкої позиції меню, реального місця → доказ часу й умов → відкрити маршрут.'],['Салон','Не “пора оновити образ”','Гачок: “Колір гарний у салоні, а через два тижні — ні?” → причина → фрагмент діагностики → кейс носіння → запис на консультацію.'],['Експерт','Не “5 порад для успіху”','Гачок: “80 тисяч переглядів і два запити — це не перемога” → розрив у воронці → мінідіагностика → приклад рішення → запис на експрес-розбір.']])+
    '<details class="v8-details" open><summary>Зібрати свій сценарій із готового каркаса</summary><div>'+field('v8_hook','1. Ситуація або сильний факт у першому кадрі','До 10 слів',{input:true})+field('v8_idea','2. Одна думка','Що саме має зрозуміти людина?',{h:65})+field('v8_proof','3. Доказ','Що покажемо, а не просто скажемо?',{h:65})+field('v8_cta','4. Одна дія','Що зробити після перегляду?',{input:true})+'<div class="v8-result" data-v8result="reel"></div></div></details>'+
    '<details class="v8-details"><summary>CapCut з нуля: конкретні натискання</summary><div><ol class="steps">'+['Встанови CapCut з App Store або Google Play. Відкрий застосунок і дозволь доступ лише до потрібних матеріалів.','Натисни “Новий проєкт / New project”, обери відео або фото й натисни “Додати / Add”.','Вибери формат 9:16. Розташуй важливе в центральній частині кадру, щоб інтерфейс соцмережі не перекрив текст.','Натисни на фрагмент і потягни його краї, щоб забрати зайве. Затисни фрагмент, щоб змінити порядок.','Додай текст через “Text → Add text”. Одна коротка фраза на екран; перевір читабельність без звуку.','Для голосу обери “Captions → Auto captions”, мову, а потім вручну виправ слова. Музика має бути тихішою за голос.','Переглянь відео: перший кадр, логіка, доказ, одна дія. Експортуй у 1080p і ще раз відкрий файл у галереї.'].map(function(x){return '<li><span>'+x+'</span></li>';}).join('')+'</ol></div></details>'+
    '<div class="ai-zero"><span class="pill">Тепер підключаємо AI</span><h3>AI отримує не прохання “напиши 10 Reels”, а твоє рішення</h3><p class="small">Скопіюй промпт лише після брифу, сегмента й ідеї. Він допоможе перевірити логіку та оформити чернетку, але не має вигадувати продукт або факти.</p><div class="v8-template">'+esc(AI_PROMPT)+'</div><div class="row">'+copyButton('Скопіювати правильний промпт',AI_PROMPT)+'</div></div>'+gapBox('Один сценарій покаже принцип. Стабільний результат потребує контентної системи, мультиканальності, аналітики, тестів, роботи з воронкою та вміння швидко виробляти матеріали без втрати якості.')+funnel('Надішли сценарій Марії й отримай короткий професійний фідбек.','Надіслати сценарій');}

  work=function(i){return [day0,day1,day2,day3,day4,day5][i]();};

  dayView=function(i){
    var d=DAYS[i];
    return '<section class="dayhead"><div class="row"><button type="button" class="btn ghost sm" data-go="dash">Усі блоки</button><span class="pill">'+(i===0?'Старт':'Блок '+i)+'</span><span class="time">'+d.time+'</span></div><h1>'+d.title+'</h1><p class="muted">'+d.sub+'</p><div class="v8-open">Читати можна без заповнення полів. Усі вправи — добровільні.</div></section>'+
    '<nav class="v8-index" aria-label="Навігація симулятора">'+DAYS.map(function(x,j){return '<button type="button" data-open="'+j+'">'+x.n+' · '+x.title+'</button>';}).join('')+'</nav><section class="stack">'+work(i)+'</section>'+
    '<section class="v8-daynav"><div><b>'+((i<5)?'Наступний блок: '+DAYS[i+1].title:'Тепер можна зібрати висновок')+'</b><p class="small">Прогрес збережеться, але нічого заповнювати не обов’язково.</p></div><button type="button" class="btn" data-v8next="'+i+'">'+(i<5?'Перейти далі':'Побачити мій результат')+'</button></section>';
  };

  finalView=function(){
    var lead=S.track==='B'?'Тобі не обов’язково ставати SMM-спеціалістом. Але потрібна система, щоб розуміти підрядника, не витрачати ресурс на випадковий контент і бачити шлях до продажу.':S.track==='C'?'Твоя наступна точка росту — не ще більше монтажу. Це стратегічний маркетинг, робота з бізнес-показниками, мультиканальність і AI-процеси, які піднімають результат і чек.':'Ти щойно побачила/побачив невелику частину реальної роботи: дані, ринок, аудиторія, упаковка, контент і аналіз. Якщо ця логіка цікава — професію варто спробувати системно.';
    return '<section class="dayhead"><button type="button" class="btn ghost sm" data-go="dash">Усі блоки</button><span class="pill">Твій висновок</span><h1>Тепер зрозуміло, <span class="gt">навіщо потрібен SMM</span></h1><p class="muted">'+lead+'</p></section>'+
    '<section class="grid2"><div class="v8-tool"><h3>Що вже можна використати</h3><div class="v8-check"><div><i>✓</i><p>Бриф із 12 запитань</p></div><div><i>✓</i><p>Картку аналізу конкурентів</p></div><div><i>✓</i><p>Формулу сегмента</p></div><div><i>✓</i><p>Аудит профілю та біо</p></div><div><i>✓</i><p>Каркас Reels і AI-промпт</p></div></div></div><div class="v8-gap"><b>Що залишилося за межами симулятора</b><p>Повна маркетингова стратегія, робота з клієнтом, усі платформи, мультиканальність, продажі, аналітика, реклама, виробництво контенту, портфоліо, пошук клієнтів та AI-автоматизація процесів.</p><p class="small">Симулятор дає корисну частину системи, але навмисно не вдає, що одна вправа робить людину спеціалістом.</p></div></section>'+
    '<section class="micro-cta"><span class="pill">Старт 1 листопада 2026</span><h2>Обери наступний крок</h2><p>Подивися програму свого маршруту або напиши Марії. Вона підкаже, чи підходить навчання саме під твою точку.</p><div class="row"><a class="btn lime" href="'+esc(CONFIG.PROGRAM_URL)+'">Переглянути програму навчання</a><a class="btn ghost" href="'+esc(CONFIG.CHAT_URL)+'" target="_blank" rel="noopener">Поставити запитання Марії</a><a class="btn ghost" href="'+esc(CONFIG.RESERVE_URL)+'" target="_blank" rel="noopener">Забронювати місце</a></div></section>';
  };

  function refreshResults(){
    document.querySelectorAll('[data-v8result="brief"]').forEach(function(el){el.innerHTML='<b>Робоча основа</b><p>'+esc(v('v8_product')||'Продукт ще не заповнений')+' → бізнес-задача: '+esc(v('v8_goal')||'ще не визначена')+'. Наступний професійний крок — перевірити, які дані та показники потрібні для рішення.</p>';});
    document.querySelectorAll('[data-v8result="segment"]').forEach(function(el){el.innerHTML='<b>Чернетка сегмента</b><p>Людина в ситуації: '+esc(v('v8_situation')||'…')+'. Хоче: '+esc(v('v8_want')||'…')+'. Але їй заважає: '+esc(v('v8_barrier')||'…')+'. Тепер потрібні конкретна цінність, доказ і наступна дія.</p>';});
    document.querySelectorAll('[data-v8result="bio"]').forEach(function(el){el.innerHTML='<b>Чернетка біо</b><p>'+[v('v8_bio1')||'Хто ви і що пропонуєте',v('v8_bio2')||'Для кого / якої ситуації',v('v8_bio3')||'Доказ або конкретика',v('v8_bio4')||'Одна наступна дія'].map(esc).join('<br>')+'</p>';});
    document.querySelectorAll('[data-v8result="reel"]').forEach(function(el){el.innerHTML='<b>Каркас Reels</b><p><strong>Перший кадр:</strong> '+esc(v('v8_hook')||'…')+'<br><strong>Думка:</strong> '+esc(v('v8_idea')||'…')+'<br><strong>Доказ:</strong> '+esc(v('v8_proof')||'…')+'<br><strong>Дія:</strong> '+esc(v('v8_cta')||'…')+'</p>';});
  }

  bind=function(){
    previousBind();
    var start=document.getElementById('startBtn'); if(start) start.onclick=function(){if(!S.track){toast('Обери свій маршрут');return;} S.view='d0';save();render();window.scrollTo(0,0);};
    document.querySelectorAll('[data-v8copy]').forEach(function(b){b.onclick=function(){copy(b.getAttribute('data-v8copy'));};});
    document.querySelectorAll('[data-v8next]').forEach(function(b){b.onclick=function(){var i=+b.getAttribute('data-v8next');if(!S.done[i])S.done[i]='переглянуто';S.view=i<5?'d'+(i+1):'final';save();render();window.scrollTo(0,0);};});
    document.querySelectorAll('[data-v8final]').forEach(function(b){b.onclick=function(){S.view='final';save();render();window.scrollTo(0,0);};});
    document.querySelectorAll('[data-k^="v8_"]').forEach(function(el){el.addEventListener(el.type==='radio'?'change':'input',refreshResults);});
    refreshResults();
  };

  REQUIRED_QUIZZES={};
  try{if(new URLSearchParams(location.search).get('start')==='1'){S.view='welcome';save();}}catch(e){}
  render();
})();
