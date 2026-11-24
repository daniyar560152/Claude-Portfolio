/*
 * Smartbank case — statements for cards, accounts and deposits + the design system under them.
 * Built from two decks in the SWAMP MARKET Figma file (Section 7, node 157:63598):
 * "Выписки по счетам, депозитам и картам" and the 2023 Smartbank redesign / design-system deck.
 * Uses the helpers from board-housing.js (window.BOARD_KIT).
 */
(function (root) {
  const K = () => root.BOARD_KIT;
  const esc = (s) => K().esc(s), tag = (...a) => K().tag(...a), head = (...a) => K().head(...a), win = (...a) => K().win(...a);
  const icon = (...a) => K().icon(...a), stk = (n) => K().stk(n), ill = (n) => K().ill(n);
  const T = (s) => K().T(s), title2 = (a, b) => K().title2(a, b);
  const IMG = 'assets/img/smartbank/';

  /* ---------- zoomable slide ---------- */
  const shot = (file, alt, cap) => `
    <figure class="smb-shot" data-reveal>
      <button class="smb-shot__btn" type="button" data-smb-zoom="${IMG}${file}.webp" data-alt="${esc(T(alt))}" aria-label="${esc(T('Open full size'))}: ${esc(T(alt))}">
        <img src="${IMG}${file}.webp" alt="${esc(T(alt))}" width="1600" height="900" loading="lazy" decoding="async">
        <span class="bd-full" aria-hidden="true"><span>⤢</span>${T('Full screen')}</span>
      </button>
      ${cap ? `<figcaption class="bd-label">${esc(T(cap))}</figcaption>` : ''}
    </figure>`;
  if (typeof document !== 'undefined' && !root.__smbZoom) {
    root.__smbZoom = true;
    const open = (btn) => {
      let lb = document.querySelector('.bd-lb--zoom');
      if (!lb) {
        lb = document.createElement('div');
        lb.className = 'bd-lb bd-lb--zoom';
        lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('data-lenis-prevent', '');
        lb.innerHTML = `<div class="bd-lb__inner"><img alt=""></div><button class="bd-lb__close" type="button" aria-label="${esc(T('Close'))}">✕</button>`;
        document.body.appendChild(lb);
        const close = () => { lb.classList.remove('is-open'); document.documentElement.classList.remove('bd-lb-open'); if (lb._from) lb._from.focus({ preventScroll: true }); };
        lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.bd-lb__close')) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
      }
      const img = lb.querySelector('img');
      img.src = btn.dataset.smbZoom; img.alt = btn.dataset.alt || '';
      lb._from = btn; lb.scrollTop = 0;
      lb.classList.add('is-open'); document.documentElement.classList.add('bd-lb-open');
      lb.querySelector('.bd-lb__close').focus({ preventScroll: true });
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-smb-zoom]');
      if (b) { e.preventDefault(); open(b); return; }
      const t = e.target.closest && e.target.closest('[data-smb-theme]');
      if (t) {
        const box = t.closest('.smb-themes');
        box.dataset.theme = t.dataset.smbTheme;
        box.querySelectorAll('[data-smb-theme]').forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      }
    });
  }

  /* ---------- 01 Hero ---------- */
  const hero = (p) => `
  <section class="bd-sec bd-hero bd-hero--pink" id="overview" data-theme="light">
    <div class="bd-hero__top"><span class="bd-logo">Daniyar</span><span class="bd-label">${T('Case')} ${K().caseNo(p)}</span></div>
    <p class="bd-kicker" data-split="words">(${T('Case')} ${p.no}) — ${T('Eurasian Bank')} · Smartbank</p>
    <h1 class="bd-hero__title">
      <span class="bd-display-xl" data-split="chars">STATEMENTS</span>
      <span class="bd-hero__row"><span class="bd-serif-l bd-blue" data-split="words">&amp; the system</span><span class="bd-display-l" data-split="chars">UNDER THEM</span></span>
    </h1>
    <p class="bd-mono bd-center" style="max-width:760px">Smartbank is Eurasian Bank’s app for 430 000 people. I redesigned statements for cards, accounts and deposits — 12 months back, a free PDF, readable names and the bonus for every purchase — and built the design-system atoms underneath: four themes, colour tokens, 617 icons and the bank’s cards in vector.</p>
    <div class="bd-tags">${['Mobile banking', 'iOS · Android · Web', 'Design system', 'Research', 'Fintech'].map((t) => tag(t, 'white')).join('')}</div>
    <div class="bd-hero__art">
      <div class="bd-art" style="--w:300px;--r:3deg" data-tilt>${ill('tokenFan')}</div>
      <div class="bd-art" style="--w:310px" data-tilt>${ill('statementMac')}</div>
      <div class="bd-art" style="--w:290px;--r:-4deg" data-tilt>${ill('themeSwitch')}</div>
    </div>
    <span class="bd-label bd-swipe" aria-hidden="true">swipe →</span>
    <div class="bd-sticker bd-sticker--a" style="--w:185px;--r:-8deg">${stk('pdffree')}</div>
    <div class="bd-sticker bd-sticker--b" style="--w:150px;--r:10deg">${stk('viptheme')}</div>
  </section>`;

  /* ---------- 02 Overview ---------- */
  const facts = [
    ['Role', 'UX/UI designer — research, statements flow, transaction components, design-system atoms'],
    ['Timeline', '2023 · design ready by March, release in stages March → June'],
    ['Team', 'Product manager, analyst, iOS / Android / web developers, RS Bank and Way4 specialists'],
    ['Platform', 'Smartbank iOS, Android and web · RU / KZ'],
    ['Deliverables', 'CJM, benchmark, transaction anatomy, 100+ statement scenarios, detail screens, usability test, 4 themes, icon library, vector cards'],
    ['Tools', 'Figma, FigJam, Jira'],
  ];
  const overview = () => `
  <section class="bd-sec" id="project" data-theme="light">
    ${head('(01) — overview', 'THE', 'project')}
    <div class="bd-facts" data-stagger>${facts.map(([k, v]) => `<div class="bd-fact"><span class="bd-label bd-grey">${k}</span><p class="bd-body-l">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 03 TL;DR ---------- */
  const stats = [
    ['white', 430000, 0, 'Smartbank users who see statements'],
    ['yellow', 128713, 0, 'branch requests in 9 months — statements, certificates, sign-up'],
    ['mint', 93.75, 2, '% of test users read every transaction right'],
    ['pink', 617, 0, 'icons in the design system'],
  ];
  const fmt = (v) => String(v).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const tldr = () => `
  <section class="bd-sec bd-blue-bg" id="impact" data-theme="dark">
    ${title2('TL;DR', 'impact')}
    <p class="bd-mono">People queued at a branch and paid 100 ₸ a page for a statement the app could not give them. The new statement goes 12 months back, exports a free PDF, shows real names instead of accounting codes and the bonus for every purchase — and it sits on a design system with four themes, tokens and 617 icons.</p>
    <div class="bd-stats" data-stagger>${stats.map(([t, v, d, cap]) => `<div class="bd-stat bd-stat--${t}"><span class="bd-label"></span><b class="bd-display-s" data-count="${v}" data-group="1" data-decimals="${d}">${fmt(v)}</b><span class="bd-mono-s">${esc(cap)}</span></div>`).join('')}</div>
    <p class="bd-mono-s">Request numbers come from the bank’s electronic queue; 93.75% is from our statement test. The effects in the last table are what the team expected, not measured results.</p>
  </section>`;

  /* ---------- 04 Problem ---------- */
  const voices = [
    ['client_kz.txt', 'When money comes from another bank, the card statement doesn’t say which bank — so I have to go to the branch. And I can’t print the statement as a PDF.', 'Client, translated from Kazakh'],
    ['client_02.txt', 'Please make a statement for a chosen period — that’s very important.', 'Client'],
    ['client_03.txt', 'I’d like to see the balance at the start and the end of the day. Bonuses come off the card first and later off the bonus account — it isn’t transparent, especially on weekends.', 'Client'],
  ];
  const goals = [
    ['Business goals', 'yellow', ['Fewer statement calls and branch visits', 'Higher NPS — statements are a top reason of detractors', 'Make the bonus programme visible']],
    ['User goals', 'mint', ['A statement for any period, up to 12 months', 'A free PDF, right in the app', 'Names in my language, bonuses per purchase']],
    ['Constraints', 'pink', ['RS Bank and Way4 core systems', 'One statement for cards, accounts and deposits', 'Max 12 months back', 'RU / KZ']],
  ];
  const problem = () => `
  <section class="bd-sec" id="problem" data-theme="light">
    ${head('(02) — problem', 'THE', 'problem')}
    <div data-reveal>${win('problem_statement.txt', `<div class="bd-statement"><div class="bd-ico" style="--w:110px">${icon('statement')}</div><p class="bd-serif-k">In the app, money history lived only inside a card or an account and went six months back. A PDF meant a trip to the branch and 100 ₸ a page, transactions carried accounting-system names, and nobody could tell where their bonuses went.</p></div>`)}</div>
    <div class="bd-cols3" data-stagger>${voices.map(([f, q, who]) => win(f, `<div class="smb-voice"><p class="bd-serif-m">${T('“')}${esc(T(q))}${T('”')}</p><span class="bd-label bd-grey">${esc(who)}</span></div>`)).join('')}</div>
    <div class="bd-cols3" data-stagger>${goals.map(([h, t, items]) => `<div class="bd-goal bd-tint--${t}"><h3 class="bd-h2">${h}</h3>${items.map((x) => `<p class="bd-arrow-li"><span>→</span><span>${esc(x)}</span></p>`).join('')}</div>`).join('')}</div>
  </section>`;

  /* ---------- 05 Why now: request data ---------- */
  const requests = [['Statements & certificates — deposits', 26221], ['Statements & certificates — current accounts', 36171], ['Smartbank sign-up / statements & certificates', 66321]];
  const calls = [
    ['3 600+', 'clients called the contact centre about a statement'],
    ['2 000', 'calls to check a transaction’s RRN — a top-10 card question'],
    ['28%', 'of clients send money to other banks because they don’t know what bonus they’d get with us'],
  ];
  const value = [
    'A statement for more than six months, for any range of dates',
    'A PDF statement — free and online',
    'Bank operations in the language of the interface',
    'The bonus for every retail purchase',
    'Control of subscriptions and automatic payments',
  ];
  const why = () => `
  <section class="bd-sec bd-white-bg" id="why" data-theme="light">
    ${head('(03) — why now', 'WHY', 'now')}
    <div class="bd-split">
      <div class="bd-funnel" data-reveal><span class="bd-label">Branch requests in 9 months · electronic queue data</span>
        ${requests.map(([s, v]) => `<div class="bd-funnel__row"><span class="bd-mono-s">${esc(T(s))} — <b>${fmt(v)}</b></span><i class="bd-bar bd-bar--after" style="--v:${Math.round(v / 663.21)}"></i></div>`).join('')}
        <div class="bd-funnel__row"><span class="bd-h3">${T('Total')}: 128 713</span></div>
      </div>
      <div class="bd-insights" data-stagger>${calls.map(([v, d]) => `<div class="bd-insight"><b class="bd-h2 bd-blue">${v}</b><div><p class="bd-mono-s">${esc(d)}</p></div></div>`).join('')}</div>
    </div>
    <div class="smb-values" data-stagger>${value.map((v, i) => `<div class="smb-value"><b class="bd-h1 bd-blue">${i + 1}</b><p class="bd-mono">${esc(v)}</p></div>`).join('')}</div>
  </section>`;

  /* ---------- 06 Journey ---------- */
  const stages = [
    ['The need', ['Top up a deposit and be sure the money is safe', 'Show it for a loan', 'Get a visa'], 'Where can I get it fast?', '😐', []],
    ['Check the deposit', ['Opens the app and sees there is no PDF export'], 'It will take ages — the bank, a queue, a consultant', '🙁', ['How do I get a statement fast? Why not online?', 'I have to call the bank']],
    ['Look for a way', ['Calls the bank', 'Learns it means a branch and goes there', 'Pays for the statement — 100 ₸ a page'], '', '😩', ['Hours in traffic and queues', 'Paying page by page!']],
    ['“Success”', ['Takes the statement', 'Goes home unhappy'], '', '🙁', []],
  ];
  const journey = () => `
  <section class="bd-sec" id="journey" data-theme="light">
    ${head('(04) — journey', 'HOW IT', 'was')}
    <p class="bd-mono" style="max-width:760px">Customer journey map — getting a deposit statement, the global scenario.</p>
    <div class="smb-cjm" data-reveal>
      ${stages.map(([st, act, th, em, pain], i) => `
      <div class="smb-cjm__col">
        <div class="smb-cjm__stage"><b class="bd-label">0${i + 1}</b><h3 class="bd-h3">${esc(st)}</h3></div>
        <div class="smb-cjm__row"><span class="bd-label bd-grey">${T('Actions')}</span>${act.map((a) => `<p class="smb-cjm__note">${esc(a)}</p>`).join('')}</div>
        <div class="smb-cjm__row"><span class="bd-label bd-grey">${T('Thoughts')}</span>${th ? `<p class="smb-cjm__note smb-cjm__note--think">${esc(th)}</p>` : ''}</div>
        <div class="smb-cjm__row smb-cjm__emo"><span class="bd-label bd-grey">${T('Emotion')}</span><span class="smb-cjm__face" aria-hidden="true">${em}</span></div>
        <div class="smb-cjm__row"><span class="bd-label bd-grey">${T('Pains')}</span>${pain.map((a) => `<p class="smb-cjm__note smb-cjm__note--pain">${esc(a)}</p>`).join('')}</div>
      </div>`).join('')}
    </div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:180px">${icon('txRow')}</div>
      <div><p class="bd-serif-l bd-quote__text bd-quote__text--m">Every competitor we looked at — Kaspi, Halyk, Jusan, Forte, BCC, RBK — already had a full statement. For current accounts nobody had one: a gap to lead, not to catch up.</p>
      <span class="bd-label">${T('Benchmark')}: Kaspi · Halyk · Jusan · Forte · BCC · RBK · Simply</span></div></div>
  </section>`;

  /* ---------- 07 Solution: anatomy + details ---------- */
  const parts = [['Transaction icon', 'Category or a bank’s logo'], ['Recipient / sender', 'A shop or a person, not an accounting code'], ['Transaction type', 'Purchase, top-up, transfer, between own accounts'], ['Amount charged / topped up', 'Sign, currency, kopecks in grey'], ['Bonuses', 'What this purchase earned, in % and points'], ['Status', 'In progress, declined — only when it isn’t done']];
  const decisions = [
    ['One statement everywhere', 'Cards, accounts and deposits share one list, one row and one details sheet.'],
    ['12 months, any range, free PDF', 'Pick dates up to a year back and export a PDF in the app for 0 ₸.'],
    ['Names people recognise', 'Shops, people and banks instead of system strings; operations in the interface language.'],
    ['Bonuses you can count', 'Every purchase shows its bonus; the details split it into guaranteed, category and contactless.'],
    ['Details, not a receipt', '100+ scenarios: card and bonus write-offs, exchange rate for conversions, RRN, repeat and receipt.'],
  ];
  const solution = () => `
  <section class="bd-sec bd-ink-bg" id="solution" data-theme="dark">
    ${title2('THE', 'solution')}
    <div class="smb-anatomy" data-reveal>
      <span class="bd-label">${T('Transaction anatomy — one row for every product')}</span>
      <div class="smb-row" aria-hidden="true">
        <span class="smb-row__ico"><i class="smb-dot">1</i><svg viewBox="0 0 24 24" width="26" height="26"><rect x="3" y="7" width="13" height="11" rx="2" fill="currentColor"/><path d="M16 11l5-3v9l-5-3z" fill="currentColor"/></svg></span>
        <span class="smb-row__mid"><b>Cinema 11 <i class="smb-dot">2</i></b><small>${T('Entertainment')} <i class="smb-dot">3</i></small></span>
        <span class="smb-row__end"><b>− 5 000 <em>₸</em> <i class="smb-dot">4</i></b><small class="smb-bonus">+1 500 B (30%) <i class="smb-dot">5</i></small></span>
      </div>
      <div class="smb-row smb-row--sm" aria-hidden="true">
        <span class="smb-row__ico"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>
        <span class="smb-row__mid"><b>${T('Dollar account')}</b><small>${T('Between own accounts')}</small></span>
        <span class="smb-row__end"><b>− 12 850 <em>$</em></b><small class="smb-status smb-status--wait">${T('In progress')} <i class="smb-dot">6</i></small></span>
      </div>
      <ol class="smb-parts">${parts.map(([h, d]) => `<li><b>${esc(T(h))}</b><span>${esc(T(d))}</span></li>`).join('')}</ol>
    </div>
    <div class="smb-bonusbox" data-reveal>
      <span class="bd-label">${T('Bonuses in the details')}</span>
      <p class="bd-h2">+1 650 B <span class="bd-grey">(33%)</span></p>
      ${[['Guaranteed bonus 1%', '+50'], ['Higher bonus in “Entertainment” 30%', '+1 500'], ['Contactless payment 2%', '+100']].map(([l, v]) => `<p class="smb-bonusbox__row"><span>${esc(T(l))}</span><b>${v}</b></p>`).join('')}
    </div>
    <div class="bd-decisions" data-stagger>${decisions.map(([t, d], i) => `<div class="bd-decision"><b class="bd-h1">0${i + 1}</b><div><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div></div>`).join('')}</div>
    ${shot('details', 'Card transaction details — as we want it and as it is now', 'Transaction details: as we want it (left) and as it was (right) · 100+ scenarios')}
  </section>`;

  /* ---------- 08 Test ---------- */
  const tests = [['100%', 'identified every status correctly'], ['93.75%', 'read all transactions in the statement right'], ['6.25%', 'were confused by the “between own accounts” icon — it looked like “repeat payment”, so we redrew it']];
  const test = () => `
  <section class="bd-sec bd-white-bg" id="test" data-theme="light">
    ${head('(05) — test', 'DID IT', 'read')}
    <div class="bd-cols3" data-stagger>${tests.map(([v, l]) => `<div class="bd-metric"><b class="bd-metric-l">${v}</b><span class="bd-label">${esc(l)}</span></div>`).join('')}</div>
    ${shot('test', 'Statement test results', 'Statement test on an account statement prototype')}
  </section>`;

  /* ---------- 09 Design system (both decks, one story) ---------- */
  const dsStats = [['4', 'themes — Black VIP, Black regular, White regular, White VIP'], ['76', 'tokens in one theme, 300+ in all'], ['617', 'icons for 2 platforms, desktop and mobile'], ['12 + 22', 'bank cards in vector + mini logos of other banks']];
  const layers = [
    ['swatches', 'lilac', 'Colour tokens', 'Three palettes per theme: text (main, links, errors, warnings, confirmation, the tenge sign), backgrounds, and buttons & UI elements. Every token has a name, a hex and a rule of use.'],
    ['iconGrid', 'yellow', 'Iconography', 'Interface icons in 9 categories and five sizes — 24, 20, 18, 16, 14 px — plus currencies, and payments: benefits and MCC categories that give every transaction its icon.'],
    ['cardFan', 'mint', 'Cards & logos', '12 Eurasian Bank card designs redrawn in vector and 22 mini logos of other banks, so transfers and statements show the real card or bank.'],
    ['txRow', 'pink', 'Statement components', 'The transaction row, statuses, bonus line and details sheet from the statements project became shared components for cards, accounts and deposits.'],
  ];
  const tokens = [['light_vip-colorText-primary-whitegreyBG', '#2C2D2E', 'Main headline colour — reads black on white or grey backgrounds'], ['light_vip-colorText-secondary-whitegreyBG', '#8A827A', 'Subheads and regular text in grey frames; second-level information'], ['dark_vip-colorText-primary', '#FFF8F2', 'Main headline colour — reads white on dark backgrounds'], ['dark_vip-colorText-secondary', '#ADA299', 'Subheads and regular text on dark backgrounds']];
  const themes = [['black-vip', 'Black VIP'], ['black', 'Black regular'], ['white', 'White regular'], ['white-vip', 'White VIP']];
  const system = () => `
  <section class="bd-sec" id="system" data-theme="light">
    ${head('(06) — design system', 'ONE', 'system')}
    <p class="bd-mono" style="max-width:820px">Both projects stand on the same atoms. Statements gave the system its components; the Smartbank redesign — profile, VIP and Premium services, card management, bonuses, Visa alias transfers, notifications, payroll — gave it themes, tokens and icons.</p>
    <div class="bd-cols4" data-stagger>${dsStats.map(([v, l]) => `<div class="bd-metric"><b class="bd-metric-l">${v}</b><span class="bd-label">${esc(l)}</span></div>`).join('')}</div>
    <div class="smb-layers" data-stagger>${layers.map(([ic, t, h, d]) => `<div class="smb-layer bd-tint--${t}"><span class="bd-ico" style="--w:72px">${icon(ic)}</span><h3 class="bd-h2">${h}</h3><p class="bd-mono-s">${d}</p></div>`).join('')}</div>

    <h3 class="bd-h1 smb-subhead">${T('A few examples')}</h3>
    <div class="smb-themes" data-theme="black-vip" data-reveal>
      <div class="smb-themes__side">
        <span class="bd-label">${T('Example 1 · one screen, four themes')}</span>
        <div class="smb-themes__btns" role="group" aria-label="${esc(T('Theme'))}">${themes.map(([k, n], i) => `<button type="button" data-smb-theme="${k}" aria-pressed="${i === 0}">${esc(T(n))}</button>`).join('')}</div>
        <p class="bd-mono-s">${T('The same components switch theme through tokens — nothing is redrawn.')}</p>
      </div>
      <div class="smb-demo" aria-label="${esc(T('Theme preview'))}">
        <p class="smb-demo__title">Metalcard</p>
        <div class="smb-demo__card"><small>${T('Available on the account')}</small><b>5 000 543<em>.00 ₸</em></b><small>610 638.18 ₽ · 9 106.51 £</small></div>
        <span class="smb-demo__btn">${T('Top up the card')}</span>
        <div class="smb-demo__tabs"><span>${T('Statement')}</span><span class="is-on">${T('Info')}</span><span>${T('Actions')}</span></div>
        <div class="smb-demo__row"><i>▶</i><span><b>Cinema 11</b><small>${T('Entertainment')}</small></span><span class="r"><b>− 5 000 ₸</b><small class="acc">+1 500 B (30%)</small></span></div>
        <div class="smb-demo__row"><i>K</i><span><b>Kaspi Bank</b><small>${T('To another bank’s card')}</small></span><span class="r"><b>− 44 950 ₸</b><small class="err">${T('Declined')}</small></span></div>
        <div class="smb-demo__row"><i>⇄</i><span><b>${T('Dollar account')}</b><small>${T('Between own accounts')}</small></span><span class="r"><b>− 12 850 $</b><small class="wait">${T('In progress')}</small></span></div>
      </div>
    </div>

    <div class="smb-tokens" data-reveal>
      <span class="bd-label">${T('Example 2 · tokens with a name, a value and a rule')}</span>
      ${tokens.map(([n, hex, d]) => `<div class="smb-token"><i style="background:${hex}"></i><code>${n}</code><b>${hex}</b><span class="bd-mono-s bd-grey">${esc(T(d))}</span></div>`).join('')}
      <span class="bd-label bd-grey">${T('+ 300 more tokens across four themes')}</span>
    </div>

    <span class="bd-label">${T('Example 3 · the system in use — open any slide full size')}</span>
    <div class="smb-gallery">
      ${shot('vip', 'Black VIP theme on three Smartbank screens', 'Black VIP theme: card, home and transfer')}
      ${shot('icons', 'Interface icons in 24, 20 and 18 px', 'Interface icons · 24 / 20 / 18 px')}
      ${shot('payments', 'Payment icons: benefits and MCC categories', 'Payments: benefits and MCC icons')}
      ${shot('cards', 'Eurasian Bank cards in vector and other banks’ mini logos', '12 cards in vector · 22 mini logos')}
    </div>
    ${shot('redesign', 'Smartbank redesign overview', 'Smartbank redesign: profile, VIP · Premium, cards, bonuses, Visa alias, notifications, payroll')}
  </section>`;

  /* ---------- 10 Expected ---------- */
  const rows = [
    ['Front-office requests', 'Statements and PDF in the app', '−5 000', 'expected'],
    ['Contact-centre calls about statements and bonuses', 'Readable names, bonus per purchase', 'fewer', 'expected'],
    ['NPS — detractors naming statements (38% deposits, 22% cards)', 'Full statement for every product', 'up', 'expected'],
    ['Price of a statement', 'PDF in the app', '0 ₸', 'shipped in design'],
    ['How far back', 'Date range picker', '12 months', 'shipped in design'],
  ];
  const results = () => `
  <section class="bd-sec" id="results" data-theme="light">
    ${head('(07) — expected', 'WHAT WE', 'expected')}
    <div class="bd-table-wrap" data-reveal><table class="bd-table"><thead><tr><th>Metric</th><th>Design lever</th><th>Target</th><th>Type</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="bd-h3 bd-blue">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <div class="bd-quote" data-reveal><div class="bd-art" style="--w:200px">${icon('gem')}</div>
      <div><p class="bd-serif-l bd-quote__text">“A statement is the most used part of a bank — it should be the clearest one.”</p><span class="bd-label">Design principle behind the statement</span></div></div>
  </section>`;

  /* ---------- 11 Reflection ---------- */
  const learn = [
    [icon('statement'), 'Data beats opinions', 'Queue numbers and call reasons made the case for statements faster than any mockup.'],
    [icon('themeSplit'), 'Themes start with names', 'Four themes only worked once every colour had a token name and a rule of use.'],
    [icon('iconGrid'), 'A product feeds the system', 'The statement row, statuses and bonus line became components the whole app now uses.'],
  ];
  const reflection = (next) => `
  <section class="bd-sec bd-white-bg bd-sec--last" id="learnings" data-theme="light">
    ${head('(08) — reflection', 'WHAT I', 'learned')}
    <div class="bd-cols3" data-stagger>${learn.map(([art, t, d]) => `<div class="bd-learn"><span class="bd-ico" style="--w:80px">${art}</span><h3 class="bd-h2">${t}</h3><p class="bd-mono">${d}</p></div>`).join('')}</div>
    ${K().nextCard(next)}
  </section>`;

  root.BOARDS = root.BOARDS || {};
  root.BOARDS.smartbank = {
    toc: [['overview', 'Overview'], ['impact', 'TL;DR'], ['problem', 'Problem'], ['why', 'Why now'], ['journey', 'Journey'], ['solution', 'Solution'], ['test', 'Test'], ['system', 'Design system'], ['results', 'Expected'], ['learnings', 'Reflection']],
    render: (p, next) => `<div class="bd">${hero(p)}${overview()}${tldr()}${problem()}${why()}${journey()}${solution()}${test()}${system()}${results()}${reflection(next)}</div>`,
  };
})(typeof window !== 'undefined' ? window : globalThis);
