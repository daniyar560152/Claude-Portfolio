/*
 * Car re-registration case — digital re-registration, GovTech registration and pledge for a car loan
 * (Eurasian Bank, c2c team). Built from the SWAMP MARKET Figma file, "Section 3" (node 170:5993):
 * prototype v1.1 (buyer + seller), flow mapping of the B2B2C digital car loan, the "car check" feature,
 * signing + biometrics with the state database, and pledge on/off in Smartbank.
 * Results: the 2023 portfolio deck, "Re-registering the car for the buyer and the seller in Smartbank".
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);
  const T = (s) => K().T(s), title2 = (a, b) => K().title2(a, b);
  const IMG = 'assets/img/rereg/';
  const SIZE = {
    'm-landing': [750, 4808], 'm-approved': [750, 1930], 'm-check': [750, 4388], 'm-sign': [750, 2564], 'm-bio': [750, 1624],
    'm-plates': [750, 1624], 'm-register': [750, 1624], 'm-fee': [750, 1624], 'm-sms': [750, 1624], 'm-done': [750, 1624], 'r-pledge': [1851, 2110],
  };
  const scr = (file, alt) => {
    const [w, h] = SIZE[file];
    return `<div class="bd-scrwrap bd-scrwrap--phone">
      <div class="bd-scr" tabindex="0" role="region" aria-label="${esc(T(alt))} — ${esc(T('scrollable screen'))}">
        <img src="${IMG}${file}.webp" alt="${esc(T(alt))}" width="${w}" height="${h}" loading="lazy" decoding="async">
      </div>
      <i class="bd-scr__bar" aria-hidden="true"></i>
      <span class="bd-scr__hint bd-label" aria-hidden="true"><span class="for-mouse">${T('Click to scroll the screen')}</span><span class="for-touch">${T('Tap to scroll the screen')}</span></span>
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
  <section class="bd-sec bd-hero bd-hero--mint" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">${T('Case')} ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(${T('Case')} ${p.no}) — ${T('Eurasian Bank')} · ${T('c2c car loan')} · GovTech</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">RE-REGISTER</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">the car,</span><span class="bd-display-l" data-split="chars">NOT THE QUEUE</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:780px">After the loan is approved, the car still has to change hands: re-registration, new plates, state fees and a pledge — all of it used to mean a day at the registration centre for both the buyer and the seller. I designed the digital version: the buyer and the seller each finish their part online, with biometrics, an e-signature and the state services behind it.</p>
    <div class="bd-tags">${['GovTech', 'Biometrics', 'E-signature', 'Service design', 'Fintech'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('bioCheck')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('govMac')}</div>
      <div class="bd-art" style="--w:330px;--r:-4deg" data-tilt>${ill('plateFrame')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:150px;--r:-8deg">${stk('esign')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:200px;--r:8deg">${stk('kzplate')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'UX/UI designer in the c2c team — flow mapping, buyer and seller flows, prototype v1.1, edge cases, UI'],
    ['Timeline', 'From Q3 2022 — results Q3 → Q4 2022'],
    ['Team', 'c2c team with back-office, GovTech integration and the bank’s core systems (Credo, ABIS)'],
    ['Platform', 'Responsive web for the buyer and the seller + Smartbank for the pledge'],
    ['Deliverables', 'Service flow map, buyer and seller flows, car check, biometrics + e-signature, registration and plates, state fee, pledge on/off, error states'],
    ['Tools', 'Figma, FigJam'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', '78.79', 'NPS AUTO online (I join), up from 61'],
    ['yellow', '8%', 'car-loan conversion with the offline flow, up from 6%'],
    ['mint', '2', 'sides finish online: the buyer and the seller'],
    ['pink', '8', 'stages mapped, from approval to the keys'],
  ];
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    ${title2('TL;DR', 'impact')}
    <p class="bd-mono">The buyer gets the approval, enters the seller’s plate and IIN, checks the car’s history, passes biometrics and signs with an e-signature, picks a plate and pays the state fee. The seller gets an SMS, confirms the sale, keeps their plate if they want and gets paid. The pledge is registered — and later removed — from Smartbank.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s">${v}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">NPS and conversion are the bank’s numbers for “re-registering the car for the buyer and the seller in Smartbank”, Q3 → Q4 2022, from my 2023 portfolio report.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const goals = [
    ['Business goals', 'yellow', ['Make the car loan more attractive than other banks’', 'Fund faster — in parallel with the new plates', 'Fewer manual steps for managers and the back office']],
    ['User goals', 'mint', ['Re-register the car without a queue', 'Know the car is clean before paying', 'Keep my plate number if I sell']],
    ['Constraints', 'pink', ['State services: registration, fines and taxes, state fees', 'Biometrics and an e-signature with the state database', 'Compliance and regulator checks', 'Spouse consent for a pledge']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:120px">${icon('govBuilding')}</div><p class="bd-serif-k">An approved loan wasn’t a car yet. The buyer and the seller had to meet at the registration centre, re-register the car on paper, pay the fees, put the car in pledge and only then could the bank pay the seller. Every step was a queue, and a reason to choose another bank.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['faceScan', 'brand', 'Buyer', 'Approval → seller’s plate, IIN and phone → car check → biometrics and e-signature → registration, plate and state fee.'],
    ['handshake', 'yellow', 'Seller', 'SMS link → confirm the sale → keep the plate for 6 months → choose the card for the payout → sign.'],
    ['pledge', 'mint', 'Bank', 'Pledge registered through Smartbank, the seller paid, the buyer takes the keys.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--mint"><span class="bd-ico" style="--w:96px">${icon('plate')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:600px">Three parties, one deal. Each side gets only its own steps, and the state services run in the background.</p>
    <div class="bd-cols3" data-stagger>${steps.map(([ic, t, h, d], i) => win(`side_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:96px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- 05 Service map ---------- */
  const stages = [
    ['Approval', 'via a broker or online, 100%'],
    ['Sale confirmed', 'tripartite agreement signed with an e-signature'],
    ['First payment', 'at the dealer’s cash desk or online by any bank’s card'],
    ['Primary registration', 'GovTech: plate and vehicle passport'],
    ['Loan documents', 'biometrics + e-signature with the state database'],
    ['Spouse consent', 'SMS link, biometrics and e-signature'],
    ['Pledge', 'registered automatically, state fee paid by the bank'],
    ['Funding + keys', 'in parallel with delivering the new plates'],
  ];
  const map = () => `
  <section class="bd-sec bd-white-bg" id="map" data-theme="light">
    ${head('(03) — service map', 'MAPPING', 'the deal')}
    <p class="bd-mono" style="max-width:860px">Before screens, I mapped the whole service — what the client does, what the manager does, which system answers and where the state comes in — first for a new car from a dealer (B2B2C), then for a used car between two people. Eight stages, from approval to the keys:</p>
    <ol class="rr-stages" data-stagger>${stages.map(([h, d], i) => `<li class="rr-stage"><b class="bd-label">0${i + 1}</b><h3 class="bd-h3">${esc(T(h))}</h3><p class="bd-mono-s">${esc(T(d))}</p></li>`).join('')}</ol>
    <div class="bd-split">
      <div class="smb-jobs" data-reveal><span class="bd-label">${T('Car check — scenarios we designed')}</span>
        <ul>${['Loading screen with a message while the state data is fetched', 'Error: data couldn’t be sent or received', 'Error: the plate number wasn’t found', 'Error: the car doesn’t match the bank’s matrix', 'No critical issues: history, no restrictions, insurance, inspection, fines'].map((x) => `<li class="bd-mono-s">${esc(T(x))}</li>`).join('')}</ul>
      </div>
      <div class="smb-jobs" data-reveal><span class="bd-label">${T('Pledge in Smartbank')}</span>
        <ul>${['The loan waits for “pledge registration” in the core system', 'In Smartbank → state services → “Put the car in pledge”', 'Biometrics, then a check for fines and taxes — pay them from the card', 'Pay the state fees, sign the application with an e-signature', 'The state service replies, the documents are saved, an SMS confirms', 'The same way back when the loan is closed: “Remove from pledge”'].map((x) => `<li class="bd-mono-s">${esc(T(x))}</li>`).join('')}</ul>
      </div>
    </div>
    ${board('r-pledge', 'Flow map: putting the car in pledge and removing it in Smartbank', 'Pledge on and off in Smartbank · flow map')}
  </section>`;

  /* ---------- 06 Screens ---------- */
  const screens = [
    ['m-landing', 'Landing', 'Car loan landing with “Re-register the car on credit”', ['The same landing as the online car loan, with a second action — “Re-register the car on credit”']],
    ['m-approved', 'Approved — seller data', 'Approved application with the seller’s data form', ['The approved terms stay on top', 'Three fields for the seller: plate, IIN and phone']],
    ['m-check', 'Car check', 'Car purchase: technical and legal check', ['Plate and year, “the car meets technical and legal norms”', 'Price compared with similar cars — “₸450 000 cheaper (15%)”', 'Registration history, no sale restrictions, insurance, inspection — and fines, in orange']],
    ['m-bio', 'Biometrics', 'Biometric check: look to the right', ['Liveness check against the state database before anything is signed']],
    ['m-sign', 'Documents', 'Signing the documents', ['Every document in one list: loan, client form, schedule, insurance, tripartite agreement, pledge', 'One “Sign” with the e-signature, and a clear line on the bank’s responsibility']],
    ['m-register', 'Registration', 'Car registration: region, issuing office and plate type', ['Region and issuing office', 'Plate: a saved one or a new standard one']],
    ['m-plates', 'Plate number', 'Choose a plate from the saved list', ['Saved plates as real-looking KZ plates']],
    ['m-fee', 'State fee', 'State fee: vehicle passport and registration fee', ['Two fees, the total and “commission 0 ₸” before paying']],
    ['m-sms', 'Seller — SMS', 'SMS to the seller with a link to confirm the sale', ['“Daniyar named you as the seller of a Toyota Camry 2012 for ₸8 690 000 — confirm or cancel”']],
    ['m-done', 'Done', 'Re-registration completed, what’s next', ['Re-registered ✓, then the pledge, then the bank pays the seller and you get the keys']],
  ];
  const screensSec = () => `
  <section class="bd-sec" id="flow" data-theme="light">
    ${head('(04) — the design', 'THE', 'screens')}
    <div class="smb-rd">${screens.map(([f, name, alt, notes], i) => `
      <article class="smb-rd__item" data-reveal>
        <div class="bd-handset">${scr(f, alt)}</div>
        <div class="smb-rd__text">
          <b class="bd-label">${String(i + 1).padStart(2, '0')}</b>
          <h4 class="bd-h2">${esc(T(name))}</h4>
          <ul>${notes.map((n) => `<li class="bd-mono-s">${esc(T(n))}</li>`).join('')}</ul>
          ${full(f, alt)}
        </div>
      </article>`).join('')}
    </div>
  </section>`;

  /* ---------- 07 Solution ---------- */
  const decisions = [
    ['Each side sees only its part', 'The buyer and the seller get separate flows; the seller joins from an SMS, without an app.'],
    ['Check the car before money moves', 'Registration history, restrictions, insurance, inspection and fines — plus the price against similar cars.'],
    ['Biometrics instead of a visit', 'A liveness check and an e-signature replace signing at the registration centre.'],
    ['The state in the background', 'Registration, plates and fees go through GovTech; the bank pays the fee for the pledge.'],
    ['Errors are part of the design', 'Every place a state service can fail has its own screen and a way forward.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    ${title2('THE', 'solution')}
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
  </section>`;

  /* ---------- 08 Results ---------- */
  const rows = [
    ['NPS AUTO online (I join)', '61', '78.79', '+17.8'],
    ['Car-loan conversion, with the offline flow', '6%', '8%', '+2 pp'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(05) — results', 'THE', 'results')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Q3 2022</th><th>Q4 2022</th><th>Change</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="bd-h3 bd-blue">${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('handshake')}</div>
      <div><p class="bd-serif-l bd-quote__text">“The deal is between two people — the bank should make it feel that simple.”</p><span class="bd-label">Design principle behind the flow</span></div></div>
  </section>`;

  /* ---------- 09 Reflection ---------- */
  const learn = [
    [icon('govBuilding'), 'Map the service first', 'With the state, the dealer, the bank and two clients, the screens only made sense after the whole map did.'],
    [icon('eSign'), 'Design the failure paths', 'State services time out and return nothing — those screens matter as much as the happy path.'],
    [icon('handshake'), 'The second user counts', 'The seller never chose our bank; their part had to work from one SMS.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(06) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.rereg = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['map', 'Service map'], ['flow', 'Screens'], ['solution', 'Solution'], ['results', 'Results'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${how()}${map()}${screensSec()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
