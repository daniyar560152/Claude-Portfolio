/*
 * Car loan case — c2c online car loan for used cars (Eurasian Bank, eucredit).
 * Built from the SWAMP MARKET Figma file, "Section 2" (node 165:15918): mobile + desktop flow,
 * usability tests (old design and new design), phone interviews with a JTBD analysis and a persona.
 * Results come from the 2023 portfolio deck (c2c car loan, Q3 → Q4 2022).
 * Screens scroll after a click/tap (board-market.js) and open full size (board-smartbank.js).
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);
  const T = (s) => K().T(s), title2 = (a, b) => K().title2(a, b);
  const IMG = 'assets/img/carloan/';

  const SIZE = {
    'm-landing': [750, 4626], 'm-calc': [750, 2662], 'm-confirm': [750, 1334], 'm-extra': [750, 2592], 'm-approved': [750, 1992],
    'm-sto': [750, 1812], 'm-sms': [750, 1346], 'm-roadhelp': [750, 3656],
    'd-landing': [1600, 1665], 'd-calc': [1600, 1283], 'd-approved': [1600, 1048], 'd-extra': [1600, 1272],
    'r-usability': [1289, 2692], 'r-jtbd': [1600, 1094], 'r-oldtest': [1600, 1782],
  };
  const URL_ = 'eucredit.eubank.kz';

  /* ---------- screens: browser + phone panels, scroll after a click, open full screen ---------- */
  const scr = (file, alt) => {
    const [w, h] = SIZE[file];
    return `<div class="bd-scrwrap bd-scrwrap--${file[0] === 'd' ? 'desk' : 'phone'}">
      <div class="bd-scr" tabindex="0" role="region" aria-label="${esc(T(alt))} — ${esc(T('scrollable screen'))}">
        <img src="${IMG}${file}.webp" alt="${esc(T(alt))}" width="${w}" height="${h}" loading="lazy" decoding="async">
      </div>
      <i class="bd-scr__bar" aria-hidden="true"></i>
      <span class="bd-scr__hint bd-label" aria-hidden="true"><span class="for-mouse">${T('Click to scroll the screen')}</span><span class="for-touch">${T('Tap to scroll the screen')}</span></span>
    </div>`;
  };
  const full = (file, alt) => `<button class="bd-full" type="button" data-smb-zoom="${IMG}${file}.webp"${file[0] === 'd' ? '' : ' data-phone'} data-alt="${esc(T(alt))}" aria-label="${esc(T('Open full size'))}: ${esc(T(alt))}"><span aria-hidden="true">⤢</span>${T('Full screen')}</button>`;
  const stage = ([file, label, alt]) => {
    const desk = file[0] === 'd';
    const device = desk
      ? `<div class="bd-browser"><div class="bd-browser__bar"><i class="bd-browser__dots" aria-hidden="true"><b></b><b></b><b></b></i><span class="bd-browser__url">${URL_}</span></div>${scr(file, alt)}</div>`
      : `<div class="bd-handset">${scr(file, alt)}</div>`;
    return `<figure class="bd-stage bd-stage--${desk ? 'desk' : 'phone'}"><figcaption class="bd-stage__head"><span class="bd-label">${esc(T(label))}</span>${full(file, alt)}</figcaption><div class="bd-stage__body">${device}</div></figure>`;
  };
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
  <section class="bd-sec bd-hero bd-hero--orange" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">${T('Case')} ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(${T('Case')} ${p.no}) — ${T('Eurasian Bank')} · ${T('c2c car loan')}</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">USED CAR</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">on credit,</span><span class="bd-display-l" data-split="chars">IN 2 MINUTES</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:760px">A used car bought from another person, on credit, approved online. I researched how people really take a car loan, tested the old flow and the new one, and designed the whole way from the landing to the decision for mobile and desktop.</p>
    <div class="bd-tags">${['Online lending', 'Responsive web', 'UX research', 'Usability testing', 'Fintech'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('keyTag')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('macCar')}</div>
      <div class="bd-art" style="--w:320px;--r:-4deg" data-tilt>${ill('carLoan')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:150px;--r:-8deg">${stk('twomin')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:190px;--r:8deg">${stk('usedcar')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'UX/UI designer in the c2c web team — interviews, usability tests, flow, mobile and desktop UI'],
    ['Timeline', '2022 · research and tests in spring–summer, results Q3 → Q4'],
    ['Team', 'c2c web team: product owner, analysts, front- and back-end developers'],
    ['Platform', 'Responsive web — mobile and desktop · RU / KZ'],
    ['Deliverables', 'Interviews, JTBD, persona, 2 usability tests, landing, calculator, verification, extra info, decision, service-station list'],
    ['Tools', 'Figma, FigJam'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', '×2.5', 'online car loans issued: ₸1.94 bn → ₸4.81 bn, Q3 → Q4 2022'],
    ['yellow', '78.79', 'NPS AUTO online, up from 61'],
    ['mint', '8%', 'car-loan conversion, up from 6%'],
    ['pink', '2 min', 'to a decision, online'],
  ];
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    ${title2('TL;DR', 'impact')}
    <p class="bd-mono">Buying a used car on credit meant a day at the car registration centre: a queue to the bank’s consultant, a wait for the card, and a call centre that couldn’t answer. The new flow gives a decision online in two minutes, shows the monthly payment and the overpayment before you apply, and leaves one visit — to check the car and sign.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s">${v}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">Results are the bank’s numbers for the c2c car loan, Q3 → Q4 2022, from my 2023 portfolio report.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const goals = [
    ['Business goals', 'yellow', ['More c2c car loans issued online', 'Fewer branch and call-centre touches', 'Keep the low first payment as the hook']],
    ['User goals', 'mint', ['A decision online, in minutes', 'Monthly payment and overpayment before applying', 'One visit: check the car and sign']],
    ['Constraints', 'pink', ['A c2c deal: buyer, seller and the car', 'Car check at a special service station', 'State databases may not return data', 'RU / KZ, mobile first']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:120px">${icon('car')}</div><p class="bd-serif-k">People pick a used car on Kolesa.kz, but the loan for it lived offline: a long queue to the bank’s consultant at the car registration centre, a wait for the card, rates and overpayment nowhere to be seen, and a call centre without answers about c2c lending.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['gauge', 'brand', 'Apply online', 'Enter your data on the site and get a decision in a few minutes.'],
    ['wrench', 'yellow', 'Check the car', 'A manager calls and books you and the seller into a special service station.'],
    ['carKey', 'mint', 'Sign and drive', 'Re-register the car and sign the loan with a bank manager — the bank pays the seller.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--orange"><span class="bd-ico" style="--w:84px">${icon('steering')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:560px">Three steps to buy a used car: up to ₸15 m, 2 to 7 years, first payment from 10%, no proof of income, no fees for early repayment.</p>
    <div class="bd-cols3" data-stagger>${steps.map(([ic, t, h, d], i) => win(`step_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:96px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- 05 Research ---------- */
  const methods = [
    ['gauge', 'lilac', 'Analytics', 'Applications from Nov 2021 to May 2022 by age and gender: the core is 21–35, 59% men.'],
    ['steering', 'yellow', 'Phone interviews', 'Calls to clients just approved for a car loan: why a car, why used, why this bank, what got in the way.'],
    ['carKey', 'mint', 'JTBD analysis', 'Answers sorted into reasons, desires, constraints and solutions — the job story of a c2c car loan.'],
    ['car', 'pink', 'Persona', 'Built on the bank’s data for Jan – Aug 2022 and the interviews.'],
    ['wrench', 'orange', 'Test of the old flow', '5 testers: 98% success, NPS 9, 6:12 average time — and a list of pains for every step.'],
    ['towTruck', 'brand', 'Test of the new flow', '15 June 2022, moderated, offline at a branch: 8 respondents aged 21–35, 26 tasks.'],
  ];
  const jtbd = [
    ['Reasons', ['No large sum in cash', 'Saving doesn’t work out', 'Getting around the city fast and comfortably']],
    ['Desires', ['Buy the car “today”, not save for years', 'Get the car card quickly and easily', 'Not wait long for the consultant']],
    ['Constraints', ['Long wait for the card at a branch', 'Long queue to the consultant', 'High interest', 'No information at hand — the call centre can’t answer']],
    ['Solutions', ['Speed up issuing car cards at branches', 'Time slots for the consultant', 'A call-centre script for c2c questions', 'Move everything online (ideally)']],
  ];
  const oldPains = [
    ['Main page with terms', 'The rate and the first payment are not written anywhere; nothing about insurance'],
    ['Filling in data', 'No mask for the car price; no overpayment'],
    ['Sign-in', 'Not obvious that you need to press “send code” to get the SMS'],
    ['ID scan', 'The illustration frame covers the ID card; heavy fonts'],
    ['Extra data', 'Small font; “contact person data” is unclear'],
    ['Confirmation', '“Repayment term” reads like early repayment — renamed to “loan term”; no rate, no overpayment up front'],
  ];
  const research = () => `
  <section class="bd-sec bd-white-bg" id="research" data-theme="light">
    ${head('(03) — research', 'HOW I', 'researched')}
    <div class="smb-layers smb-layers--3" data-stagger>${methods.map(([ic, t, h, d], i) => `<div class="smb-layer bd-tint--${t}"><div class="smb-layer__top"><span class="bd-ico" style="--w:60px">${icon(ic)}</span><b class="bd-label">0${i + 1}</b></div><h3 class="bd-h2">${h}</h3><p class="bd-mono-s">${d}</p></div>`).join('')}</div>

    <h3 class="bd-h1 smb-subhead">${T('Job story · a c2c car loan')}</h3>
    <div class="cl-jtbd" data-stagger>${jtbd.map(([h, items]) => `<div class="cl-jtbd__col"><span class="bd-label">${esc(T(h))}</span>${items.map((x) => `<p class="bd-mono-s">${esc(T(x))}</p>`).join('')}</div>`).join('')}
      <div class="cl-jtbd__gains"><span class="bd-label">${T('Gains')}</span><p class="bd-mono-s">${T('A small first payment')}</p><p class="bd-mono-s">${T('Fast, clear application online')}</p></div>
    </div>

    <h3 class="bd-h1 smb-subhead">${T('Persona')}</h3>
    <div class="cl-persona" data-reveal>
      <div class="cl-persona__id"><span class="bd-ico" style="--w:110px">${icon('steering')}</span><b class="bd-h2">${T('Aidos, 27 · Almaty')}</b>
        <p class="bd-mono-s">${T('Married, two children · salary ₸200 000 a month, no extra income · already took a loan with the bank, installed Smartbank after it')}</p></div>
      <div class="cl-persona__cols">
        <div><span class="bd-label">${T('The car and the loan')}</span><p class="bd-mono-s">${T('Bought a Toyota for ₸6.5 m (also looked at Hyundai and Kia), 20% first payment, ₸4.5 m loan for the maximum 7 years — about ₸175 000 a month. Found the car through friends and Kolesa.kz.')}</p></div>
        <div><span class="bd-label">${T('Needs')}</span><p class="bd-mono-s">${T('Lots to do in the city and wants to get around fast. Takes a loan because saving doesn’t work out. Wants to spend as little time and effort on the loan as possible.')}</p></div>
        <div><span class="bd-label">${T('Pains')}</span><p class="bd-mono-s">${T('Long wait for the card at the branch, a long queue to the consultant at the registration centre, high interest, no information at hand.')}</p></div>
      </div>
    </div>

    <h3 class="bd-h1 smb-subhead">${T('What hurt in the old flow')}</h3>
    <div class="bd-cols4" data-stagger>
      <div class="bd-metric"><b class="bd-metric-l">5</b><span class="bd-label">${T('testers')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">98%</b><span class="bd-label">${T('success rate')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">9</b><span class="bd-label">${T('NPS score')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">6:12</b><span class="bd-label">${T('average time')}</span></div>
    </div>
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Step</th><th>Client pains</th></tr></thead>
      <tbody>${oldPains.map((r) => `<tr><td class="bd-h3">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>
    <div class="smb-gallery">
      ${board('r-oldtest', 'Usability test of the old flow: results and pains by step', 'Old flow test · results and pains by step')}
      ${board('r-jtbd', 'Interview analysis in the JTBD framework', 'Interview analysis · JTBD')}
    </div>
  </section>`;

  /* ---------- 06 User flow ---------- */
  const flows = [
    { no: '01', word: 'LANDING', serif: 'decide', frame: 'orange', sticker: icon('car'), text: 'The offer in three numbers — 2 minutes, up to ₸15 m, 2 to 7 years — then the three steps, the benefits and the FAQ about road assistance.', s: [['d-landing', 'landing — web', 'Car loan landing, web'], ['m-landing', 'landing — mobile', 'Car loan landing, mobile']] },
    { no: '02', word: 'CALCULATOR', serif: 'count', frame: 'yellow', sticker: icon('gauge'), text: 'Car and loan terms in one form. The monthly payment, loan amount and overpayment update as you type; road assistance is an add-on with a clear state.', s: [['d-calc', 'calculator — web', 'Loan calculator, web'], ['m-calc', 'calculator — mobile', 'Loan calculator, mobile']] },
    { no: '03', word: 'ROAD HELP', serif: 'add', frame: 'mint', sticker: icon('towTruck'), text: 'What road assistance includes, and a plain note that its price goes into the loan — the part people misunderstood in the test.', s: [['m-roadhelp', 'road assistance — mobile', 'Road assistance details, mobile']] },
    { no: '04', word: 'VERIFY', serif: 'confirm', frame: 'lilac', sticker: icon('carKey'), text: 'Phone and IIN, consent in one line, then a 6-digit SMS code with a resend timer.', s: [['m-confirm', 'confirm data — mobile', 'Confirm your data, mobile'], ['m-sms', 'SMS code — mobile', 'SMS code, mobile']] },
    { no: '05', word: 'EXTRA INFO', serif: 'fill', frame: 'pink', sticker: icon('steering'), text: 'Only what state databases can’t give: family, income, extra income with quick amounts, and a contact person — explained as “not you”. Four versions depending on what the marriage registry returns.', s: [['d-extra', 'extra info — web', 'Additional information, web'], ['m-extra', 'extra info — mobile', 'Additional information, mobile']] },
    { no: '06', word: 'DECISION', serif: 'next', frame: 'blue', sticker: icon('wrench'), text: 'Approved, with the car and the terms, and “what’s next”: a manager calls between 9:00 and 19:00, the car check, signing — then the service-station list with queue times.', s: [['d-approved', 'decision — web', 'Car loan approved, web'], ['m-approved', 'decision — mobile', 'Car loan approved, mobile'], ['m-sto', 'service stations — mobile', 'Special service stations, mobile']] },
  ];
  const flowCard = (f) => `
    <article class="bd-card is-wide bd-card--screens bd-frame--${f.frame}" data-reveal>
      <div class="bd-card__inner bd-flowcard">
        <div class="bd-flowcard__text">
          <div class="bd-card__top"><div class="bd-card__title"><b class="bd-h1 bd-blue">${f.no}</b><b class="bd-h1">${f.word}</b><i class="bd-serif-m">${f.serif}</i></div>${tag(f.s.some((x) => x[0][0] === 'd') ? (f.s.some((x) => x[0][0] === 'm') ? 'web + mobile' : 'web') : 'mobile')}</div>
          <p class="bd-mono-s">${esc(f.text)}</p>
        </div>
        <div class="bd-stages cl-stages cl-stages--${f.s.map((x) => x[0][0]).join('')}">${f.s.map(stage).join('')}</div>
      </div>
      <div class="bd-card__sticker">${f.sticker}</div>
    </article>`;
  const showcase = () => `
  <section class="bd-sec bd-center-col" id="flow" data-theme="light">
    ${head('(04) — the real product', 'USER', 'flow')}
    <div class="bd-flowline">${['Landing', 'Calculator', 'Road help', 'Phone + IIN', 'SMS', 'Extra info', 'Decision', 'Service station'].map((l, i) => tag(`0${i + 1} ${l}`, 'ink')).join('<span class="bd-h3">→</span>')}</div>
    ${flows.map(flowCard).join('')}
  </section>`;

  /* ---------- 07 Test of the new flow ---------- */
  const findings = [
    ['1/8 didn’t know an asterisk means a required field; 2/8 knew but missed it', 'Asterisks in a brighter colour, and a line that fields with * are required'],
    ['1/8 didn’t see road assistance as an add-on; 3/8 didn’t see its price in the monthly payment; 3/8 thought it was off while it was on', 'A note that the price is in the monthly payment, and a labelled state instead of a bare switch'],
    ['2/8 thought the contact person was themselves', '“Not you” said in the text'],
    ['1/8 couldn’t say what the decision screen meant; 2/8 hesitated whether the loan was already issued', 'Say clearly it is an approval, not the final deal — and show what’s next'],
  ];
  const test = () => `
  <section class="bd-sec" id="test" data-theme="light">
    ${head('(05) — usability test', 'DID IT', 'work')}
    <div class="bd-cols4" data-stagger>
      <div class="bd-metric"><b class="bd-metric-l">8</b><span class="bd-label">${T('respondents, 7 men and 1 woman')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">21–35</b><span class="bd-label">${T('age — the core of applications')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">26</b><span class="bd-label">${T('tasks across every screen')}</span></div>
      <div class="bd-metric"><b class="bd-metric-l">15.06</b><span class="bd-label">${T('2022, moderated, offline at a branch')}</span></div>
    </div>
    <p class="bd-mono" style="max-width:820px">Clients understood the process and the content of every screen, except the moments below — each became a change.</p>
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>What we saw</th><th>What changed</th></tr></thead>
      <tbody>${findings.map((r) => `<tr><td>${esc(r[0])}</td><td class="bd-h3">${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>
    ${board('r-usability', 'Usability test of the new c2c car loan flow', 'New flow test · tasks, results and changes')}
  </section>`;

  /* ---------- 08 Solution ---------- */
  const decisions = [
    ['Money before data', 'Monthly payment, loan amount and overpayment on the calculator — the rate and overpayment people missed in the old flow.'],
    ['Ask only what the state can’t tell', 'Data comes from state databases; the extra-info screen has four versions depending on what the marriage registry returns, and a skipped extra income counts as zero.'],
    ['Add-ons you can read', 'Road assistance shows what it covers, that it is on, and that its price is in the monthly payment.'],
    ['Approval is not the deal', 'The decision screen says what was approved and what happens next — manager call, car check, signing.'],
    ['One flow, two sizes', 'Mobile first, the same steps on desktop with a stepper: Home — Data — Confirmation — Extra info — Decision.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    ${title2('THE', 'solution')}
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
  </section>`;

  /* ---------- 09 Results ---------- */
  const rows = [
    ['Online car loans issued (c2c, b2c)', '₸1 939.6 m', '₸4 809.4 m', '×2.5'],
    ['NPS AUTO online', '61', '78.79', '+17.8'],
    ['Car-loan conversion, with the offline flow', '6%', '8%', '+2 pp'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(06) — results', 'THE', 'results')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Q3 2022</th><th>Q4 2022</th><th>Change</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="bd-h3 bd-blue">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <p class="bd-mono-s bd-grey">${T('Next step: re-registering the car for the buyer and the seller right in Smartbank.')}</p>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('towTruck')}</div>
      <div><p class="bd-serif-l bd-quote__text">“People buy the car, not the loan — so the loan has to get out of the way.”</p><span class="bd-label">Design principle behind the flow</span></div></div>
  </section>`;

  /* ---------- 10 Reflection ---------- */
  const learn = [
    [icon('steering'), 'Call the people you just approved', 'Five-minute phone calls after approval told us more about the job than any survey.'],
    [icon('gauge'), 'Show the money first', 'Rate and overpayment were the first thing testers asked for — the calculator now leads with them.'],
    [icon('wrench'), 'Test twice', 'The old-flow test showed what to fix; the new-flow test caught the small words that still confused people.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(07) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.carloan = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['research', 'Research'], ['flow', 'User flow'], ['test', 'Testing'], ['solution', 'Solution'], ['results', 'Results'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${how()}${research()}${showcase()}${test()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
