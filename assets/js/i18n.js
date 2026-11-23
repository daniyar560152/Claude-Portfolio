/*
 * Tiny i18n layer. The page language comes from <html lang>; English is the source text.
 * On Russian pages (index-ru.html, case-ru.html, case-*-ru.html) assets/js/ru.js provides
 * an EN → RU dictionary (window.RU_DICT) plus a few pattern rules (window.RU_RULES).
 *
 *   t('Next project')       → 'Следующий проект' (or the input, if there is no translation)
 *   deepT(obj, skipKeys)    → copy of obj with every translatable string translated
 *   translateDOM(el)        → translates text nodes and alt / aria-label / title / data-cursor
 *                             attributes in place; main.js runs it once the page is rendered,
 *                             before the text-split animations
 */
(function (root) {
  const doc = typeof document !== 'undefined' ? document : null;
  root.LANG = doc && /^ru/i.test(doc.documentElement.lang) ? 'ru' : 'en';
  const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

  root.t = function (s) {
    if (root.LANG !== 'ru' || s == null || s === '') return s;
    const k = norm(s), D = root.RU_DICT || {};
    const lead = String(s).match(/^\s*/)[0], trail = String(s).match(/\s*$/)[0];
    if (Object.prototype.hasOwnProperty.call(D, k)) return lead + D[k] + trail;
    for (const [re, to] of root.RU_RULES || []) {
      const m = k.match(re);
      if (m) return typeof to === 'function' ? to(m, root.t) : k.replace(re, to);
    }
    return s;
  };

  // "WORD|serif" pairs translate together, because the same English word needs different Russian ones
  root.tPair = function (a, b) {
    const r = root.t(a + '|' + b);
    return r.indexOf('|') > -1 ? r.split('|') : [a, b];
  };

  root.deepT = function (v, skip) {
    if (root.LANG !== 'ru') return v;
    if (typeof v === 'string') return root.t(v);
    if (Array.isArray(v)) return v.map((x) => root.deepT(x, skip));
    if (v && typeof v === 'object') {
      const o = {};
      for (const k of Object.keys(v)) o[k] = skip && skip.indexOf(k) > -1 ? v[k] : root.deepT(v[k], skip);
      return o;
    }
    return v;
  };

  const ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'data-cursor'];
  root.translateDOM = function (el) {
    if (root.LANG !== 'ru' || !el || !doc) return;
    const w = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) nodes.push(n);
    for (const n of nodes) {
      const tag = n.parentElement && n.parentElement.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style') continue;
      const raw = n.nodeValue, k = norm(raw);
      if (!k || !/[A-Za-z]/.test(k)) continue;
      const ctx = n.parentElement && n.parentElement.getAttribute('data-t'); // context key for ambiguous words
      const tr = ctx && root.t(ctx) !== ctx ? root.t(ctx) : root.t(k);
      if (tr !== k) n.nodeValue = raw.match(/^\s*/)[0] + tr + raw.match(/\s*$/)[0];
    }
    el.querySelectorAll('[' + ATTRS.join('],[') + ']').forEach((node) => {
      for (const a of ATTRS) { const v = node.getAttribute(a); if (v && /[A-Za-z]/.test(v)) { const tr = root.t(v); if (tr !== v) node.setAttribute(a, tr); } }
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
