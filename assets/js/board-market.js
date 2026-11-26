/*
 * Baspana Market case — rendered as the Figma case board (SWAMP MARKET file, node 148:14121,
 * "Case / Otbasy — Baspana Market"; Russian board 150:14552), section by section.
 * The real screens are long pages, so each one sits in a window you can scroll inside
 * (mouse wheel / trackpad on desktop, swipe on touch). Uses the helpers from board-housing.js.
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);
  const T = (s) => K().T(s), title2 = (a, b) => K().title2(a, b);

  /* ---------- scrollable screen ---------- */
  const SCREENS = {
    'd-catalog': [1123, 966], 'd-object': [1119, 4427], 'd-programs': [1434, 2005], 'd-programme': [1123, 3597],
    'm-home': [450, 5408], 'm-catalog': [450, 1873], 'm-object': [450, 8010], 'm-programs': [450, 4953],
  };
  const URLS = {
    'd-catalog': 'baspana.otbasybank.kz/catalog', 'd-object': 'baspana.otbasybank.kz/complex/zhas-kanat',
    'd-programs': 'baspana.otbasybank.kz/programs', 'd-programme': 'baspana.otbasybank.kz/programs/nauryz',
  };
  // a screen only takes the scroll once someone clicks / taps it, so scrolling the page past it never gets stuck
  const screen = (file, alt) => {
    const [w, h] = SCREENS[file];
    const kind = file[0] === 'd' ? 'desk' : 'phone';
    return `<div class="bd-scrwrap bd-scrwrap--${kind}">
      <div class="bd-scr" tabindex="0" role="region" aria-label="${esc(T(alt))} — ${esc(T('scrollable screen'))}">
        <img src="assets/img/market/${file}.webp" alt="${esc(T(alt))}" width="${w}" height="${h}" loading="lazy" decoding="async">
      </div>
      <i class="bd-scr__bar" aria-hidden="true"></i>
    </div>`;
  };
  const fullBtn = (file, alt) => `<button class="bd-full" type="button" data-expand="${file}" data-alt="${esc(T(alt))}" aria-label="${esc(T('Open full size'))}: ${esc(T(alt))}"><span aria-hidden="true">⤢</span>${T('Full screen')}</button>`;
  // one panel of the row: a label, a "full screen" button and the device with the real page inside
  const stage = ([file, label, alt]) => {
    const desk = file[0] === 'd';
    const device = desk
      ? `<div class="bd-browser"><div class="bd-browser__bar"><i class="bd-browser__dots" aria-hidden="true"><b></b><b></b><b></b></i><span class="bd-browser__url">${URLS[file]}</span></div>${screen(file, alt)}</div>`
      : `<div class="bd-handset">${screen(file, alt)}</div>`;
    return `
    <figure class="bd-stage bd-stage--${desk ? 'desk' : 'phone'}">
      <figcaption class="bd-stage__head"><span class="bd-label">${esc(T(label))}</span>${fullBtn(file, alt)}</figcaption>
      <div class="bd-stage__body">${device}</div>
    </figure>`;
  };

  // full-size viewer: one overlay for the page, scroll the screen at its real size
  const openFull = (btn) => {
    let lb = document.querySelector('.bd-lb');
    if (!lb) {
      lb = document.createElement('div');
      lb.className = 'bd-lb';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('data-lenis-prevent', '');
      lb.innerHTML = `<div class="bd-lb__inner"><img alt=""></div><button class="bd-lb__close" type="button" aria-label="${esc(T('Close'))}">✕</button>`;
      document.body.appendChild(lb);
      const close = () => {
        lb.classList.remove('is-open');
        document.documentElement.classList.remove('bd-lb-open');
        if (lb._from) lb._from.focus({ preventScroll: true });
      };
      lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.bd-lb__close')) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
    }
    const file = btn.dataset.expand, img = lb.querySelector('img');
    const [w, h] = SCREENS[file];
    img.src = `assets/img/market/${file}.webp`; img.alt = btn.dataset.alt; img.width = w; img.height = h;
    lb.classList.toggle('is-phone', file[0] === 'm');
    lb._from = btn;
    lb.scrollTop = 0;
    lb.classList.add('is-open');
    document.documentElement.classList.add('bd-lb-open');
    lb.querySelector('.bd-lb__close').focus({ preventScroll: true });
  };

  if (typeof document !== 'undefined' && !root.__bdScr) {
    root.__bdScr = true;
    const wrapOf = (el) => el && el.closest && el.closest('.bd-scrwrap');
    const on = (w) => {
      if (!w || w.classList.contains('is-active')) return;
      document.querySelectorAll('.bd-scrwrap.is-active').forEach(off);
      w.classList.add('is-active');
      w.querySelector('.bd-scr').setAttribute('data-lenis-prevent', '');
      if (io) io.observe(w);
    };
    function off(w) {
      if (!w || !w.classList.contains('is-active')) return;
      w.classList.remove('is-active');
      w.querySelector('.bd-scr').removeAttribute('data-lenis-prevent');
      if (io) io.unobserve(w);
    }
    // stop as soon as the screen leaves the viewport
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) off(e.target); })) : null;
    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-expand]');
      if (b) { e.preventDefault(); openFull(b); return; }
      const w = wrapOf(e.target);
      if (w) on(w);
      else document.querySelectorAll('.bd-scrwrap.is-active').forEach(off); // click / tap outside stops it
    });
    document.addEventListener('keydown', (e) => { // keyboard: focus a screen and use the arrows
      const w = wrapOf(document.activeElement);
      if (w && /^(Arrow|Page|Home|End| )/.test(e.key)) on(w);
    });
    document.addEventListener('mouseout', (e) => { // mouse leaves the screen: the page scrolls again
      const w = wrapOf(e.target);
      if (w && w.classList.contains('is-active') && !w.contains(e.relatedTarget)) off(w);
    });
    document.addEventListener('focusout', (e) => { const w = wrapOf(e.target); if (w && !w.contains(e.relatedTarget)) off(w); });
    document.addEventListener('scroll', (e) => { // progress bar
      const el = e.target;
      if (!el || !el.classList || !el.classList.contains('bd-scr')) return;
      const max = el.scrollHeight - el.clientHeight;
      el.parentElement.style.setProperty('--p', max > 0 ? (el.scrollTop / max).toFixed(3) : 1);
    }, true);
  }

  /* ---------- 01 Hero ---------- */
  const hero = (p) => `
  <section class="bd-sec bd-hero bd-hero--yellow" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">${T('Case')} ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(${T('Case')} ${p.no}) — ${T('Otbasy Bank')} · Baspana Market</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">FIND A HOME</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">&amp; a mortgage,</span><span class="bd-display-l" data-split="chars">IN ONE GO</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:740px">Baspana Market is Otbasy Bank’s property marketplace: new builds, resale and rentals next to the state and bank mortgage programmes that pay for them. I redesigned the way from search to an application — catalog, residential-complex page and programme pages — for web and mobile.</p>
    <div class="bd-tags">${['Marketplace', 'Responsive web', 'Mobile web', 'Design system', 'GovTech'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('blockFrame')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('macCatalog')}</div>
      <div class="bd-art" style="--w:300px;--r:-4deg" data-tilt>${ill('planCheck')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:185px;--r:-8deg">${stk('yurtcard')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:165px;--r:10deg">${stk('newbuild')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'Lead product designer — IA, catalog, complex and programme pages, components, handoff'],
    ['Timeline', '12 weeks · 2025'],
    ['Team', 'PO, analyst, 3 frontend, 2 backend, content team, developer relations'],
    ['Platform', 'Responsive web + mobile web · RU / KZ'],
    ['Deliverables', 'IA, catalog filters, complex page, programme pages, 9 hi-fi screens (web + mobile), prototype, specs'],
    ['Tools', 'Figma, FigJam, Maze, Hotjar, Jira'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', 102000, 'listings in the catalog'],
    ['yellow', 8, 'state & bank programmes'],
    ['mint', 4, 'screens from search to application'],
    ['pink', 2, 'platforms: web + mobile'],
  ];
  const fmt = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    ${title2('TL;DR', 'impact')}
    <p class="bd-mono">A flat and a mortgage are one decision, but people made it on two sites. The new Baspana Market shows on every complex which programmes it qualifies for, puts the application window and the layouts first, and turns eight programmes into cards you can compare.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s" data-count="${v}" data-group="1" data-decimals="0">${fmt(v)}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">Figures are taken from the designs (catalog size, programme terms, a sample complex). Targets in the last table are goals, not measured outcomes.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const goals = [
    ['Business goals', 'yellow', ['More applications through state programmes', 'Fewer “which programme fits me?” calls', 'One catalog for developers and the bank']],
    ['User goals', 'mint', ['See which programmes fit this flat', 'Compare flats by price per m² and finish', 'Apply or book a consultation without a branch']],
    ['Constraints', 'pink', ['Programme terms change every year', 'Application windows, pools and points', 'Developer data quality varies', 'RU / KZ, mobile first']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:110px">${icon('mapPin')}</div><p class="bd-serif-k">People picked a flat on one site and a mortgage on another. Programme rules lived in long text, a complex page didn’t say which programmes it qualifies for, the application window and pools were easy to miss, and on a phone the complex page was a seven-screen wall of text.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- How it works ---------- */
  const steps = [
    ['mapPin', 'brand', 'Search the catalog', 'New builds, resale or rent; filters stay visible as chips you can clear.'],
    ['block', 'yellow', 'Pick a complex', 'Application window, layouts, price per m² and the programmes it qualifies for.'],
    ['priceTag', 'pink', 'Compare programmes', 'First payment, loan size, term and rate in the same four slots on every card.'],
    ['calendar', 'mint', 'Apply', 'Submit an application in the window, or book a video consultation.'],
  ];
  const how = () => `
  <section class="bd-sec bd-center-col" id="how" data-theme="light">
    <div class="bd-tilerow"><span class="bd-display-m" data-split="chars">HOW IT</span><span class="bd-tile bd-tint--lilac"><span class="bd-ico" style="--w:78px">${icon('filter')}</span></span><span class="bd-display-m" data-split="chars">WORKS</span></div>
    <p class="bd-mono bd-center" style="max-width:540px">Four steps from search to an application. Every step shows which programmes still fit.</p>
    <div class="bd-cols4" data-stagger>${steps.map(([ic, t, h, d], i) => win(`step_0${i + 1}`, `
      <div class="bd-step"><div class="bd-step__art bd-tint--${t}"><span class="bd-ico" style="--w:96px">${icon(ic)}</span></div>
      <b class="bd-metric-m bd-blue">0${i + 1}</b><h3 class="bd-h2">${h}</h3><p class="bd-mono-s bd-grey">${d}</p></div>`, { active: i === 0 })).join('')}</div>
  </section>`;

  /* ---------- Showcase — real screens you can scroll ---------- */
  const flows = [
    { no: '00', word: 'HOME', serif: 'start', frame: 'pink', sticker: icon('yurt'),
      text: 'The mobile home page: buy or rent, shortcuts to early booking, Nauryz and rental programmes, then new builds and resale in swipeable rows.',
      phone: ['m-home', 'home — mobile', 'Baspana Market mobile home page'] },
    { no: '01', word: 'CATALOG', serif: 'search', frame: 'blue', sticker: icon('filter'),
      text: 'Search by type, city, complex and price; every active filter stays visible as a chip. Results show price per m², application status, finish options and the programmes each complex qualifies for.',
      desk: ['d-catalog', 'catalog — web', 'Baspana Market catalog, web'], phone: ['m-catalog', 'catalog — mobile', 'Baspana Market catalog, mobile'] },
    { no: '02', word: 'COMPLEX', serif: 'choose', frame: 'orange', sticker: icon('block'),
      text: 'The residential-complex page: application window with a live countdown, key facts, layouts by rooms and pool, the programmes it qualifies for, eligibility, location, developer track record and documents.',
      desk: ['d-object', 'complex — web', 'Residential-complex page, web'], phone: ['m-object', 'complex — mobile', 'Residential-complex page, mobile'] },
    { no: '03', word: 'PROGRAMMES', serif: 'compare', frame: 'mint', sticker: icon('priceTag'),
      text: 'Eight state and bank programmes as cards with the same four slots — first payment, loan size, term, rate — plus deadlines and “New” / “Archived” badges.',
      desk: ['d-programs', 'programmes — web', 'Bank programmes, web'], phone: ['m-programs', 'programmes — mobile', 'Bank programmes, mobile'] },
    { no: '04', word: 'PROGRAMME', serif: 'apply', frame: 'ink', sticker: icon('calendar'),
      text: 'One programme in depth: conditions, participant and housing requirements in tabs, a points system, a payment table and a consultation block.',
      desk: ['d-programme', 'programme — web', 'Nauryz programme page, web'] },
  ];
  const flowCard = (f) => `
    <article class="bd-card is-wide bd-card--screens bd-frame--${f.frame}" data-reveal>
      <div class="bd-card__inner bd-flowcard">
        <div class="bd-flowcard__text">
          <div class="bd-card__top"><div class="bd-card__title"><b class="bd-h1 bd-blue">${f.no}</b><b class="bd-h1">${f.word}</b><i class="bd-serif-m">${f.serif}</i></div>${tag(f.desk && f.phone ? 'web + mobile' : f.desk ? 'web' : 'mobile')}</div>
          <p class="bd-mono-s">${esc(f.text)}</p>
        </div>
        <div class="bd-stages${f.desk && f.phone ? '' : ' is-single'}">
          ${f.desk ? stage(f.desk) : ''}
          ${f.phone ? stage(f.phone) : ''}
        </div>
      </div>
      <div class="bd-card__sticker">${f.sticker}</div>
    </article>`;
  const showcase = () => `
  <section class="bd-sec bd-center-col" id="flow" data-theme="light">
    ${head('(the real product) — frame by frame', 'USER', 'flow')}
    <div class="bd-flowline">${['01 Home', '02 Catalog', '03 Filters', '04 Complex', '05 Layout', '06 Programmes', '07 Apply'].map((l) => tag(l, 'ink')).join('<span class="bd-h3">→</span>')}<span class="bd-h3">·</span>${tag('Programme page — terms & calculator')}</div>
    ${flows.map(flowCard).join('')}
  </section>`;

  /* ---------- 05 Research ---------- */
  const methods = [['102 000', 'listings in the catalog'], ['8', 'programmes compared'], ['9', 'screens redesigned (web + mobile)'], ['18+', 'pools in one application round']];
  const loans = [['Own home (Свой дом) — up to ₸200 m', 200], ['Military (Әскери баспана) — up to ₸50 m', 50], ['Women’s mortgage «ҰМАЙ» — up to ₸50 m', 50], ['Nauryz — up to ₸36 m', 36], ['Rental from local authorities — no first payment', 0]];
  const insights = [
    ['The programme decides the flat', 'People first check which programme they qualify for, then look for flats — the old catalog worked the other way round.'],
    ['Deadlines hide in the text', 'Application windows, pools and points decide who gets a flat, but they were buried below the description.'],
    ['Same numbers, different places', 'Each programme described first payment, loan, term and rate in its own words and order, so nobody could compare them.'],
    ['Phones get the long version', 'Most visits are mobile, but the complex page was the desktop page stacked into seven screens of text.'],
  ];
  const hmw = [['lilac', 'How might we show which programmes fit a flat before people fall for it?'], ['yellow', 'How might we make the application window impossible to miss?'], ['mint', 'How might we let people compare eight programmes in one glance?']];
  const research = () => `
  <section class="bd-sec bd-white-bg" id="research" data-theme="light">
    ${head('(03) — research', 'WHAT WE', 'learned')}
    <div class="bd-cols4" data-stagger>${methods.map(([v, l]) => `<div class="bd-metric"><b class="bd-metric-l">${v}</b><span class="bd-label">${l}</span></div>`).join('')}</div>
    <div class="bd-split">
      <div class="bd-funnel" data-reveal><span class="bd-label">Maximum loan by programme · ₸ million (terms from the designs)</span>
        ${loans.map(([s, v]) => `<div class="bd-funnel__row"><span class="bd-mono-s">${s}</span>${v ? `<i class="bd-bar bd-bar--after" style="--v:${v / 2}"></i>` : ''}</div>`).join('')}
      </div>
      <div class="bd-insights" data-stagger>${insights.map(([t, d], i) => `<div class="bd-insight"><b class="bd-h2 bd-blue">0${i + 1}</b><div><h3 class="bd-h3">${t}</h3><p class="bd-mono-s bd-grey">${d}</p></div></div>`).join('')}</div>
    </div>
    <div class="bd-cols3" data-stagger>${hmw.map(([t, q]) => `<div class="bd-hmw bd-tint--${t}"><span class="bd-label">HMW</span><p class="bd-serif-m">${esc(q)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 05.1 Programmes side by side (terms as shown in the designs) ---------- */
  const programmes = [
    ['Nauryz', 'from 10%', 'up to ₸36 m · saving up to 19 yrs', '7–9%'],
    ['Military (Әскери баспана)', 'from 20%', 'up to ₸50 m · saving up to 8 yrs', '18%'],
    ['Own home (Свой дом)', '20–50%', 'up to ₸200 m · up to 25 yrs', '7–9%'],
    ['Women’s mortgage «ҰМАЙ» · new', '0–50%', 'up to ₸50 m · up to 25 yrs', '14.8%'],
    ['Rental from local authorities · archived', 'not required', 'waiting-list members · income 2–3.5 subsistence min.', '—'],
    ['Subsidised rent', 'compensation up to 50%', 'waiting-list members · contract up to 1 yr', '—'],
  ];
  const side = () => `
  <section class="bd-sec" id="programmes" data-theme="light">
    ${head('(03.1) — programmes', 'SIDE BY', 'side')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table bd-table--tickets"><thead><tr><th>Programme</th><th>First payment</th><th>Loan size · term</th><th>Rate</th></tr></thead>
      <tbody>${programmes.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="bd-h3 bd-blue">${r[3]}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('yurt')}</div>
      <div><p class="bd-serif-l bd-quote__text bd-quote__text--m">Eight programmes, eight vocabularies. The new cards put the same four numbers in the same four places.</p>
      <span class="bd-label">Source: programme cards in the Baspana Market designs (desktop and mobile). Terms as shown in the designs; they change every year.</span></div></div>
  </section>`;

  /* ---------- 06 Process ---------- */
  const phases = [
    ['Discover', 'wk 1–2', 'Funnel analytics, Hotjar recordings, interviews with consultants', 'Hotjar · Analytics', 'lilac'],
    ['Define', 'wk 3–4', 'IA, catalog → complex → programme flow, data model with developers', 'FigJam', 'yellow'],
    ['Design', 'wk 5–9', 'Catalog, complex and programme pages, web + mobile, components', 'Figma', 'mint'],
    ['Validate', 'wk 10–11', 'Usability tests on the complex page, content review', 'Maze', 'pink'],
    ['Handoff', 'wk 12', 'Specs, states, QA with devs, staged release', 'Figma Dev Mode · Jira', 'orange'],
  ];
  const process = () => `
  <section class="bd-sec" id="process" data-theme="light">
    ${head('(04) — process', 'HOW I', 'worked')}
    <div class="bd-phases" data-stagger>${phases.map(([p, w, a, t, c]) => `<div class="bd-phase bd-tint--${c}"><div class="bd-phase__top"><h3 class="bd-h2">${p}</h3>${tag(w)}</div><p class="bd-mono-s">${a}</p><span class="bd-label bd-grey">${t}</span></div>`).join('')}</div>
  </section>`;

  /* ---------- 07 Solution ---------- */
  const flowIcons = [['mapPin', '01 Catalog'], ['filter', '02 Filters'], ['block', '03 Complex page'], ['priceTag', '04 Programmes'], ['calendar', '05 Apply']];
  const decisions = [
    ['Programmes on the flat', 'Every complex lists the programmes it qualifies for — Green mortgage, Nauryz — with a link to the terms.'],
    ['The window comes first', 'Status, application dates, points date and a live countdown sit right under the complex name.'],
    ['Layouts are the hero', 'Rooms and pools as chips, a big plan, price, area, flats left and one “Apply” button.'],
    ['Four slots on every programme', 'First payment, loan size, term and rate always in the same place; “New” and “Archived” badges.'],
    ['Rules in tabs, plus a calculator', 'Description, participant and housing requirements split into tabs, with a payment table and a calculator.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    ${title2('THE', 'solution')}
    <div class="bd-flowicons" data-stagger>${flowIcons.map(([ic, l], i) => `<div class="bd-flowicon"><span class="bd-ico" style="--w:90px">${icon(ic)}</span><span class="bd-label">${l}</span></div>${i < 4 ? '<span class="bd-display-s bd-arrow">→</span>' : ''}`).join('')}</div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
    <a class="bd-label" href="#flow">→ Scroll the real screens in the user flow above: catalog · complex page · programmes · programme page.</a>
  </section>`;

  /* ---------- 08 Targets ---------- */
  const rows = [
    ['Applications started on a complex page', 'Programmes listed on the flat', '+30%', 'goal'],
    ['“Which programme fits me?” calls', 'Comparable programme cards', '−25%', 'goal'],
    ['Mobile visits that reach “Apply”', 'Layouts first on the complex page', '+20%', 'goal'],
    ['Missed application windows', 'Window and countdown up front', '−30%', 'goal'],
    ['Time from catalog to application', 'Filters as chips, one Apply button', '< 10 min', 'goal'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(06) — targets', 'THE', 'targets')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Design lever</th><th>Target</th><th>Type</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="bd-h3 bd-blue">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('crane')}</div>
      <div><p class="bd-serif-l bd-quote__text">“A flat and a mortgage are one decision — so they belong on one page.”</p><span class="bd-label">Design principle behind the complex page</span></div></div>
  </section>`;

  /* ---------- 09 Reflection ---------- */
  const learn = [
    [icon('crane'), 'Start from the money', 'People shop for a programme before a flat. Showing the fit early changes the whole funnel.'],
    [icon('priceTag'), 'Same slots, every card', 'Comparison only works when every programme speaks in the same four numbers.'],
    [icon('floorPlan'), 'Phones are not small desktops', 'The mobile complex page needed its own order, not the desktop page stacked up.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(07) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.market = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['how', 'How it works'], ['flow', 'User flow'], ['research', 'Research'], ['programmes', 'Programmes'], ['process', 'Process'], ['solution', 'Solution'], ['results', 'Targets'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${how()}${showcase()}${research()}${side()}${process()}${solution()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
