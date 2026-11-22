/*
 * Otbasy housing-queue case — rendered as the Figma case board (SWAMP MARKET file, node 59:5063,
 * "Case / ЦОЖ — Housing queue"), section by section, in the Daniyar portfolio design system.
 * case.js calls BOARDS.housing(p, next) instead of the generic case template.
 */
(function (root) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const I = () => root.ILL;
  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M8.5 3 13 8l-4.5 5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

  /* ---------- small parts of the design system ---------- */
  const tag = (label, tone = 'outline') => `<span class="bd-tag bd-tag--${tone}">${esc(label)}</span>`;
  const head = (kicker, word, serif, tone = '') => `
    <div class="bd-head ${tone}">
      <p class="bd-kicker" data-split="words">${esc(kicker)}</p>
      <h2 class="bd-head__title"><span class="bd-display-l" data-split="chars">${esc(word)}</span><span class="bd-serif-l" data-split="words">${esc(serif)}</span></h2>
    </div>`;
  const win = (title, body, { active = true, cls = '' } = {}) => `
    <div class="bd-win ${cls}">
      <div class="bd-win__bar${active ? '' : ' is-idle'}"><i class="bd-win__box"></i><i class="bd-win__lines"></i><span>${esc(title)}</span><i class="bd-win__lines"></i><i class="bd-win__spacer"></i></div>
      <div class="bd-win__body">${body}</div>
    </div>`;
  const icon = (name, tag) => I().icon(name, tag);
  const stk = (name) => I().stickers[name]();
  const ill = (name) => I()[name]();

  /* ---------- 01 Hero ---------- */
  const hero = () => `
  <section class="bd-sec bd-hero" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">Case 05 / 05</span></div>
    <p class="bd-kicker" data-split="words">(Case 05) — Otbasy Bank · housing queue redesign</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">HOUSING</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">queue,</span><span class="bd-display-l" data-split="chars">MADE SIMPLE</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:720px">A national service where families join the state housing queue, apply for subsidised mortgages and track their place — redesigned from a form-heavy portal into a guided, transparent flow.</p>
    <div class="bd-tags">${['GovTech', 'Responsive web', 'Design system', 'EDS signing', 'WCAG 2.1 AA'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('houseFrame')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('macHome')}</div>
      <div class="bd-art" style="--w:300px;--r:-4deg" data-tilt>${ill('idCheck')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker" style="--w:185px;left:7%;top:44%;--r:-8deg">${stk('keys')}</div>
    <div class="bd-sticker" style="--w:150px;right:9%;top:46%;--r:10deg">${stk('movein')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'Lead product designer — research, IA, UI, design system, handoff'],
    ['Timeline', '10 weeks · Mar – May 2025'],
    ['Team', 'PM, analyst, 2 frontend, 1 backend, eGov integration lead'],
    ['Platform', 'Responsive web · eGov SSO · RU / KZ / EN'],
    ['Deliverables', 'Research report, journey map, IA, design system, 24 hi-fi screens, prototype, specs'],
    ['Tools', 'Figma, FigJam, Maze, Dovetail, Amplitude, Hotjar, Jira'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', 46, '−', '%', 'time to submit · 18 → 9.7 min'],
    ['yellow', 31, '+', '%', 'completed applications'],
    ['mint', 52, '−', '%', '“what is my status?” calls'],
    ['pink', 82, '', '', 'SUS score · was 58'],
  ];
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    <h2 class="bd-head__title bd-left"><span class="bd-display-l" data-split="chars">TL;DR</span><span class="bd-serif-l" data-split="words">impact</span></h2>
    <p class="bd-mono">One entry point for six state programmes, eligibility explained before people start, a live check of 11 government databases and a cabinet built around one question: “where is my family in the queue?”</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, pre, suf, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s" data-count="${v}" data-prefix="${pre}" data-suffix="${suf}" data-decimals="0">${pre}${v}${suf}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">Measured in moderated usability tests (n = 12, prototype vs current) and the first 6 weeks of the pilot in two regions. Numbers in this case are illustrative.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const goals = [
    ['Business goals', 'yellow', ['Cut call-centre load on status questions', 'Raise completed applications', 'One entry point for all programmes']],
    ['User goals', 'mint', ['Know in a minute if I am eligible', 'Apply without paper or office visits', 'See where I am in the queue']],
    ['Constraints', 'pink', ['eGov EDS signing is mandatory', '11 gov databases · 30–90 s latency', 'RU / KZ + low-vision mode (WCAG 2.1 AA)', 'Legacy backend statuses']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:120px">${icon('alert')}</div><p class="bd-serif-k">Families who need housing must register in the state queue, but the old portal hid eligibility rules in long PDFs, asked for data the State already had, and showed nothing while 11 databases were queried. Half of all calls to 1432 were “what is my status?”.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['idCard', 'brand', 'Sign in with eGov', 'No passwords — your profile and family data come from eGov.'],
    ['family', 'yellow', 'Choose your category', 'Plain-language rules. Not sure? Answer 3 questions and we suggest one.'],
    ['stampDoc', 'pink', 'Sign consent with EDS', 'One signature lets us request your data from State databases.'],
    ['hourglass', 'mint', 'We check 11 databases', 'Watch each source answer live. Leave any time — we’ll SMS you.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--lilac"><span class="bd-ico" style="--w:80px">${icon('checklist')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:520px">Four steps, about ten minutes. You only need an eGov account and your EDS key.</p>
    <div class="bd-cols4" data-stagger>${steps.map(([ic, t, h, d], i) => win(`step_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:110px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- Showcase — real flow ---------- */
  const flow = [
    ['02', 'START', 'empty cabinet', 'pink', 'family', 'my apl/main · 1434×1166', 'Signed in with eGov, no applications yet: the user starts "Постановка на учет" from the cabinet.', '02-start'],
    ['03', 'CATEGORY', 'chosen', 'orange', 'checklist', 'my apl/main · 1434×1600', 'Step 2: choose one or more categories; supporting data is checked later against State databases.', '03-category'],
    ['04', 'CONSENT', 'signed with EDS', 'lilac', 'stampDoc', '', 'Step 3: sign the application and the personal-data consent with EDS; signed documents can be downloaded.', '04-consent'],
    ['05', 'FAMILY', 'consent & data check', 'mint', 'database', 'my apl/main · 1434×1639', 'Step 5: family members over 18 sign their consent while the State databases answer one by one (received / waiting / refresh).', '05-family'],
    ['06', 'SUBMITTED', 'accepted', 'yellow', 'envelope', 'my apl/main · 1434×1833', 'The application with its number, time and "Принято" status; documents can be downloaded.', '06-submitted'],
    ['07', 'CABINET', 'status: active', 'blue', 'key', 'my apl/main · 1434×1339', 'After the process: registration date, subcategory, region and the "Актуален" status, then FAQ.', '07-cabinet'],
  ];
  const shot = (file, alt) => `<img src="assets/img/housing/real/${file}.webp" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  const card = ({ no, word, serif, frame, sticker, sz, text, body, wide }) => `
    <article class="bd-card bd-frame--${frame}${wide ? ' is-wide' : ''}" data-reveal>
      <div class="bd-card__inner">
        <div class="bd-card__top"><div class="bd-card__title"><b class="bd-h1 bd-blue">${no}</b><b class="bd-h1">${word}</b><i class="bd-serif-m">${serif}</i></div>${sz ? tag(sz) : ''}</div>
        <p class="bd-mono-s">${esc(text)}</p>
        ${body}
      </div>
      <div class="bd-card__sticker">${sticker}</div>
    </article>`;
  const showcase = () => `
  <section class="bd-sec bd-center-col" id="flow" data-theme="light">
    ${head('(the real product) — frame by frame', 'USER', 'flow')}
    <div class="bd-flowline">${['01 Main', ...flow.map((f) => f[0] + ' ' + f[1].charAt(0) + f[1].slice(1).toLowerCase())].map((l) => tag(l, 'ink')).join('<span class="bd-h3">→</span>')}<span class="bd-h3">·</span>${tag('Status check — separate')}</div>
    ${card({ no: '01', word: 'MAIN', serif: 'page', frame: 'blue', wide: true, sticker: icon('house'), sz: 'main-1 · 1440 × 5511',
      text: 'Entry point for every programme: hero with "Подать заявку" and "узнать свой статус", how it works, social, support measures, key numbers, homes, news and FAQ.',
      body: win('main-1 — viewport', shot('01-main', 'Original ЦОЖ main page, first screen'), { cls: 'bd-win--shot' }) })}
    <div class="bd-grid2">${flow.map(([no, word, serif, frame, st, sz, text, file]) => card({ no, word, serif, frame, sz, text, sticker: icon(st),
      body: win(`my apl/main — ${no}`, shot(file, `Original ЦОЖ screen ${no}: ${word.toLowerCase()}`), { cls: 'bd-win--shot' }) })).join('')}</div>
    <p class="bd-kicker bd-grey">— separate function —</p>
    ${card({ no: '+', word: 'STATUS', serif: 'check', frame: 'ink', wide: true, sticker: icon('ticket', '#1284'), sz: 'outside the flow · public',
      text: 'Not part of the application: anyone can enter an IIN and see the registration status without signing in.',
      body: win('check_status.app', shot('status-check', 'Original ЦОЖ public status check page'), { cls: 'bd-win--shot bd-win--status' }) })}
  </section>`;

  /* ---------- 05 Research ---------- */
  const methods = [['12', 'interviews · Almaty, Shymkent, Ust-Kamenogorsk'], ['1 840', 'survey responses'], ['3 200', 'call-centre tickets coded'], ['6', 'gov services benchmarked']];
  const funnel = [['Started', 100, 100], ['Category chosen', 71, 86], ['Consent signed', 52, 72], ['Data check passed', 38, 58], ['Submitted', 34, 45]];
  const insights = [
    ['People pick categories by guessing', '7 of 12 chose the wrong category; the rules lived in a 40-page PDF.'],
    ['Silence feels like an error', 'During the 90-second database check, 5 of 12 reloaded the page and lost progress.'],
    ['Status is the real product', 'After applying, users only ever come back for one thing — their place in the queue.'],
    ['Zoom breaks the old layout', 'Low-vision users at 200% zoom could not reach the “Continue” button.'],
  ];
  const hmw = [['lilac', 'How might we explain eligibility before people start?'], ['yellow', 'How might we make a 90-second wait feel like progress?'], ['mint', 'How might we answer “where am I in the queue?” without a call?']];
  const research = () => `
  <section class="bd-sec bd-white-bg" id="research" data-theme="light">
    ${head('(03) — research', 'WHAT WE', 'learned')}
    <div class="bd-cols4" data-stagger>${methods.map(([v, l]) => `<div class="bd-metric"><b class="bd-metric-l">${v}</b><span class="bd-label">${l}</span></div>`).join('')}</div>
    <div class="bd-split">
      <div class="bd-funnel" data-reveal><span class="bd-label">Application funnel · before → after</span>
        ${funnel.map(([s, b, a]) => `<div class="bd-funnel__row"><span class="bd-mono-s">${s} — ${b}% → ${a}%</span><i class="bd-bar bd-bar--before" style="--v:${b}"></i><i class="bd-bar bd-bar--after" style="--v:${a}"></i></div>`).join('')}
      </div>
      <div class="bd-insights" data-stagger>${insights.map(([t, d], i) => `<div class="bd-insight"><b class="bd-h2 bd-blue">0${i + 1}</b><div><h3 class="bd-h3">${t}</h3><p class="bd-mono-s bd-grey">${d}</p></div></div>`).join('')}</div>
    </div>
    <div class="bd-cols3" data-stagger>${hmw.map(([t, q]) => `<div class="bd-hmw bd-tint--${t}"><span class="bd-label">HMW</span><p class="bd-serif-m">${esc(q)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 06 Process ---------- */
  const phases = [
    ['Discover', 'wk 1–3', 'Interviews, survey, ticket coding, analytics', 'Dovetail · Amplitude', 'lilac'],
    ['Define', 'wk 4', 'Journey map, IA, success metrics, HMWs', 'FigJam', 'yellow'],
    ['Design', 'wk 5–8', 'Flows, design system, hi-fi screens, copy', 'Figma', 'mint'],
    ['Validate', 'wk 9', '2 rounds of usability tests, a11y audit', 'Maze · Hotjar', 'pink'],
    ['Handoff', 'wk 10', 'Specs, tokens, QA with devs, pilot', 'Figma Dev Mode · Jira', 'orange'],
  ];
  const process = () => `
  <section class="bd-sec" id="process" data-theme="light">
    ${head('(04) — process', 'HOW I', 'worked')}
    <div class="bd-phases" data-stagger>${phases.map(([p, w, a, t, c]) => `<div class="bd-phase bd-tint--${c}"><div class="bd-phase__top"><h3 class="bd-h2">${p}</h3>${tag(w)}</div><p class="bd-mono-s">${a}</p><span class="bd-label bd-grey">${t}</span></div>`).join('')}</div>
  </section>`;

  /* ---------- 07 Solution ---------- */
  const flowIcons = [['house', '01 Landing'], ['envelope', '02 Apply · 6 steps'], ['database', '03 Data check'], ['key', '04 Cabinet'], ['ticket', '05 Check status']];
  const decisions = [
    ['One landing for six programmes', 'Eligibility and limits sit on each programme card, so people self-qualify before signing in.'],
    ['Categories in plain language', 'Each category explains who qualifies; proofs (birth, disability, income) are pulled from State databases automatically.'],
    ['Design the waiting', 'A live checklist shows each of the 11 databases answering; leaving is safe — we SMS when it is done.'],
    ['A cabinet built around status', 'Queue number, date and region come first; everything else is secondary.'],
    ['Status without signing in', 'A public IIN check answers the #1 call-centre question in 10 seconds.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    <h2 class="bd-head__title bd-left"><span class="bd-display-l" data-split="chars">THE</span><span class="bd-serif-l" data-split="words">solution</span></h2>
    <div class="bd-flowicons" data-stagger>${flowIcons.map(([ic, l], i) => `<div class="bd-flowicon"><span class="bd-ico" style="--w:90px">${icon(ic)}</span><span class="bd-label">${l}</span></div>${i < 4 ? '<span class="bd-display-s bd-arrow">→</span>' : ''}`).join('')}</div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
    <a class="bd-label" href="#flow">→ The real product, frame by frame, is in the user flow above: 01 Main · 02–06 Application · 07 Cabinet · status check.</a>
  </section>`;

  /* ---------- 08 Results ---------- */
  const rows = [['Time to submit', '18 min', '9.7 min', '−46%'], ['Completed applications', '34%', '45%', '+31%'], ['Status calls per month', '6 400', '3 050', '−52%'], ['Errors on category step', '22%', '6%', '−16 pp'], ['SUS score', '58', '82', '+24']];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(06) — results', 'THE', 'outcome')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Change</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="bd-h3 bd-blue">${r[3]}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:240px">${ill('allSet')}</div>
      <div><p class="bd-serif-l bd-quote__text">“For the first time I didn’t have to call anyone to find out where my family is in the queue.”</p><span class="bd-label">P7 · mother of four, Shymkent · usability test round 2</span></div></div>
  </section>`;

  /* ---------- 09 Reflection ---------- */
  const learn = [
    [icon('hourglass'), 'Design the waiting', 'Integration latency is a UX problem. Showing each source answering cut reloads to zero.'],
    [icon('chart'), 'Status is a feature', 'The cabinet became a status page first. Navigation shrank from 11 items to 5.'],
    [stk('zoom'), 'A11y finds everyone’s bugs', 'Fixing 200% zoom also fixed small laptops and the Kazakh copy, which runs 30% longer.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(07) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    <div class="bd-next bd-next--soon" aria-label="Next project, coming soon: full or half payment loan for Otbasy Bank">
      <div><span class="bd-label">Next project · coming soon</span><b class="bd-display-s">full/half payment — loan otbasy bank</b>
        <span class="bd-mono-s">Otbasy Bank · loan repayment flow · case study in progress</span></div>
      <div class="bd-next__side">${tag('In progress', 'white')}<span class="bd-ico" style="--w:120px">${stk('wip')}</span></div>
    </div>
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.housing = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['flow', 'User flow'], ['research', 'Research'], ['process', 'Process'], ['solution', 'Solution'], ['results', 'Results'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero()}${overview()}${tldr()}${problem()}${how()}${showcase()}${research()}${process()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
