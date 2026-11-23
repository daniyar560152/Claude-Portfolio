/*
 * Otbasy early-repayment case — rendered as the Figma case board (SWAMP MARKET file, node 118:7599,
 * "Case / Otbasy — Early loan repayment"), section by section, in the Daniyar portfolio design system.
 * Problem shares come from 2 236 real branch service-desk tickets; targets are goals, not results.
 * Uses the shared helpers from board-housing.js (window.BOARD_KIT).
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);

  /* ---------- 01 Hero ---------- */
  const hero = (p) => `
  <section class="bd-sec bd-hero bd-hero--mint" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">Case ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(Case ${p.no}) — Otbasy Bank · early loan repayment</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">PAY OFF</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">early,</span><span class="bd-display-l" data-split="chars">IN THE APP</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:720px">Otbasy Bank clients repay their housing loan ahead of schedule — partly or in full — and lift the encumbrance from their home. Redesigned from a branch visit and paper forms into two guided flows inside the mobile app.</p>
    <div class="bd-tags">${['Mobile app', 'iOS / Android', 'Design system', 'SMS signing', 'Gov registry'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('calcFrame')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('macPay')}</div>
      <div class="bd-art" style="--w:300px;--r:-4deg" data-tilt>${ill('unlocked')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:185px;--r:-8deg">${stk('coins')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:150px;--r:10deg">${stk('paidoff')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'Lead product designer — flows, UI, copy, components, handoff'],
    ['Timeline', '8 weeks · Jun – Jul 2026'],
    ['Team', 'PO, 2 analysts, iOS & Android devs, backend, legal'],
    ['Platform', 'Mobile app (iOS / Android) + Baspana Market web · RU / KZ'],
    ['Deliverables', 'Ticket analysis, problem map, 2 end-to-end flows, 30+ hi-fi screens, prototype, specs'],
    ['Tools', 'Figma, FigJam, Excel, Maze, Amplitude, Jira'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', 2236, '', '', 'branch tickets on early repayment'],
    ['yellow', 75, '', '%', 'needed no code fix — design gaps'],
    ['mint', 36, '', '%', 'pension (ЕПВ) application “not found”'],
    ['pink', 187, '', '', 'stuck applications cancelled by hand'],
  ];
  const fmt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    <h2 class="bd-head__title bd-left"><span class="bd-display-l" data-split="chars">TL;DR</span><span class="bd-serif-l" data-split="words">impact</span></h2>
    <p class="bd-mono">Branches logged 2 236 service-desk tickets about early repayment — and 75% of them were not bugs but design gaps: a hidden pension step, old applications blocking new ones, silent statuses and an encumbrance flow that ended at a public service centre. The redesign closes each gap inside the app.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, pre, suf, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s" data-count="${v}" data-group="1" data-prefix="${pre}" data-suffix="${suf}" data-decimals="0">${pre}${fmt(v)}${suf}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">Problem shares come from 2 236 real branch service-desk tickets (archive) and 179 from May 2026. Targets in the last table are goals, not measured outcomes.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const goals = [
    ['Business goals', 'yellow', ['Cut early-repayment tickets from branches', 'No more manual cancelling of stuck applications', 'Fewer clients sent to a public service centre']],
    ['User goals', 'mint', ['See which pension application will be used', 'Resume or cancel my own application', 'Know the status — and what to do next']],
    ['Constraints', 'pink', ['ЕПВ needs an ЕНПФ application in the right status', 'Loan purpose / unconfirmed amount limits ЕПВ use', 'State registry can refuse online removal', 'Core banking timeouts on the last step']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:120px">${icon('bank')}</div><p class="bd-serif-k">Clients can repay early in the app, but branches logged 2 236 tickets about it: 36% the pension (ЕПВ) application was “not found”, 19% an old application blocked a new one, and encumbrance removal often ended with “go to a public service centre”. Support fixed most of them by hand — 75% needed no code change at all.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['bankCard', 'brand', 'Choose an account', 'Special, current, or pension (ЕПВ) + current — balances shown up front.'],
    ['coins', 'yellow', 'Enter the amount', 'Min and max are calculated for you; full repayment fills in the exact sum.'],
    ['phone', 'pink', 'Sign with SMS', 'Read the application in RU or KZ and sign it with a one-time code.'],
    ['padlockOpen', 'mint', 'Lift the encumbrance', 'After full repayment: enter your RKA, pay the state duty — done in about 2 hours.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--lilac"><span class="bd-ico" style="--w:62px">${icon('calculator')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:520px">Four steps, a few minutes. Everything happens inside the Otbasy app — no branch, no paper.</p>
    <div class="bd-cols4" data-stagger>${steps.map(([ic, t, h, d], i) => win(`step_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:100px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- Showcase — real screens, frame by frame ---------- */
  const shot = (file, alt) => `<img src="assets/img/loan/real/${file}.webp" alt="${esc(alt)}" width="564" height="1222" loading="lazy" decoding="async">`;
  const flows = [
    { no: '01', word: 'PARTIAL', serif: 'repayment', frame: 'blue', bar: 'partial', sticker: icon('pieHalf', 'part'),
      text: 'Pay part of the loan ahead of schedule from a special, current or pension (ЕПВ) + current account. The app works out min and max, shows the write-off breakdown and the bilingual application, then signs it with an SMS code.',
      screens: [
        ['p01-loan', 'Loan page', 'Payment, paid so far and balance; early repayment sits right here.'],
        ['p02-account', 'Choose account', 'Special, current, or pension (ЕПВ) + current, with balances.'],
        ['p03-amount', 'Amount', 'Current account: min and max are calculated for you.'],
        ['p04-amount-epv', 'Amount · ЕПВ', 'Pension covers principal; interest comes from the current account.'],
        ['p05-details', 'Write-off details', 'Overdue principal, interest and fees, line by line.'],
        ['p06-application', 'Application', 'Read it in Kazakh or Russian before signing.'],
        ['p07-sms', 'SMS signature', 'A one-time code instead of a branch visit.'],
        ['p08-done', 'Done', 'Loan partly repaid; schedule and application are saved.'],
      ] },
    { no: '02', word: 'FULL', serif: 'repayment', frame: 'orange', bar: 'full', sticker: icon('pieFull', 'full'),
      text: 'Close the whole loan at once. The payoff sum is pre-filled, a linked deposit is closed automatically, and the success screen leads straight to lifting the encumbrance.',
      screens: [
        ['f01-amount', 'Amount', 'Payoff sum pre-filled; the linked deposit will be closed.'],
        ['f02-details', 'Write-off details', 'Everything that will be debited, before paying.'],
        ['f03-application', 'Application', 'Full repayment application, RU / KZ, SMS-signed.'],
        ['f04-repaid', 'Fully repaid', 'The next step is offered right away: lift the encumbrance.'],
      ] },
    { no: '03', word: 'ENCUMBRANCE', serif: 'removal', frame: 'ink', bar: 'encumbrance', sticker: icon('padlockOpen'),
      text: 'Right after full repayment: enter the property RKA, confirm the address, pay the state duty in the app — the bank files the request with the state registry. About 2 hours, no public service centre.',
      screens: [
        ['e01-rka', 'Enter RKA', 'Property registration code, with a hint where to find it.'],
        ['e02-address', 'Confirm address', 'The registry returns the address to double-check.'],
        ['e03-registry', 'Registry check', 'The request goes to state databases; progress is shown.'],
        ['e04-duty', 'State duty', 'Receipt, account and fees — before paying.'],
        ['e05-paying', 'Paying', 'The duty is paid right in the app.'],
        ['e06-paid', 'Payment done', 'Request filed; review takes about 2 hours.'],
        ['e07-lifted', 'Encumbrance lifted', 'Notice and receipt are saved in the app.'],
        ['e08-mybank', 'My bank', 'The loan leaves the product list. Done.'],
      ] },
  ];
  const phoneCard = (f) => `
    <article class="bd-card is-wide bd-card--phones bd-frame--${f.frame}" data-reveal>
      <div class="bd-card__inner">
        <div class="bd-card__top"><div class="bd-card__title"><b class="bd-h1 bd-blue">${f.no}</b><b class="bd-h1">${f.word}</b><i class="bd-serif-m">${f.serif}</i></div>${tag(f.screens.length + ' screens')}</div>
        <p class="bd-mono-s">${esc(f.text)}</p>
        <div class="bd-phones">${f.screens.map(([file, label, note], i) => `
          <figure class="bd-phone">
            ${win(`${f.bar} — ${String(i + 1).padStart(2, '0')}`, shot(file, `Otbasy app, ${f.word.toLowerCase()} ${f.serif}: ${label}`), { cls: 'bd-win--shot', active: i === 0 })}
            <figcaption><span class="bd-phone__cap"><b class="bd-h3 bd-blue">${String(i + 1).padStart(2, '0')}</b><b class="bd-h3">${esc(label)}</b></span><span class="bd-mono-s bd-grey">${esc(note)}</span></figcaption>
          </figure>`).join('')}</div>
      </div>
      <div class="bd-card__sticker">${f.sticker}</div>
    </article>`;
  const showcase = () => `
  <section class="bd-sec bd-center-col" id="flow" data-theme="light">
    ${head('(the real product) — frame by frame', 'USER', 'flow')}
    <div class="bd-flowline">${['01 Loan', '02 Account', '03 Amount', '04 Details', '05 Application', '06 SMS code', '07 Done'].map((l) => tag(l, 'ink')).join('<span class="bd-h3">→</span>')}<span class="bd-h3">·</span>${tag('Then — encumbrance removal')}</div>
    ${phoneCard(flows[0])}
    ${phoneCard(flows[1])}
    <p class="bd-kicker bd-grey">— after full repayment —</p>
    ${phoneCard(flows[2])}
  </section>`;

  /* ---------- 05 Research (real ticket data) ---------- */
  const methods = [['2 236', 'branch tickets about early repayment'], ['21 019', 'app & portal tickets coded'], ['75%', 'needed no code fix'], ['18 h', 'median to resolve · May 2026']];
  // share of tickets: archive (grey) → May 2026 (blue); bars are drawn on a 0–40% scale
  const bars = [
    ['Pension (ЕПВ) application “not found”', 36.4, 30.2],
    ['“Active application” blocks a new one', 19.4, 5.6],
    ['“Service unavailable” error', 9.8, 7.3],
    ['Encumbrance removal fails', 8.3, 20.1],
    ['Stuck on “processing”', 4.9, 8.4],
  ];
  const insights = [
    ['The pension step is a black box', '36% of tickets: “no active application” for ЕПВ money, although the client had one on the ЕНПФ platform.'],
    ['Old applications block new ones', '19%: an unfinished request blocked a new one — support cancelled 187 of them by hand.'],
    ['The encumbrance dead-ends', '8% overall and 20% in May 2026; 37% of these ended with “go to a public service centre”.'],
    ['Most “bugs” weren’t bugs', '75% worked on re-check or the client hadn’t finished the flow. Only 1.7% were real back-end errors.'],
  ];
  const hmw = [['lilac', 'How might we show which pension application will be used?'], ['yellow', 'How might we let people resume or cancel their own application?'], ['mint', 'How might we make “paid off” mean done — without a ЦОН visit?']];
  const research = () => `
  <section class="bd-sec bd-white-bg" id="research" data-theme="light">
    ${head('(03) — research', 'WHAT WE', 'learned')}
    <div class="bd-cols4" data-stagger>${methods.map(([v, l]) => `<div class="bd-metric"><b class="bd-metric-l">${v}</b><span class="bd-label">${l}</span></div>`).join('')}</div>
    <div class="bd-split">
      <div class="bd-funnel" data-reveal><span class="bd-label">Tickets by problem · archive (n = 2 236) → May 2026 (n = 179)</span>
        ${bars.map(([s, a, b]) => `<div class="bd-funnel__row"><span class="bd-mono-s">${s} — ${Math.round(a)}% → ${Math.round(b)}%</span><i class="bd-bar bd-bar--before" style="--v:${(a / 40 * 100).toFixed(1)}"></i><i class="bd-bar bd-bar--after" style="--v:${(b / 40 * 100).toFixed(1)}"></i></div>`).join('')}
        <span class="bd-legend bd-mono-s"><i class="bd-bar bd-bar--before"></i>archive <i class="bd-bar bd-bar--after"></i>May 2026</span>
      </div>
      <div class="bd-insights" data-stagger>${insights.map(([t, d], i) => `<div class="bd-insight"><b class="bd-h2 bd-blue">0${i + 1}</b><div><h3 class="bd-h3">${t}</h3><p class="bd-mono-s bd-grey">${d}</p></div></div>`).join('')}</div>
    </div>
    <div class="bd-cols3" data-stagger>${hmw.map(([t, q]) => `<div class="bd-hmw bd-tint--${t}"><span class="bd-label">HMW</span><p class="bd-serif-m">${esc(q)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 05.1 From the branch: problem → how it was solved → what the flow does ---------- */
  const tickets = [
    ['Pension (ЕПВ) application “not found”', '34% worked on re-check, 24% — the client hadn’t finished the flow', 'The amount step lists the client’s ЕПВ applications with their status — pick one, no guessing', '814 · 36%'],
    ['“You already have an active application”', '43% — support cancelled the old application by hand; 17% — another loan operation was blocking', 'An unfinished application opens where it stopped, with Continue or Cancel', '434 · 19%'],
    ['“Service unavailable” / generic error', '35% — the client hadn’t finished, 28% worked on re-check', 'Every step says what is happening and what to do next; nothing is lost on retry', '220 · 10%'],
    ['Encumbrance removal fails or hangs', '37% sent to a public service centre (ЦОН), 27% worked on re-check', 'RKA, registry check, state duty and status in one flow, with a 2-hour SLA and an SMS', '186 · 8%'],
    ['Stuck on “processing”, no status', '43% worked on re-check, 26% — the client had to continue', 'Loading, “waiting for payment” and success screens, each with the next action', '110 · 5%'],
    ['Minimum amount / “not enough money”', 'Rules explained by phone; the current account had to be topped up first', 'Min, max and every account balance are shown before the amount is entered', '76 · 3%'],
  ];
  const branch = () => `
  <section class="bd-sec" id="branch" data-theme="light">
    ${head('(03.1) — branch tickets', 'FROM THE', 'branch')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table bd-table--tickets"><thead><tr><th>Problem reported</th><th>How support solved it then</th><th>What the new flow does</th><th>Tickets</th></tr></thead>
      <tbody>${tickets.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="bd-h3 bd-blue">${r[3]}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:240px">${ill('ticketTray')}</div>
      <div><p class="bd-serif-l bd-quote__text bd-quote__text--m">75% of 2 236 tickets needed no code fix — they were hidden rules, silent statuses and stuck applications. That is a design problem.</p>
      <span class="bd-label">Source: Otbasy Bank service desk exports — app &amp; Baspana portal tickets from branches and the contact centre. Archive: 21 019 tickets; May 2026: 179 on early repayment from 13 branches, 17% past SLA.</span></div></div>
  </section>`;

  /* ---------- 06 Process ---------- */
  const phases = [
    ['Discover', 'wk 1–2', 'Coded 2 236 branch tickets, interviews with branch staff, analytics', 'Excel · Amplitude', 'lilac'],
    ['Define', 'wk 3', 'Problem map from tickets, flows for partial & full, edge cases', 'FigJam', 'yellow'],
    ['Design', 'wk 4–6', 'Flows, components, hi-fi screens, copy', 'Figma', 'mint'],
    ['Validate', 'wk 7', '2 rounds of usability tests, legal review', 'Maze', 'pink'],
    ['Handoff', 'wk 8', 'Specs, states, QA with devs, release', 'Figma Dev Mode · Jira', 'orange'],
  ];
  const process = () => `
  <section class="bd-sec" id="process" data-theme="light">
    ${head('(04) — process', 'HOW I', 'worked')}
    <div class="bd-phases" data-stagger>${phases.map(([p, w, a, t, c]) => `<div class="bd-phase bd-tint--${c}"><div class="bd-phase__top"><h3 class="bd-h2">${p}</h3>${tag(w)}</div><p class="bd-mono-s">${a}</p><span class="bd-label bd-grey">${t}</span></div>`).join('')}</div>
  </section>`;

  /* ---------- 07 Solution ---------- */
  const flowIcons = [['bank', '01 Loan page'], ['calculator', '02 Amount'], ['receipt', '03 Write-off details'], ['phone', '04 Sign by SMS'], ['padlockOpen', '05 Lift encumbrance']];
  const decisions = [
    ['Pension applications, visible', 'The amount step lists the client’s ЕНПФ applications with their status — the #1 ticket reason (36%).'],
    ['Resume or cancel, by yourself', 'An unfinished application reopens where it stopped — no more cancelling by support (19% of tickets, 187 by hand).'],
    ['The amount, calculated', 'Min, max and every account balance are shown before typing — no more “not enough money” tickets.'],
    ['A status on every step', 'Processing, waiting-for-payment and success screens say what happens next (15% of tickets were errors or “stuck”).'],
    ['Encumbrance in the same flow', 'RKA, registry check and state duty in one place, with a 2-hour SLA and ЦОН only as a clear fallback (8% → 20% of tickets).'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    <h2 class="bd-head__title bd-left"><span class="bd-display-l" data-split="chars">THE</span><span class="bd-serif-l" data-split="words">solution</span></h2>
    <div class="bd-flowicons" data-stagger>${flowIcons.map(([ic, l], i) => `<div class="bd-flowicon"><span class="bd-ico" style="--w:90px">${icon(ic)}</span><span class="bd-label">${l}</span></div>${i < 4 ? '<span class="bd-display-s bd-arrow">→</span>' : ''}`).join('')}</div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
    <a class="bd-label" href="#flow">→ Real screens are in the user flow above: 01 Partial repayment · 02 Full repayment · 03 Encumbrance removal.</a>
  </section>`;

  /* ---------- 08 Targets ---------- */
  const rows = [
    ['Early-repayment tickets / month', '179 · May 2026', '< 90', '−50%'],
    ['Pension application “not found”', '30% of tickets', '< 10%', '−20 pp'],
    ['Stuck applications cancelled by support', '187', '0', '−100%'],
    ['Encumbrance tickets sent to ЦОН', '37%', '< 15%', '−22 pp'],
    ['Tickets past SLA', '17% · May 2026', '< 5%', '−12 pp'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(06) — targets', 'THE', 'targets')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Baseline (tickets)</th><th>Target</th><th>Change</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="bd-h3 bd-blue">${r[3]}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:240px">${ill('paidOff')}</div>
      <div><p class="bd-serif-l bd-quote__text">“The client paid the state duty online. The request has been ‘in process’ for two hours. Please check.”</p><span class="bd-label">A real branch ticket, May 2026 · translated, anonymised</span></div></div>
  </section>`;

  /* ---------- 09 Reflection ---------- */
  const learn = [
    [icon('alarmClock'), 'Say how long it takes', 'Encumbrance tickets grew from 8% to 20%. Most just asked “is it done?” — a 2-hour promise and an SMS answer that.'],
    [icon('receipt'), 'Tickets are research', '2 236 service-desk tickets showed more than interviews: 75% were design problems, only 1.7% real bugs.'],
    [stk('zero'), 'Done means done', 'Full repayment isn’t the finish line until the encumbrance is lifted, so both live in one flow.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(07) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.loan = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['flow', 'User flow'], ['research', 'Research'], ['branch', 'Branch tickets'], ['process', 'Process'], ['solution', 'Solution'], ['results', 'Targets'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${how()}${showcase()}${research()}${branch()}${process()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
