/*
 * Case-study renderer. Builds every "screen" of a senior-PD style case study
 * from assets/js/projects.js:  case.html?p=<slug>  (or a static build page that sets window.CASE_SLUG)
 */
(function () {
  const PROJECTS = window.PROJECTS || [];
  const T = (x) => (window.t ? window.t(x) : x);
  const params = new URLSearchParams(location.search);
  const idx = Math.max(0, PROJECTS.findIndex((p) => p.slug === (window.CASE_SLUG || params.get('p'))));
  const p = PROJECTS[idx];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const arrow = '<svg viewBox="0 0 16 16"><path d="M2 8h11M8.5 3 13 8l-4.5 5" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

  /* ---------------- device frames ---------------- */
  const phone = (body, cls = '') => `<div class="phone ${cls}"><div class="phone__screen"><div class="phone__notch"></div><div class="phone__status"><span>9:41</span><span>▮▮▮ ◔</span></div><div class="phone__body">${body}</div></div></div>`;
  const desk = (url, side, main) => `<div class="desk"><div class="desk__bar"><i></i><i></i><i></i><span>${url}</span></div><div class="desk__body"><div class="desk__side">${side.map((s, i) => `<div class="${i === 0 ? 'on' : ''}">${s}</div>`).join('')}</div><div class="desk__main">${main}</div></div></div>`;
  const annot = (n, text, x, y) => `<span class="annot" style="left:${x}px;top:${y}px" data-annot><b>${n}</b>${text}</span>`;
  const wrap = (device, notes, cap) => `<figure class="screen-wrap" data-inview data-screen>${device}${notes.join('')}<figcaption class="screen-cap">${cap}</figcaption></figure>`;
  // real exported screen inside the browser frame (used by the Otbasy case)
  const shot = (url, src, alt, cls = '') => `<div class="desk desk--shot ${cls}"><div class="desk__bar"><i></i><i></i><i></i><span>${url}</span></div><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></div>`;

  /* ---------------- mock screens (monochrome UI, hi-fi) ---------------- */
  const MOCKS = {
    'phone-onboarding': () => wrap(phone(`
        <div class="ui-sub">Step 2 of 4</div>
        <div class="ui-progress" style="--w:50%"><i></i></div>
        <div class="ui-h">Open your Pocket account</div>
        <div class="ui-sub">Takes about <b>4 minutes</b>. You can pause any time — we'll save your progress.</div>
        <div class="ui-step done"><b>✓</b>Phone number<small>0:40</small></div>
        <div class="ui-step now"><b>2</b>Verify identity<small>~2 min</small></div>
        <div class="ui-step"><b>3</b>Personal details<small>1 min</small></div>
        <div class="ui-step"><b>4</b>Add money<small>30 s</small></div>
        <div class="ui-trust"><i></i>Licensed e-money institution · bank-grade encryption</div>
        <div class="ui-btn">Continue</div>`),
      [annot(1, 'Time estimate up front', 170, 96), annot(2, 'Named steps, not 9 screens', 180, 250), annot(3, 'Trust note at peak anxiety', 150, 430)], 'Onboarding · stepper'),
    'phone-idscan': () => wrap(phone(`
        <div class="ui-sub">Identity · front of ID card</div>
        <div class="ui-h" style="font-size:17px">Fit your ID in the frame</div>
        <div class="camera"><div class="camera__card"></div><div class="camera__guide ok"><i></i><i></i><i></i><i></i></div><div class="camera__scan"></div><div class="camera__tip">✓ Good light — hold still</div></div>
        <div class="ui-sub" style="text-align:center">Capturing automatically…</div>
        <div class="ui-btn ghost">Upload a photo instead</div>`),
      [annot(4, 'Auto-capture + edge detection', 160, 200), annot(5, 'Live coaching tips', 170, 380)], 'ID scan · auto-capture'),
    'phone-success': () => wrap(phone(`
        <div class="success-tick"><svg viewBox="0 0 40 40"><path d="M9 21 l8 8 l15 -17"/></svg></div>
        <div class="ui-h" style="text-align:center">You're in!</div>
        <div class="ui-sub" style="text-align:center">Account ready in 3:58 — faster than 82% of people.</div>
        <div class="bank-card"><span>POCKET · DEBIT</span><b>Pocket</b><span>•••• 4821 &nbsp; 09/29</span></div>
        <div class="ui-btn">Add money</div>`),
      [annot(6, 'Delight moment (Lottie)', 160, 110)], 'Success · first value'),

    'desk-dashboard': () => wrap(desk('app.orbit.io/dashboards/revenue', ['Overview', 'Dashboards', 'Reports', 'Alerts', 'Settings'], `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div class="ui-h">Revenue overview</div><div style="display:flex;gap:6px"><span class="ui-chip">7d</span><span class="ui-chip on">30d</span><span class="ui-chip">90d</span></div></div>
        <div class="ui-grid" style="grid-template-columns:repeat(4,1fr)">
          <div class="ui-card ui-kpi"><span>MRR</span><b>€482k</b><em>▲ 4.2%</em></div>
          <div class="ui-card ui-kpi"><span>Active accounts</span><b>3,214</b><em>▲ 1.8%</em></div>
          <div class="ui-card ui-kpi"><span>Churn</span><b>1.9%</b><em>▼ 0.3 pp</em></div>
          <div class="ui-card ui-kpi"><span>NRR</span><b>112%</b><em>▲ 2 pp</em></div>
        </div>
        <div class="ui-card"><svg class="linechart" viewBox="0 0 600 150" preserveAspectRatio="none"><path class="area" d="M0 120 C60 110 90 90 150 95 S260 60 320 70 S430 40 480 45 S560 20 600 18 L600 150 L0 150Z"/><path class="l2" d="M0 110 C80 112 160 100 240 98 S400 90 600 80"/><path class="l1" d="M0 120 C60 110 90 90 150 95 S260 60 320 70 S430 40 480 45 S560 20 600 18"/></svg></div>
        <div class="ui-card"><table class="table-mini"><tr><th>Account</th><th>Plan</th><th>MRR</th><th>Health</th></tr><tr><td>Northwind</td><td>Enterprise</td><td>€24.1k</td><td><span class="pill up">Healthy</span></td></tr><tr><td>Lumen Health</td><td>Growth</td><td>€8.4k</td><td><span class="pill">At risk</span></td></tr><tr><td>Acme Retail</td><td>Growth</td><td>€6.9k</td><td><span class="pill up">Healthy</span></td></tr></table></div>`),
      [annot(1, 'Semantic tokens → dark mode & white-label', 260, 40), annot(2, 'Data table pattern v2', 420, 380)], 'Dashboard built 100% from Orbit DS'),
    'desk-components': () => wrap(desk('figma.com/orbit-ds — Components', ['Foundations', 'Components', 'Patterns', 'Templates', 'Changelog'], `
        <div style="display:flex;justify-content:space-between;align-items:center"><div class="ui-h">Button</div><span class="pill up">142 components · v2.0</span></div>
        <div class="ui-card"><div class="label" style="margin-bottom:10px">Variants · State</div><div class="btnrow"><span class="b p">Primary</span><span class="b s">Secondary</span><span class="b t">Tertiary</span><span class="b d">Disabled</span><span class="b f">Focus</span><span class="toggle"></span></div></div>
        <div class="ui-grid" style="grid-template-columns:repeat(3,1fr)"><div class="field">Default</div><div class="field focus">Focused|</div><div class="field err">Error · required</div></div>
        <div class="ui-card"><div class="label" style="margin-bottom:10px">Tokens · color/semantic</div><div class="swatches" style="margin-bottom:18px"><div style="background:#0a24ff"><small>brand</small></div><div style="background:#111"><small>fg/default</small></div><div style="background:#f3f3f1"><small>bg/subtle</small></div><div style="background:#ff5b1f"><small>danger</small></div><div style="background:#b4e9e6"><small>success/bg</small></div><div style="background:#c9c8ff"><small>accent</small></div></div></div>
        <div class="ui-card"><div class="label" style="margin-bottom:10px">Spacing · 4pt scale</div>${[4, 8, 12, 16, 24, 32, 48].map((n) => `<div style="display:flex;align-items:center;gap:10px;margin:3px 0"><span style="width:${n * 3}px;height:8px;background:var(--blue);border-radius:2px"></span><span class="label">space/${n}</span></div>`).join('')}</div>`),
      [annot(3, 'Figma props = React props', 300, 90), annot(4, 'Focus rings built in (WCAG 2.2)', 470, 130)], 'Library · Button, inputs & tokens'),

    'phone-booking': () => wrap(phone(`
        <div class="ui-sub">Book a visit · Medly Centrum</div>
        <div class="ui-h" style="font-size:17px">What do you need help with?</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px"><span class="ui-chip on">Cold &amp; flu</span><span class="ui-chip">Check-up</span><span class="ui-chip">Prescription</span><span class="ui-chip">Something else</span></div>
        <div class="ui-h" style="font-size:15px;margin-top:4px">Earliest available</div>
        <div class="cal"><div class="on">Mon<b>12</b></div><div>Tue<b>13</b></div><div>Wed<b>14</b></div><div>Thu<b>15</b></div><div>Fri<b>16</b></div></div>
        <div class="slots"><span class="off">08:30</span><span class="on">09:10</span><span>09:50</span><span>11:20</span><span>14:00</span><span>15:40</span></div>
        <div class="doc"><span class="av" style="--c-soft:var(--mint)">${window.ILL ? window.ILL.researcher() : ''}</span><div><b>Any available GP</b><div class="ui-sub">Dr. Smit or Dr. Kaya · 400 m</div></div></div>
        <div class="ui-btn">Book 09:10 today</div>`),
      [annot(1, 'Time first, doctor optional', 160, 220), annot(2, '48px targets at 200% zoom', 170, 330)], 'Booking · time-first flow'),
    'desk-booking': () => wrap(desk('medly.app/book', ['Book', 'My visits', 'Prescriptions', 'Messages', 'Profile'], `
        <div class="field focus">Reason: Cold &amp; flu symptoms</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="ui-chip on">Earliest first</span><span class="ui-chip">Any GP</span><span class="ui-chip">Near me</span><span class="ui-chip">Video call</span></div>
        <div class="ui-grid" style="grid-template-columns:1.4fr 1fr">
          <div class="ui-grid">${[['Medly Centrum', 'Today 09:10', '400 m'], ['Medly Oost', 'Today 11:45', '2.1 km'], ['Medly Video', 'Today 12:00', 'Online']].map(([c, t, d], i) => `<div class="ui-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><b>${c}</b><div class="ui-sub">${d} · next: <b style="color:var(--ink)">${t}</b></div></div><span class="b ${i === 0 ? 'p' : 's'}">Book</span></div>`).join('')}</div>
          <div class="ui-card"><div class="label">Your booking</div><div class="ui-h" style="margin:8px 0">Mon 12 · 09:10</div><div class="ui-sub">Medly Centrum · any GP<br/>Reminder by SMS 48h &amp; 2h before</div><div style="margin-top:12px" class="ui-trust"><i></i>Can't make it? Cancel in 1 tap — your slot goes to the waitlist.</div></div>
        </div>`),
      [annot(3, 'Earliest slot sorted first', 230, 120), annot(4, 'Waitlist for cancellations', 560, 360)], 'Responsive web · desktop'),

    'phone-chat': () => wrap(phone(`
        <div style="display:flex;justify-content:space-between;align-items:center"><b>Shoply assistant</b><span class="pill">AI</span></div>
        <div class="chat">
          <div class="bubble me">Running shoes for flat feet, under €120?</div>
          <div class="bubble ai">3 picks with stability support for flat feet:</div>
        </div>
        <div class="pcards">
          <div class="pcard" style="--c-soft:var(--yellow)"><div class="img"><i></i></div><b>Tempo S</b>€96<em>Best for flat feet</em></div>
          <div class="pcard" style="--c-soft:var(--mint)"><div class="img"><i></i></div><b>Glide Pro</b>€109<em>Wide fit</em></div>
          <div class="pcard" style="--c-soft:var(--pink)"><div class="img"><i></i></div><b>Air Run</b>€118<em>Max cushion</em></div>
        </div>
        <div class="ui-sub">Why these? Firm medial post + 8mm drop, rated 4.6★ by flat-footed runners.</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="ui-chip on">Compare 2</span><span class="ui-chip">Wide fit only</span><span class="ui-chip">Why these?</span></div>
        <div class="ui-sub" style="margin-top:auto;font-size:10px">AI-generated · based on reviews &amp; brand specs</div>`),
      [annot(1, 'Answers are products', 170, 190), annot(2, '“Why it fits” in one line', 160, 330)], 'Assistant · product answers'),
    'phone-compare': () => wrap(phone(`
        <div class="ui-h" style="font-size:17px">Tempo S vs Glide Pro</div>
        <div class="bubble ai" style="max-width:100%"><span class="thinking"><i></i><i></i><i></i></span>&nbsp; Checking stock in size 43…</div>
        <table class="cmp"><tr><th></th><th>Tempo S</th><th>Glide Pro</th></tr><tr><td>Price</td><td class="win">€96</td><td>€109</td></tr><tr><td>Support</td><td class="win">High</td><td>Medium</td></tr><tr><td>Drop</td><td>8 mm</td><td>10 mm</td></tr><tr><td>Weight</td><td class="win">248 g</td><td>271 g</td></tr><tr><td>Rating</td><td>4.6★</td><td>4.5★</td></tr></table>
        <div class="ui-trust"><i></i>Based on 2,341 reviews &amp; brand specs</div>
        <div class="ui-btn">Add Tempo S to bag</div>`),
      [annot(3, '1-tap compare table', 160, 160), annot(4, 'Visible “thinking” state', 150, 80)], 'Compare · decision support'),
  };

  /* ---------------- page sections ---------------- */
  function hero() {
    return `
    <section class="cs-hero" id="overview" data-theme="light">
      <div class="wrap">
        <div class="crumbs"><a href="${window.homeUrl || 'index.html'}#work">← All work</a><span>${p.no} / ${String(PROJECTS.length).padStart(2, '0')}</span><span>${p.category}</span><span>${p.year}</span></div>
        <p class="kicker center" data-split="lines">${esc(p.client)}</p>
        <h1 class="display cs-title"><span data-split="chars">${esc(p.title[0])}</span><span class="serif blue" data-split="chars">${esc(p.title[1])}</span></h1>
        <p class="cs-lead">${esc(p.summary)}</p>
        <div class="cs-cover c-${p.color}">
          <div class="wcard__frame"><div class="cs-cover__inner" data-cursor="Hi!">
            <div data-ill="${p.ill}" data-tilt style="width:min(70%,520px)"></div>
            <div class="deco-sticker" style="width:130px;left:7%;top:10%;transform:rotate(-12deg)" data-sticker="${(p.coverStickers || [])[0] || 'ship'}"></div>
            <div class="deco-sticker" style="width:120px;right:8%;bottom:10%;transform:rotate(10deg)" data-sticker="${(p.coverStickers || [])[1] || 'burst'}"></div>
          </div></div>
        </div>
        <dl class="meta">
          <div><dt class="label">Role</dt><dd>${esc(p.meta.role)}</dd></div>
          <div><dt class="label">Timeline</dt><dd>${esc(p.meta.timeline)}</dd></div>
          <div><dt class="label">Team</dt><dd>${esc(p.meta.team)}</dd></div>
          <div><dt class="label">Platform</dt><dd>${esc(p.meta.platform)}</dd></div>
          <div><dt class="label">Deliverables</dt><dd>${esc(p.meta.deliverables)}</dd></div>
        </dl>
        <div class="tools"><span class="label" style="align-self:center;margin-right:6px">Tools —</span>${p.tools.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      </div>
    </section>`;
  }

  const label = (n, text) => `<div class="cs-label"><b>${n}</b><span class="label">${text}</span></div>`;

  function impact() {
    return `
    <section class="cs-sec sec--dark" id="impact" data-theme="dark">
      <div class="wrap">
        ${label('01', 'TL;DR')}
        <div class="tldr">
          <h2 class="display cs-h" data-split="words">Impact <span class="serif">at a glance</span></h2>
          <p data-reveal>${esc(p.summary)}</p>
        </div>
        <div class="impact">${p.impact.map((m) => `<div data-reveal><b data-count="${m.value}" data-prefix="${m.prefix || ''}" data-suffix="${esc(m.suffix)}" data-decimals="${m.decimals || 0}">${m.prefix || ''}${m.value}${esc(m.suffix)}</b><span>${esc(m.label)}</span><small>${esc(m.from)}</small></div>`).join('')}</div>
      </div>
    </section>`;
  }

  function problem() {
    const list = (arr) => `<ul>${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    return `
    <section class="cs-sec" id="problem" data-theme="light">
      <div class="wrap">
        ${label('02', 'The problem')}
        <p class="problem-quote" data-split="words">${esc(p.problem)}</p>
        <div class="goals" data-stagger>
          <div class="goal goal--blue"><h3>Business goals</h3>${list(p.goals.business)}</div>
          <div class="goal"><h3>User goals</h3>${list(p.goals.user)}</div>
          <div class="goal goal--k"><h3>Constraints</h3>${list(p.constraints)}</div>
        </div>
      </div>
    </section>`;
  }

  function research() {
    const f = p.funnel;
    const scale = f.scale || Math.max(...f.before, ...f.after);
    const drop = f.highlight;
    const hasAfter = f.after.some((v, i) => v !== f.before[i]);
    const rows = f.steps.map((s, i) => `
      <div class="funnel__row${i === drop ? ' is-drop' : ''}">
        <span>${esc(s)}</span>
        <span class="funnel__bars"><i class="b-before" style="width:${(f.before[i] / scale) * 100}%"></i><i class="b-after" style="width:${(f.after[i] / scale) * 100}%"></i></span>
        <b data-val-before="${f.before[i]}" data-val-after="${f.after[i]}">${f.before[i]}</b>
      </div>`).join('');
    return `
    <section class="cs-sec sec--white" id="research" data-theme="light">
      <div class="wrap">
        ${label('03', 'Research')}
        <h2 class="display cs-h" data-split="words" style="margin-bottom:50px">What we <span class="serif">learned</span></h2>
        <div class="methods" data-stagger>${p.methods.map((m) => `<div class="method"><b>${esc(m.n)}</b><span>${esc(m.label)}</span><em>${esc(m.tool)}</em></div>`).join('')}</div>
        <div class="research-grid">
          <div class="funnel" data-funnel>
            <div class="funnel__head">
              <span class="label">${esc(f.label)}</span>
              ${hasAfter ? `<div class="funnel__legend"><button type="button" class="ui-chip on" data-funnel-toggle>Show after →</button></div>` : ''}
            </div>
            ${rows}
            <p class="funnel__note">${esc(f.note || '')}</p>
          </div>
          <div data-ill="researcher" data-ill-arg="${esc(p.researchTag || '')}" data-parallax="0.08"></div>
        </div>
        <div class="insights">${p.insights.map((x, i) => `<article class="insight" style="--r:${[-2.5, 1.5, -1][i]}deg"><span class="pin"></span><b>${esc(x.stat)}</b><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div>
        <div class="hmw">${p.hmw.map((h, i) => `<div data-reveal><span>HMW ${String(i + 1).padStart(2, '0')}</span>${esc(h)}</div>`).join('')}</div>
      </div>
    </section>`;
  }

  function process() {
    return `
    <section class="cs-sec sec--blue" id="process" data-theme="blue" style="--ill-ink:#111">
      <div class="wrap">
        ${label('04', 'Process')}
        <h2 class="display cs-h" data-split="words">How we <span class="serif">got there</span></h2>
        <div class="timeline" data-timeline>${p.process.map((s, i) => `
          <div class="phase">
            <div class="phase__dot">${String(i + 1).padStart(2, '0')}</div>
            <h3>${esc(s.phase)}</h3>
            <span class="label">${esc(s.weeks)}</span>
            <p>${esc(s.what)}</p>
            <div class="tools">${s.tools.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function solution() {
    return `
    <section class="cs-sec" id="solution" data-theme="light">
      <div class="wrap">
        ${label('05', 'Solution')}
        <h2 class="display cs-h" data-split="words">Key <span class="serif">decisions</span></h2>
        <div class="decisions" data-stagger>${p.decisions.map((d, i) => `<div class="decision"><b>${i + 1}</b><div><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></div></div>`).join('')}</div>
        <div class="screens__stage c-${p.color}" style="margin-top:clamp(50px,6vw,90px)">
          <p class="kicker center">The screens</p>
          <div class="screens" style="margin-top:30px">${p.screens.map((k) => (MOCKS[k] ? MOCKS[k]() : '')).join('')}</div>
        </div>
      </div>
    </section>`;
  }

  function results() {
    return `
    <section class="cs-sec sec--dark" id="results" data-theme="dark">
      <div class="wrap">
        ${label('06', 'Results')}
        <h2 class="display cs-h" data-split="words">What <span class="serif">changed</span></h2>
        <table class="results">
          <thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Change</th></tr></thead>
          <tbody>${p.results.map((r) => `<tr><td>${esc(r.metric)}</td><td class="before">${esc(r.before)}</td><td class="big">${esc(r.after)}</td><td class="big delta">${esc(r.delta)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="bigquote">
          <div data-ill="commenter" style="--ill-paper:#fff"></div>
          <blockquote data-reveal>“${esc(p.quote.text)}”<cite>— ${esc(p.quote.who)}</cite></blockquote>
        </div>
      </div>
    </section>`;
  }

  function learnings() {
    return `
    <section class="cs-sec" id="learnings" data-theme="light">
      <div class="wrap">
        ${label('07', 'Reflection')}
        <h2 class="display cs-h" data-split="words">What I'd <span class="serif">do again</span></h2>
        <div class="learn" data-stagger>${p.learnings.map((l, i) => `<div><b>0${i + 1}</b><p>${esc(l)}</p></div>`).join('')}</div>
        <a class="next c-${next.color}" href="${window.caseUrl(next.slug)}" data-cursor="Next">
          <div class="wcard__frame"><div class="next__inner">
            <div><p class="label">${T('Next case study')} — ${next.no} · ${esc(next.category)}</p><h2 class="display">${esc(next.title[0])} <span class="serif">${esc(next.title[1])}</span></h2>
            <span class="btn" style="margin-top:20px"><span class="btn__icon">${arrow}</span><span class="btn__text">Read it</span></span></div>
            <div data-ill="${next.ill}"></div>
          </div></div>
        </a>
      </div>
    </section>`;
  }

  window.renderPage = function () {
    if (!p) return;
    document.title = `${p.client} — ${p.short} · Daniyar`;
    // language switch in the nav points at this same case in the other language
    const sw = document.querySelector('[data-lang-switch]');
    if (sw && window.altCaseUrl) sw.href = window.altCaseUrl(p.slug);
    const main = document.getElementById('case');
    const toc = document.querySelector('.cs-toc');
    const board = p.board && window.BOARDS && window.BOARDS[p.board];
    if (board) {
      // this case is the Figma case board rebuilt as a page (assets/js/board-*.js)
      main.innerHTML = board.render(p, next);
      if (toc) toc.innerHTML = board.toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
      return;
    }
    main.innerHTML = hero() + impact() + problem() + research() + process() + solution() + results() + learnings();
    if (toc) toc.innerHTML = [['overview', 'Overview'], ['impact', 'Impact'], ['problem', 'Problem'], ['research', 'Research'], ['process', 'Process'], ['solution', 'Solution'], ['results', 'Results'], ['learnings', 'Learnings']].map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
  };

  /* ---------------- case-specific motion ---------------- */
  window.pageAnimations = function ({ gsap, ScrollTrigger, $, $$ }) {
    // reading progress
    gsap.to('.cs-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // re-measure scroll positions when late images change the page height
    let refreshT;
    $$('#case img').forEach((img) => { if (!img.complete) img.addEventListener('load', () => { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 150); }, { once: true }); });

    // section menu tucks away while reading down, comes back when scrolling up
    const tocBar = $('.cs-toc');
    if (tocBar) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => tocBar.classList.toggle('is-tucked', s.direction === 1 && s.scroll() > innerHeight * 0.6 && s.progress < 0.98) });

    // table of contents
    $$('.cs-toc a').forEach((a) => {
      const sec = $(a.getAttribute('href'));
      if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => {
        a.classList.toggle('is-active', s.isActive);
        // keep the active chip visible when the menu is narrower than its items
        const bar = a.parentElement;
        if (s.isActive && bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
      } });
    });

    // cover zoom
    gsap.fromTo('.cs-cover__inner [data-ill]', { scale: 1 }, { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.cs-cover', start: 'top 60%', end: 'bottom top', scrub: true } });

    // generic stagger groups
    $$('[data-stagger]').forEach((g) => gsap.from(g.children, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: g, start: 'top 85%' } }));

    // funnel bars grow + toggle before/after
    const funnel = $('[data-funnel]');
    if (funnel) {
      gsap.from($$('.b-before', funnel), { scaleX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: funnel, start: 'top 80%' } });
      const btn = $('[data-funnel-toggle]', funnel);
      if (btn) btn.addEventListener('click', () => {
        const on = funnel.classList.toggle('show-after');
        btn.textContent = T(on ? '← Show before' : 'Show after →');
        $$('.funnel__row b', funnel).forEach((b) => {
          const to = +(on ? b.dataset.valAfter : b.dataset.valBefore), o = { v: +b.textContent };
          gsap.to(o, { v: to, duration: 0.8, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.v); } });
        });
        gsap.fromTo($$('.b-after', funnel), { scaleX: on ? 0 : 1 }, { scaleX: on ? 1 : 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 });
      });
    }

    // insight sticky notes fly in
    gsap.from('.insight', { y: 140, rotation: (i) => [-14, 10, -8][i], opacity: 0, duration: 1.2, ease: 'back.out(1.4)', stagger: 0.12, scrollTrigger: { trigger: '.insights', start: 'top 85%' } });

    // process timeline draws as you scroll
    const tl = $('[data-timeline]');
    if (tl) {
      gsap.fromTo(tl, { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 80%', end: 'bottom 50%', scrub: true } });
      gsap.from($$('.phase', tl), { y: 50, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: tl, start: 'top 80%' } });
      gsap.from($$('.phase__dot', tl), { scale: 0, duration: 0.9, ease: 'elastic.out(1,.5)', stagger: 0.12, scrollTrigger: { trigger: tl, start: 'top 80%' } });
    }

    // screens float in, then drift at different speeds
    $$('[data-screen]').forEach((s, i) => {
      gsap.from(s.firstElementChild, { y: 160, rotation: i % 2 ? 6 : -6, opacity: 0, duration: 1.4, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: s, start: 'top 90%' } });
      gsap.to(s, { y: (i % 2 ? -1 : 1) * 40, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from($$('[data-annot]', s), { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1,.5)', stagger: 0.15, delay: 0.6, scrollTrigger: { trigger: s, start: 'top 70%' } });
    });

    // results rows slide in
    gsap.from('.results tbody tr', { x: -60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.results', start: 'top 80%' } });
  };
})();
