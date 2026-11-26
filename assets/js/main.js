/* =========================================================
   Interactions & motion
   - Loader (counter) + page-transition wipe
   - Lenis smooth scroll synced with GSAP ScrollTrigger
   - Custom cursor with labels, magnetic buttons, scramble text
   - Cartoon pupils that follow the mouse
   - Click anywhere to slap a sticker (drag / click to peel)
   - Split-text reveals, scroll word-fill, counters, parallax, clip reveals
   - Stacking work cards, velocity marquee, rotating badge,
     WORD|tile|WORD rows, draggable toolbox pile, career route line, fix-the-mess toy
   ========================================================= */
(function () {
  const { gsap, ScrollTrigger, ILL, PROJECTS } = window;
  const doc = document.documentElement;
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (!gsap) { body.classList.remove('is-loading'); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- content injection ---------------- */
  function renderWorkCards() {
    const stack = $('[data-work-stack]');
    if (!stack || !PROJECTS) return;
    const stickers = ['burst', 'ship', 'star', 'a11y'];
    stack.innerHTML = PROJECTS.map((p, i) => `
      <a class="wcard c-${p.color}" href="${window.caseUrl(p.slug)}" data-cursor="View" data-transition>
        <div class="wcard__frame">
          <div class="wcard__inner">
            <div class="wcard__art" data-ill="${p.ill}"${p.ill === 'researcher' && p.researchTag ? ` data-ill-arg="${p.researchTag}"` : ''}></div>
            <div class="wcard__info">
              <div class="wcard__top"><span class="wcard__no">${p.no}</span><span class="label">${p.category} · ${p.year}</span></div>
              <div>
                <h3 class="display wcard__title">${p.title[0]}<span class="serif">${p.title[1]}</span></h3>
                <p class="wcard__short">${p.short}</p>
              </div>
              <div class="wcard__metrics">
                ${p.impact.slice(0, 2).map((m) => `<div class="wcard__metric"><b>${m.prefix || ''}${m.value}${m.suffix}</b><span>${m.label}</span></div>`).join('')}
              </div>
              ${(() => { const t = p.tools.filter((x) => !/^fig(ma|jam)$/i.test(x)).slice(0, 4); return t.length ? `<div class="wcard__tags">${t.map((x) => `<span class="tag">${x}</span>`).join('')}</div>` : ''; })()}
            </div>
            <div class="wcard__sticker" data-sticker="${p.cardSticker || stickers[i % stickers.length]}"></div>
          </div>
        </div>
      </a>`).join('');
  }

  function renderRoute() {
    const stopsEl = $('[data-route-stops]'), panesEl = $('[data-route-panes]');
    if (!stopsEl || !PROJECTS) return;
    const list = PROJECTS.map((p, i) => ({ p, i })).sort((a, b) => a.p.year - b.p.year || b.i - a.i).map((x) => x.p);
    const n = list.length;
    stopsEl.innerHTML = list.map((p, k) => `<button class="route__stop" type="button" style="left:${(k / (n - 1)) * 100}%" aria-label="${p.year} · ${p.title.join(' ')}"><i></i><span>${p.year}</span><em>${p.title[0]}</em></button>`).join('');
    panesEl.innerHTML = list.map((p) => {
      const m = p.impact[0];
      return `<div class="route__pane">
        <div class="route__art" data-ill="${p.ill}"></div>
        <div class="route__info">
          <p class="route__meta">${p.year} · ${p.client}</p>
          <h3 class="display route__name">${p.title[0]} <span class="serif">${p.title[1]}</span></h3>
          <p class="route__short">${p.short}</p>
        </div>
        <div class="route__side">
          ${m ? `<div class="route__metric"><b>${m.prefix || ''}${m.value}${m.suffix}</b><span>${m.label}</span></div>` : ''}
          <a class="route__more" href="${window.caseUrl(p.slug)}" data-transition data-cursor="View">Read the case →</a>
        </div>
      </div>`;
    }).join('');
  }

  function initFix() {
    const tr = (s) => (window.t ? window.t(s) : s);
    $$('[data-fix]').forEach((stage) => {
      const sec = stage.closest('section');
      const btn = $('.fix__btn', sec);
      const swap = (on) => $$('[data-on]', sec).forEach((el) => {
        if (!el.dataset.off) el.dataset.off = el.textContent;
        el.textContent = on ? tr(el.dataset.on) : el.dataset.off;
      });
      $$('[data-fix-toggle]', sec).forEach((b) => b.addEventListener('click', () => {
        const on = !stage.classList.contains('is-fixed');
        stage.classList.toggle('is-fixed', on);
        swap(on);
        if (btn) btn.textContent = tr(on ? 'Make a mess again' : 'Fix this mess');
      }));
      if (!finePointer || reduce) return;
      const chips = $$('.fix__chip', stage);
      stage.addEventListener('mousemove', (e) => {
        if (stage.classList.contains('is-fixed')) return;
        const r = stage.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5, my = (e.clientY - r.top) / r.height - 0.5;
        chips.forEach((c) => { const d = +c.dataset.depth || 10; c.style.translate = `${(mx * d).toFixed(1)}px ${(my * d).toFixed(1)}px`; });
      });
      stage.addEventListener('mouseleave', () => chips.forEach((c) => { c.style.translate = ''; }));
    });
  }

  function injectIllustrations(root = document) {
    if (!ILL) return;
    $$('[data-ill]', root).forEach((el) => {
      const f = ILL[el.dataset.ill];
      if (f && !el.querySelector('svg')) el.insertAdjacentHTML('beforeend', el.dataset.illArg !== undefined ? f(el.dataset.illArg) : f());
    });
    $$('[data-sticker]', root).forEach((el) => {
      const f = ILL.stickers[el.dataset.sticker];
      if (f && !el.querySelector('svg')) el.insertAdjacentHTML('beforeend', f());
    });
  }

  /* ---------------- split text ---------------- */
  function splitNode(node, mode, cls) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = cls || 'split-word';
          if (mode === 'chars') {
            word.setAttribute('aria-hidden', 'true');
            Array.from(part).forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'split-char';
              c.textContent = ch;
              word.appendChild(c);
            });
          } else if (mode === 'words') {
            const inner = document.createElement('span');
            inner.className = 'split-char';
            inner.textContent = part;
            word.appendChild(inner);
          } else {
            word.textContent = part;
          }
          frag.appendChild(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        splitNode(child, mode, cls);
      }
    });
  }

  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const mode = el.dataset.split;
    if (mode === 'chars') el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    if (mode === 'lines') {
      el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="split-line"><span class="split-char" style="display:block">${l.trim()}</span></span>`).join('');
      return;
    }
    splitNode(el, mode);
    $$('.split-word', el).forEach((w) => { w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.padding = '0 .04em .06em'; w.style.margin = '0 -.04em -.06em'; });
  }

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis = null;
  function initLenis() {
    if (reduce || !window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  }

  /* ---------------- keep the reading position when switching language ---------------- */
  // Saves which section sits on the reading line and how far into it, so RU <-> EN opens at the same place
  // (texts differ in length, so a section + progress is more accurate than raw pixels).
  const POS_KEY = 'langPos';
  let posData = null;
  const anchorOf = (el) => (el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el);
  function savePos(href) {
    const line = innerHeight * 0.3;
    let best = -1;
    const secs = $$('section');
    secs.forEach((el, i) => { const r = anchorOf(el).getBoundingClientRect(); if (r.top <= line && r.bottom > line) best = i; });
    const max = document.documentElement.scrollHeight - innerHeight;
    const d = { to: new URL(href, location.href).pathname, ratio: max > 0 ? scrollY / max : 0, t: Date.now() };
    if (best > -1) { const r = anchorOf(secs[best]).getBoundingClientRect(); d.i = best; d.n = secs.length; d.p = (line - r.top) / Math.max(1, r.height); }
    store.set(POS_KEY, JSON.stringify(d));
  }
  function applyPos() {
    const d = posData;
    if (!d) return;
    const secs = $$('section');
    const el = d.i != null && secs.length === d.n ? secs[d.i] : null; // same page structure in both languages
    let y;
    if (el) { const r = anchorOf(el).getBoundingClientRect(); y = r.top + scrollY + d.p * r.height - innerHeight * 0.3; }
    else y = d.ratio * (document.documentElement.scrollHeight - innerHeight);
    y = Math.max(0, Math.round(y));
    window.scrollTo(0, y);
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    ScrollTrigger.update();
  }
  function restorePos() {
    let d = null;
    try { d = JSON.parse(store.get(POS_KEY) || 'null'); } catch (e) { d = null; }
    store.set(POS_KEY, '');
    if (!d || Date.now() - d.t > 20000 || d.to !== location.pathname) return false;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    posData = d;
    applyPos();
    return true;
  }

  /* ---------------- page transitions ---------------- */
  const wipe = $('.wipe');
  if (wipe) gsap.set(wipe, { yPercent: store.get('visited') ? 0 : 100 });
  function bindTransitions() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const href = a.getAttribute('href');
      if (href.startsWith('mailto:') || href === '#') { if (href === '#') e.preventDefault(); return; }
      if (href.startsWith('#')) {
        const t = href === '#top' ? 0 : $(href);
        if (t !== null) { e.preventDefault(); scrollToTarget(t); }
        return;
      }
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (a.hasAttribute('data-lang-switch')) savePos(a.href);
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      e.preventDefault();
      if (reduce || !wipe) { location.href = url.href; return; }
      gsap.timeline({ onComplete: () => { location.href = url.href; } })
        .set(wipe, { yPercent: 100, display: 'block' })
        .to(wipe, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' });
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted && wipe) gsap.set(wipe, { yPercent: 100 }); });
  }

  /* ---------------- loader & intro ---------------- */
  function runLoader(onDone) {
    const loader = $('.loader');
    const visited = store.get('visited');
    store.set('visited', '1');
    const finish = () => { body.classList.remove('is-loading'); if (lenis) lenis.start(); onDone(); };

    if (reduce) { if (loader) loader.remove(); finish(); return; }

    if (visited && wipe) {
      // returning visitor / internal navigation: blue wipe reveals the page
      if (loader) loader.remove();
      gsap.set(wipe, { yPercent: 0 });
      gsap.to(wipe, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', delay: 0.1, onStart: () => setTimeout(finish, 350) });
      return;
    }
    if (!loader) { finish(); return; }

    const count = $('.loader__count', loader);
    const bar = $('.loader__bar i', loader);
    const logo = $('.loader__logo span', loader);
    const ill = $('.loader__ill', loader);
    const state = { p: 0 };
    let loaded = document.readyState === 'complete';
    window.addEventListener('load', () => { loaded = true; });

    gsap.from(logo, { yPercent: 120, duration: 0.9, ease: 'expo.out' });
    gsap.to(ill, { opacity: 1, y: -10, rotation: -8, duration: 0.6, delay: 0.3, ease: 'back.out(3)' });
    const tick = gsap.to(state, {
      p: 100, duration: 1.8, ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(state.p);
        count.textContent = v + '%';
        bar.style.width = v + '%';
        if (v > 85 && !loaded) tick.pause();
      },
      onComplete: out,
    });
    const resume = setInterval(() => { if (loaded && tick.paused()) tick.resume(); }, 100);
    function out() {
      clearInterval(resume);
      gsap.timeline({ onComplete: () => loader.remove() })
        .to(logo, { yPercent: -120, duration: 0.5, ease: 'expo.in' })
        .to(ill, { scale: 0, rotation: 40, duration: 0.4, ease: 'back.in(2)' }, '<')
        .set(wipe, { yPercent: 100 })
        .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' })
        .to(wipe, { yPercent: 0, duration: 0.6, ease: 'expo.in' }, '<')
        .add(finish, '-=0.25')
        .to(wipe, { yPercent: -100, duration: 0.8, ease: 'expo.out' });
    }
  }

  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.nav > *', { y: -80, opacity: 0, duration: 1, stagger: 0.08 }, 0);
    const heroScope = $('.hero') || $('.cs-hero');
    if (!heroScope) return;
    const lines = $$('[data-split="lines"] .split-char', heroScope);
    const chars = $$('[data-split="chars"] .split-char', heroScope);
    const words = $$('[data-split="words"] .split-char', heroScope);
    if (lines.length) tl.from(lines, { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.05);
    if (chars.length) tl.from(chars, { yPercent: 115, rotation: 8, duration: 1.1, stagger: 0.025 }, 0.12);
    if (words.length) tl.from(words, { yPercent: 115, duration: 1.1, stagger: 0.05 }, 0.12);
    const ill = $('.hero__ill, .cs-cover', heroScope);
    if (ill) tl.from(ill, { scale: 0.6, rotation: -10, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.55)' }, 0.25);
    if ($('.hero__ground', heroScope)) {
      tl.from('.hero__ground', { scaleX: 0, duration: 1.2 }, 0.4)
        .from('.hero__ground-dash i', { scaleX: 0, transformOrigin: 'left', stagger: 0.05, duration: 0.8 }, 0.6);
    }
    tl.from($$('.hero__ctas > *, .hint, .cs-lead, .meta > div, .crumbs', heroScope), { y: 30, opacity: 0, duration: 1, stagger: 0.06 }, 0.5);
  }

  /* ---------------- cursor ---------------- */
  function initCursor() {
    const cur = $('.cursor');
    if (!cur || !finePointer) { if (cur) cur.remove(); return; }
    const label = $('.cursor__label', cur);
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.18, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.18, ease: 'power3' });
    const ring = $('.cursor__ring', cur);
    window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); cur.classList.remove('is-hidden'); }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'));
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, .tool, .sticker');
      const lab = t && t.closest('[data-cursor]');
      cur.classList.toggle('is-hover', !!t);
      cur.classList.toggle('has-label', !!lab);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    document.addEventListener('mousedown', () => gsap.to(ring, { scale: 0.8, duration: 0.15 }));
    document.addEventListener('mouseup', () => gsap.to(ring, { scale: 1, duration: 0.4, ease: 'elastic.out(1,.4)' }));
  }

  /* ---------------- eyes follow the mouse ---------------- */
  function initPupils() {
    if (!finePointer || reduce) return;
    let mx = innerWidth / 2, my = innerHeight / 2, queued = false;
    const update = () => {
      queued = false;
      $$('.pupil').forEach((p) => {
        const r = p.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = mx - cx, dy = my - cy;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 400) * 5;
        p.setAttribute('transform', `translate(${(dx / d * k).toFixed(2)} ${(dy / d * k).toFixed(2)})`);
      });
    };
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  }

  /* ---------------- magnetic & tilt ---------------- */
  function initMagnetic() {
    if (!finePointer || reduce) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .35)' }));
    });
    $$('[data-tilt]').forEach((el) => {
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotationY: px * 16, rotationX: -py * 16, duration: 0.6, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { rotationY: 0, rotationX: 0, duration: 1, ease: 'elastic.out(1,.4)' }));
    });
  }

  /* ---------------- scramble text on hover ---------------- */
  function initScramble() {
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/';
    $$('[data-scramble]').forEach((el) => {
      const original = el.textContent;
      let raf = null;
      el.addEventListener('mouseenter', () => {
        if (reduce) return;
        cancelAnimationFrame(raf);
        const start = performance.now(), dur = 420;
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const reveal = Math.floor(p * original.length);
          el.textContent = original.split('').map((c, i) => (i < reveal || c === ' ' ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
          if (p < 1) raf = requestAnimationFrame(step); else el.textContent = original;
        };
        raf = requestAnimationFrame(step);
      });
    });
  }

  /* ---------------- draggable helper (stickers, toolbox) ---------------- */
  function draggable(el, { bounds, onTap } = {}) {
    let sx, sy, ox, oy, moved = false, vx = 0, vy = 0, lx, ly, lt;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = gsap.getProperty(el, 'x'); oy = gsap.getProperty(el, 'y');
      lx = sx; ly = sy; lt = performance.now(); moved = false;
      gsap.killTweensOf(el);
      gsap.to(el, { scale: 1.08, duration: 0.2 });
      el.style.zIndex = String(++draggable.z);
    });
    el.addEventListener('pointermove', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      const now = performance.now(), dt = Math.max(1, now - lt);
      vx = (e.clientX - lx) / dt; vy = (e.clientY - ly) / dt; lx = e.clientX; ly = e.clientY; lt = now;
      gsap.set(el, { x: ox + dx, y: oy + dy, rotation: gsap.utils.clamp(-25, 25, vx * 8) });
    });
    el.addEventListener('pointerup', (e) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      el.releasePointerCapture(e.pointerId);
      if (!moved) { gsap.to(el, { scale: 1, duration: 0.3 }); if (onTap) onTap(e); return; }
      let tx = gsap.getProperty(el, 'x') + vx * 180, ty = gsap.getProperty(el, 'y') + vy * 180;
      if (bounds) {
        const b = bounds.getBoundingClientRect();
        const base = { x: el.offsetLeft, y: el.offsetTop };
        tx = gsap.utils.clamp(-base.x, b.width - el.offsetWidth - base.x, tx);
        ty = gsap.utils.clamp(-base.y, b.height - el.offsetHeight - base.y, ty);
      }
      gsap.to(el, { x: tx, y: ty, scale: 1, rotation: rand(-12, 12), duration: 0.9, ease: 'power3.out' });
    });
  }
  draggable.z = 10;

  /* ---------------- click to slap a sticker ---------------- */
  function initStickers() {
    if (!ILL) return;
    const layer = document.createElement('div');
    layer.className = 'sticker-layer';
    body.appendChild(layer);
    const hud = $('[data-hud]'), hudCount = $('[data-hud-count]');
    const names = Object.keys(ILL.stickers);
    const list = [];
    const sync = () => { if (hud) { hudCount.textContent = list.length; hud.classList.toggle('is-on', list.length > 0); } };
    const peel = (el) => {
      const i = list.indexOf(el); if (i > -1) list.splice(i, 1);
      gsap.to(el, { scale: 0, rotation: '+=60', opacity: 0, duration: 0.35, ease: 'back.in(2)', onComplete: () => el.remove() });
      sync();
    };
    document.addEventListener('click', (e) => {
      if (e.button !== 0 || e.defaultPrevented) return;
      if (e.target.closest('a, button, input, textarea, select, label, .tool, .sticker, [data-pile], .nav, .badge, .sticker-hud, .phone, .desk, .bd-stage, .bd-lb, .fix__stage, .route__board')) return;
      if (String(window.getSelection && window.getSelection()).length) return;
      const el = document.createElement('div');
      el.className = 'sticker';
      const size = rand(84, 140);
      el.style.width = size + 'px';
      el.style.left = (e.pageX - size / 2) + 'px';
      el.style.top = (e.pageY - size / 2) + 'px';
      el.innerHTML = ILL.stickers[pick(names)]();
      if (window.translateDOM) window.translateDOM(el);
      layer.appendChild(el);
      list.push(el);
      if (list.length > 40) peel(list[0]);
      const r = rand(-22, 22);
      gsap.fromTo(el, { scale: 0, rotation: r - 50 }, { scale: 1, rotation: r, duration: reduce ? 0.01 : 0.9, ease: 'elastic.out(1, .45)' });
      draggable(el, { onTap: () => peel(el) });
      el.dataset.cursor = 'Peel';
      sync();
    });
    const clear = $('[data-hud-clear]');
    if (clear) clear.addEventListener('click', () => [...list].forEach(peel));
  }

  /* ---------------- scroll-driven animations ---------------- */
  function initScroll() {
    const mm = gsap.matchMedia();

    if (reduce) {
      initNavTheme();
      $$('[data-count]').forEach((el) => { el.textContent = fmtCount(el, +el.dataset.count); });
      $$('[data-inview]').forEach((el) => el.classList.add('in-view'));
      return;
    }

    // split-text reveals outside the hero
    $$('[data-split]').forEach((el) => {
      if (el.closest('.hero, .cs-hero') || el.closest('[data-word-fill]')) return;
      const targets = $$('.split-char', el);
      if (!targets.length) return;
      const isChars = el.dataset.split === 'chars';
      gsap.from(targets, {
        yPercent: 115, rotation: isChars ? 6 : 0, duration: 1.1, ease: 'expo.out', stagger: isChars ? 0.022 : 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // simple reveals
    $$('[data-reveal]').forEach((el) => gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

    // pop-in stickers
    $$('[data-pop]').forEach((el) => gsap.from(el, { scale: 0, rotation: '-=40', duration: 1.1, ease: 'elastic.out(1,.45)', scrollTrigger: { trigger: el, start: 'top 90%' } }));

    // counters
    $$('[data-count]').forEach((el) => {
      const target = +el.dataset.count, o = { v: 0 };
      el.textContent = fmtCount(el, 0);
      gsap.to(o, { v: target, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = fmtCount(el, o.v); } });
    });

    // in-view CSS hooks
    $$('[data-inview]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => el.classList.add('in-view') }));

    // clip-path picture reveals
    $$('[data-clip]').forEach((el) => gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } }));
    $$('[data-zoom]').forEach((el) => gsap.fromTo(el, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // parallax
    $$('[data-parallax]').forEach((el) => gsap.to(el, { yPercent: +el.dataset.parallax * -100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // hero leaves: words part, illustration lifts
    if ($('.hero')) {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-left]', { xPercent: -40, ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-right]', { xPercent: 40, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__ill', { yPercent: -18, scale: 0.9, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__ill .mac-img, .hero__ill .ill', { y: -12, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.to('.mac-cursor', { x: -26, y: -40, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    // statement: growing line + word fill
    $$('[data-grow-line]').forEach((el) => gsap.from(el, { scaleY: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 40%', scrub: true } }));
    $$('[data-word-fill]').forEach((el) => {
      splitNode(el, 'plain', 'w');
      gsap.to($$('.w', el), { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });

    // velocity marquee
    $$('[data-marquee]').forEach((track) => {
      track.innerHTML += track.innerHTML;
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      let dir = 1;
      ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction;
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
          gsap.to(loop, { timeScale: dir * (1 + Math.abs(v)), duration: 0.2, overwrite: true });
          gsap.to(track, { skewX: -v * 1.2, duration: 0.3, overwrite: 'auto' });
        },
      });
      setInterval(() => { gsap.to(loop, { timeScale: dir, duration: 1 }); gsap.to(track, { skewX: 0, duration: 0.6 }); }, 400);
    });

    // badge: appear after hero, rotate with scroll
    const badge = $('[data-badge]');
    if (badge) {
      ScrollTrigger.create({ start: () => innerHeight * 0.8, end: 'max', onToggle: (s) => badge.classList.toggle('is-on', s.isActive) });
      gsap.to($('.ring', badge), { rotation: 1080, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });
    }

    // work stack (desktop): previous cards shrink & tilt as the next one arrives
    mm.add('(min-width: 821px)', () => {
      const cards = $$('.wcard');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // explicit start values: tweening filter from 'none' starts at brightness(0) and blacks out the active card.
        // Dimming starts only once the next card begins to overlap this one.
        gsap.fromTo(card, { scale: 1, rotation: 0, filter: 'brightness(1)' }, { scale: 0.88, rotation: i % 2 ? 2 : -2, filter: 'brightness(0.6)', ease: 'none', immediateRender: false, scrollTrigger: { trigger: cards[i + 1], start: () => 'top ' + Math.min(innerHeight, innerHeight * 0.13 + card.offsetHeight) + 'px', end: 'top 13%', scrub: true, invalidateOnRefresh: true } });
      });
      cards.forEach((card) => gsap.from($('.wcard__art .ill', card), { yPercent: 30, rotation: -8, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 20%', scrub: true } }));
    });

    // services fan in
    const sv = $('[data-services]');
    if (sv) gsap.from(sv.children, { y: 220, rotation: (i) => [-14, 0, 14][i] || 0, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: { trigger: sv, start: 'top 85%' } });

    // process rows: WORD | tile | WORD
    $$('[data-prow]').forEach((row) => {
      const st = { trigger: row, start: 'top 95%', end: 'top 35%', scrub: 0.6 };
      mm.add('(min-width: 821px)', () => {
        gsap.from($('[data-from="left"]', row), { xPercent: -60, opacity: 0, ease: 'none', scrollTrigger: st });
        gsap.from($('[data-from="right"]', row), { xPercent: 60, opacity: 0, ease: 'none', scrollTrigger: st });
      });
      gsap.from($('.prow__tile', row), { scale: 0.6, rotation: -10, borderRadius: '50%', ease: 'none', scrollTrigger: st });
      const notes = $$('.sticky-note, .mini .row', row);
      if (notes.length) gsap.from(notes, { y: 30, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: row, start: 'top 60%' } });
    });

    // toolbox pile: drop in, then draggable
    $$('[data-pile]').forEach((pile) => {
      const tools = $$('.tool', pile);
      const layout = () => {
        const w = pile.clientWidth, h = pile.clientHeight;
        tools.forEach((t, i) => {
          const cols = w < 600 ? 2 : 4;
          const cx = ((i % cols) + 0.5) / cols, cy = (Math.floor(i / cols) + 0.5) / Math.ceil(tools.length / cols);
          t.style.left = Math.max(8, Math.min(w - t.offsetWidth - 8, cx * w - t.offsetWidth / 2 + rand(-30, 30))) + 'px';
          t.style.top = Math.max(8, Math.min(h - t.offsetHeight - 8, cy * h - t.offsetHeight / 2 + rand(-16, 16))) + 'px';
        });
      };
      layout();
      tools.forEach((t) => { gsap.set(t, { rotation: rand(-14, 14) }); draggable(t, { bounds: pile }); });
      gsap.from(tools, { y: () => -pile.clientHeight - 100, rotation: () => rand(-90, 90), duration: 1.2, ease: 'bounce.out', stagger: { each: 0.06, from: 'random' }, scrollTrigger: { trigger: pile, start: 'top 75%' } });
      let rw = innerWidth;
      window.addEventListener('resize', () => { if (Math.abs(innerWidth - rw) > 60) { rw = innerWidth; tools.forEach((t) => gsap.set(t, { x: 0, y: 0 })); layout(); } });
    });

    // career route: pinned on desktop, the dot travels with the scroll and opens each stop
    $$('[data-route]').forEach((sec) => {
      const stops = $$('.route__stop', sec), panes = $$('.route__pane', sec), n = stops.length;
      if (!n) return;
      const dot = $('.route__dot', sec), fill = $('.route__fill', sec);
      let cur = -1;
      const show = (i) => {
        if (i === cur) return; cur = i;
        stops.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.classList.toggle('is-past', k < i); });
        panes.forEach((p, k) => p.classList.toggle('is-active', k === i));
      };
      const setP = (p) => {
        if (dot) dot.style.left = p * 100 + '%';
        if (fill) fill.style.transform = `scaleX(${p})`;
        show(Math.min(n - 1, Math.round(p * (n - 1))));
      };
      setP(0);
      let st = null;
      mm.add('(min-width: 821px)', () => {
        st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: () => '+=' + n * innerHeight * 0.45, pin: true, scrub: true, onUpdate: (self) => setP(self.progress) });
        return () => { st = null; setP(0); };
      });
      stops.forEach((s, k) => s.addEventListener('click', () => {
        if (st) scrollToTarget(st.start + (st.end - st.start) * (k / (n - 1)) + 2);
        else setP(k / (n - 1));
      }));
    });

    initNavTheme();

    // contact: giant letters bounce on hover
    $$('.contact__big .split-char').forEach((c) => c.addEventListener('mouseenter', () => gsap.fromTo(c, { y: 0 }, { y: -30, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })));
    // hero letters too
    $$('.hero__word .split-char').forEach((c) => c.addEventListener('mouseenter', () => gsap.fromTo(c, { y: 0, rotation: 0 }, { y: -24, rotation: rand(-10, 10), duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' })));
  }

  function initNavTheme() {
    // nav colour per section theme (created last so pinned sections are measured first)
    const nav = $('.nav'), toc = $('.cs-toc');
    $$('[data-theme]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 50px', end: 'bottom 50px',
        onToggle: (self) => {
          if (!self.isActive) return;
          const t = sec.dataset.theme;
          nav.classList.toggle('on-dark', t === 'dark');
          nav.classList.toggle('on-blue', t === 'blue');
        },
      });
      if (toc) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => { if (s.isActive) toc.classList.toggle('on-dark', sec.dataset.theme === 'dark' || sec.dataset.theme === 'blue'); } });
    });

  }

  function fmtCount(el, v) {
    const dec = +(el.dataset.decimals || 0);
    const n = v.toFixed(dec);
    return (el.dataset.prefix || '') + (el.dataset.group ? n.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : n) + (el.dataset.suffix || '');
  }

  /* ---------------- boot ---------------- */
  renderWorkCards();
  renderRoute();
  // masked email: the page shows a label, the address is stored reversed and only put together here, for the Gmail compose window
  $$('[data-mail]').forEach((a) => { a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + a.dataset.mail.split('').reverse().join(''); });
  if (typeof window.renderPage === 'function') window.renderPage();
  injectIllustrations();
  if (window.translateDOM) window.translateDOM(document.body); // Russian pages: EN → RU before splitting text
  $$('[data-split]').forEach(split);
  initLenis();
  bindTransitions();
  initCursor();
  initPupils();
  initMagnetic();
  initScramble();
  initStickers();
  initFix();

  // hide hero text before the loader finishes so the intro can reveal it
  const heroScope = $('.hero') || $('.cs-hero');
  if (heroScope && !reduce) gsap.set($$('.split-char', heroScope), { yPercent: 115 });

  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
    initScroll();
    if (typeof window.pageAnimations === 'function' && !reduce) window.pageAnimations({ gsap, ScrollTrigger, $, $$ });
    ScrollTrigger.refresh();
    const restored = restorePos(); // language switch: jump to the same place before the page is revealed
    runLoader(() => {
      if (heroScope && !reduce) gsap.set($$('.split-char', heroScope), { yPercent: 0 });
      if (!reduce) intro();
      ScrollTrigger.refresh();
      if (restored) applyPos(); // re-apply after the final layout refresh
      else if (location.hash && $(location.hash)) setTimeout(() => scrollToTarget($(location.hash)), 300);
      setTimeout(() => { posData = null; }, 1500);
    });
  });
  window.addEventListener('load', () => { ScrollTrigger.refresh(); if (posData) applyPos(); });

  window.APP = { scrollTo: scrollToTarget, injectIllustrations };
})();
