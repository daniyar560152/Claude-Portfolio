/*
 * Mobile bank 2025 — concept of a daily-banking app: group wallets + a smart money manager with "envelope" sections.
 * Built from the SWAMP MARKET Figma file, "Section 1" (node 165:6549): about the project, design + prototype,
 * the presentation, and the processed usability tests (one board per respondent).
 * Screens scroll after a click/tap (board-market.js) and open full size (board-smartbank.js).
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);
  const T = (s) => K().T(s), title2 = (a, b) => K().title2(a, b);
  const IMG = 'assets/img/wallet/';
  const SIZE = {
    'm-home': [750, 2522], 'm-personal': [750, 2950], 'm-groups': [750, 1832], 'm-trip-history': [750, 3200], 'm-parents': [750, 2270],
    'm-onboarding': [750, 1624], 'm-autopay': [750, 1662], 'm-trip': [750, 2550],
    's-confused': [1440, 820], 's-clear': [1440, 820], 's-start': [1440, 820], 's-problems': [1440, 820], 'r-respondent': [1800, 1748],
  };

  const scr = (file, alt) => {
    const [w, h] = SIZE[file];
    return `<div class="bd-scrwrap bd-scrwrap--phone">
      <div class="bd-scr" tabindex="0" role="region" aria-label="${esc(T(alt))} — ${esc(T('scrollable screen'))}">
        <img src="${IMG}${file}.webp" alt="${esc(T(alt))}" width="${w}" height="${h}" loading="lazy" decoding="async">
      </div>
      <i class="bd-scr__bar" aria-hidden="true"></i>
    </div>`;
  };
  const full = (file, alt) => `<button class="bd-full" type="button" data-smb-zoom="${IMG}${file}.webp" data-phone data-alt="${esc(T(alt))}" aria-label="${esc(T('Open full size'))}: ${esc(T(alt))}"><span aria-hidden="true">⤢</span>${T('Full screen')}</button>`;
  const board = (file, alt, cap) => `
    <figure class="smb-shot" data-reveal>
      <button class="smb-shot__btn" type="button" data-smb-zoom="${IMG}${file}.webp" data-alt="${esc(T(alt))}" aria-label="${esc(T('Open full size'))}: ${esc(T(alt))}">
        <img src="${IMG}${file}.webp" alt="${esc(T(alt))}" width="${SIZE[file][0]}" height="${SIZE[file][1]}" loading="lazy" decoding="async">
        <span class="bd-full" aria-hidden="true"><span>⤢</span>${T('Full screen')}</span>
      </button>
      <figcaption class="bd-label">${esc(T(cap))}</figcaption>
    </figure>`;

  /* ---------- 01 Hero ---------- */
  const hero = (p) => `
  <section class="bd-sec bd-hero bd-hero--lilac" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">${T('Case')} ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(${T('Case')} ${p.no}) — ${T('Concept')} · ${T('Mobile bank 2025')}</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">SHARED MONEY</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">without the</span><span class="bd-display-l" data-split="chars">MATHS</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:760px">A concept of a daily-banking app for 2025 that fixes pains with features banks already have but that don’t work comfortably: group wallets where everyone chips in, and a smart money manager that splits every income into envelopes. Ideas, storyboards, a prototype, usability tests, design and a pitch.</p>
    <div class="bd-tags">${['Mobile banking', 'Concept', 'Prototyping', 'Usability testing', 'Personal finance'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('piggyGoal')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('macRing')}</div>
      <div class="bd-art" style="--w:320px;--r:-4deg" data-tilt>${ill('groupPurse')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:185px;--r:-8deg">${stk('splitok')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:190px;--r:8deg">${stk('envelopes4')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'UX/UI designer in a product team — idea generation, storyboards, prototype, usability tests, UI, pitch'],
    ['Format', 'Concept project: “a mobile bank in 2025”'],
    ['Audience', 'People aged 16 to 22: school students, university students, young workers'],
    ['Platform', 'Mobile app concept (iOS)'],
    ['Deliverables', 'Idea backlog and prioritisation, storyboards, low-fi and hi-fi prototypes, remote usability tests, final UI, presentation'],
    ['Tools', 'Figma, FigJam'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', '2', 'main features: next-generation group wallets and a smart money manager'],
    ['yellow', '4', 'kinds of envelopes: regular, planned, piggy bank, safety cushion'],
    ['mint', '6', 'respondents in moderated remote tests, aged 16–22'],
    ['pink', '4', 'tasks: find group wallets, top up, read “regular spending”, check the history'],
  ];
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    ${title2('TL;DR', 'impact')}
    <p class="bd-mono">Students share flats, trips and class funds, and the hard part isn’t chipping in — it’s counting who owes how much. The concept gives a group one wallet with sections, shows each person what they owe and by when, and lets anyone split their own money into envelopes that fill themselves when income arrives.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s">${v}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">A concept project: there are no production metrics — the evidence is the usability tests and what they changed.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:120px">${icon('purse')}</div><p class="bd-serif-k">Payday: “this goes to the new phone, this to rent, this to a rainy day, this to the hairdresser.” A week later: “…and the TV, the bills, cat food, subscriptions, the gym, a gift for mum” — and when the salary is late, the rainy-day pocket is empty again.</p></div>`)}</div>
    <div class="smb-gallery">
      ${board('s-confused', 'Case: got confused — one purse, too many pockets', 'Case “got confused”: one purse, too many pockets')}
      ${board('s-clear', 'It became clear: four kinds of envelopes', 'It became clear: four kinds of envelopes')}
    </div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['autopay', 'brand', 'Regular spending', 'Put aside for the must-pays: rent, internet, mobile.'],
    ['envelopes', 'yellow', 'Planned spending', 'Plan this month’s purchases: new dishes, the hairdresser, a gift.'],
    ['piggy', 'mint', 'Piggy bank', 'Save for a goal: a new phone, a flat, a Birkin bag.'],
    ['umbrella', 'pink', 'Safety cushion', 'Put aside for the unexpected: a late salary, a hospital.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--lilac"><span class="bd-ico" style="--w:84px">${icon('purse')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:600px">When money comes into a wallet it is split across its sections automatically; anything left over goes to “free money”. The same four envelopes work for one person and for a group.</p>
    <div class="bd-cols4" data-stagger>${steps.map(([ic, t, h, d], i) => win(`envelope_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:96px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- 05 Process ---------- */
  const phases = [
    ['Ideas', 'step 1', 'Generated ideas around people’s money pains and prioritised them by how important and how frequent the need is', 'FigJam', 'lilac'],
    ['Storyboards', 'step 2', 'Scenarios of a group sharing a flat, a trip and a class fund; the first flow sketched on paper', 'FigJam', 'yellow'],
    ['Prototype', 'step 3', 'A first-iteration prototype of group wallets and the money manager to test the hypotheses', 'Figma', 'mint'],
    ['Usability tests', 'step 4', 'Remote moderated tests with a screener and our own interview method; one board per respondent', 'Figma prototype', 'pink'],
    ['Design + pitch', 'step 5', 'Fixed what the tests found, designed the final UI and presented the concept', 'Figma', 'orange'],
  ];
  const process = () => `
  <section class="bd-sec" id="process" data-theme="light">
    ${head('(03) — process', 'HOW WE', 'worked')}
    <div class="bd-phases" data-stagger>${phases.map(([ph, w, a, t, c]) => `<div class="bd-phase bd-tint--${c}"><div class="bd-phase__top"><h3 class="bd-h2">${ph}</h3>${tag(w)}</div><p class="bd-mono-s">${a}</p><span class="bd-label bd-grey">${t}</span></div>`).join('')}</div>
    ${board('s-start', 'First it was something out of nothing: idea board, prioritisation and the first paper flow', '“We thought we were geniuses”: idea board, prioritisation and the first flow')}
  </section>`;

  /* ---------- 06 Research ---------- */
  const screener = [['Age', '16 to 22'], ['Gender', '2 men and 4 women'], ['Occupation', 'school students (grades 10–11), university students, young workers'], ['Geography', 'Moscow and the Moscow region, Lipetsk'], ['Main income', 'a job, freelance, help from parents, a stipend'], ['Experience', 'living in a group of people; splitting bills — some had it, some didn’t']];
  const tasks = ['Find the group wallets page', 'Top up a wallet and check the top-up', 'Understand from the interface what “regular spending” is', 'Look at the wallet history'];
  const insights = [
    ['The biggest problem isn’t chipping in', 'It’s counting who owes how much — so the group wallet shows each person their share and the date.'],
    ['“Regular spending” read as the whole group’s spending', 'Respondents even tried to reach group wallets through it — the wording and the sections needed labels.'],
    ['People top up from the reminder', 'One respondent ignored the “top up” button and used the notification — so reminders became a main entry point.'],
    ['People want to see others’ purchases', 'More detail on what each member spent and topped up, to settle up fairly.'],
    ['Wishes for later', 'Automatic payment of goods and services from a section; tap the chart to see the month’s total.'],
  ];
  const research = () => `
  <section class="bd-sec bd-white-bg" id="research" data-theme="light">
    ${head('(04) — usability tests', 'HOW WE', 'tested')}
    <p class="bd-mono" style="max-width:860px">Remote moderated usability tests of the first-iteration prototype, with a method made for this study. The main goal: check that group wallets are convenient and understood — enter one, put money in, check whether it was topped up, see the members and what they did. Each respondent got a board with hypotheses, wishes, findings and observations.</p>
    <div class="bd-split">
      <div class="smb-seg" data-reveal><span class="bd-label">${T('Who we tested with')}</span>
        ${screener.map(([k, v]) => `<div class="smb-seg__row"><b class="bd-h3">${esc(T(k))}</b><span class="bd-mono-s">${esc(T(v))}</span></div>`).join('')}
      </div>
      <div class="smb-jobs" data-reveal><span class="bd-label">${T('Tasks')}</span>
        <ol>${tasks.map((j) => `<li class="bd-mono-s">${esc(T(j))}</li>`).join('')}</ol>
      </div>
    </div>
    <div class="smb-found" data-stagger>${insights.map(([h, d]) => `<div class="smb-found__row"><p class="bd-h3">${esc(h)}</p><span class="bd-h2 bd-blue" aria-hidden="true">→</span><p class="bd-mono-s">${esc(d)}</p></div>`).join('')}</div>
    <div class="smb-gallery">
      ${board('r-respondent', 'Usability test board of one respondent: hypotheses, wishes, findings, observations', 'One respondent’s board: hypotheses, wishes, findings, observations')}
      ${board('s-problems', 'Problems found in the first iteration', 'Problems found: the wording of “regular spending”')}
    </div>
  </section>`;

  /* ---------- 07 Screens ---------- */
  const screens = [
    ['m-onboarding', 'Onboarding', 'Onboarding: automation', ['Four short screens explain the idea before the first wallet', '“Set up sections your way and the app keeps running your wallet”']],
    ['m-home', 'Home', 'Home: wallets, a reminder, the personal wallet, group wallets and tips', ['Money across wallets and the number of group wallets up top', 'A reminder: “top up the Dorm wallet with ₽2 100 by 21 July” — the way people actually top up', 'Personal and group wallets with progress, and tips like a tax deduction']],
    ['m-personal', 'Personal wallet', 'Personal wallet with envelope sections', ['Balance with top up, pay and transfer', 'Regular, planned and piggy-bank balances as three tiles', 'Each section as a ring: rent 100%, hairdresser 0%, a Birkin bag 0.02%']],
    ['m-groups', 'Group wallets', 'List of group wallets', ['Flat 406, a trip to Georgia, Parents of 7B — members, money and progress', '“Create a wallet” always on top']],
    ['m-trip', 'Trip wallet', 'Trip to Georgia group wallet with sections', ['Free money and the three section types', 'Progress per person: plane tickets 4/4, the tour 2/4, souvenirs 0/4']],
    ['m-trip-history', 'Group history', 'Trip wallet history with a monthly chart', ['A monthly chart and who put in or spent what — the detail respondents asked for']],
    ['m-parents', 'Class fund', 'Parents of 7B: a 28-member class fund', ['Canteen meals, curtains for the class, New Year gifts — x of 30 people paid']],
    ['m-autopay', 'Section settings', 'Section settings: top-up deadline and automatic payment', ['Top-up deadline “by the 20th”', 'Automatic payment of the section’s goods and services — a wish from the tests']],
  ];
  const screensSec = () => `
  <section class="bd-sec" id="flow" data-theme="light">
    ${head('(05) — the design', 'THE', 'screens')}
    <div class="smb-rd">${screens.map(([f, name, alt, notes], i) => `
      <article class="smb-rd__item" data-reveal>
        <div class="bd-handset">${scr(f, alt)}</div>
        <div class="smb-rd__text">
          <b class="bd-label">0${i + 1}</b>
          <h4 class="bd-h2">${esc(T(name))}</h4>
          <ul>${notes.map((n) => `<li class="bd-mono-s">${esc(T(n))}</li>`).join('')}</ul>
          ${full(f, alt)}
        </div>
      </article>`).join('')}
    </div>
  </section>`;

  /* ---------- 08 Solution ---------- */
  const decisions = [
    ['One wallet, many sections', 'A wallet is split into sections; incoming money fills them automatically and the rest becomes free money.'],
    ['Say who owes what, and by when', 'Each member sees their share and the deadline; progress shows how many people have paid.'],
    ['Reminders are the front door', 'Tests showed people top up from the notification, so the reminder sits on top of home.'],
    ['Name the envelopes plainly', '“Regular” was misread as the group’s spending — each section now carries its type, an icon and examples.'],
    ['Everyone’s moves in the history', 'Who put in and who spent what, by month, so settling up is fair.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    ${title2('THE', 'solution')}
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
  </section>`;

  /* ---------- 09 What the tests changed ---------- */
  const rows = [
    ['Tried to reach group wallets through “regular spending”', 'Group wallets got their own tab and a block on home'],
    ['“Regular spending” read as the group’s monthly spending', 'Section type, icon and examples on every section'],
    ['Topped up from the notification, not the button', 'A top-up reminder with the amount and the date on home'],
    ['Hard to count who owes how much', 'Each person’s share, deadline and “x of N paid” per section'],
    ['Wanted to see others’ purchases', 'History by member and a monthly chart in each wallet'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(06) — outcome', 'WHAT THE TESTS', 'changed')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>What we saw</th><th>What changed</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td class="bd-h3">${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('piggy')}</div>
      <div><p class="bd-serif-l bd-quote__text">“Life is a game, and money is how we keep score.”</p><span class="bd-label">Ted Turner — the closing slide of our pitch</span></div></div>
  </section>`;

  /* ---------- 10 Reflection ---------- */
  const learn = [
    [icon('group'), 'Find the real job', 'We designed for chipping in; the tests showed the job was counting who owes what.'],
    [icon('envelopes'), 'Words are interface', 'One label — “regular spending” — sent people the wrong way more than any layout.'],
    [icon('autopay'), 'Meet people where they act', 'If people top up from a reminder, the reminder is the feature.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(07) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.wallet = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['process', 'Process'], ['research', 'Research'], ['flow', 'Screens'], ['solution', 'Solution'], ['results', 'Outcome'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${how()}${process()}${research()}${screensSec()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
