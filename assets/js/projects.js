/*
 * Case-study content. Structured the way senior product designers document work:
 * context → role/team/tools → problem & goals → research (methods + sample sizes) →
 * insights → process (phases, weeks, tools) → key decisions → solution → results (before/after) → learnings.
 * Replace with your own projects — every page is rendered from this file.
 */
(function (root) {
  const PROJECTS = [
    {
      slug: 'housing',
      no: '01',
      client: 'Otbasy Bank',
      category: 'GovTech · Responsive web',
      title: ['HOUSING QUEUE', 'made simple'],
      short: 'Redesigning the state housing-queue service',
      color: 'blue',
      ill: 'macHome',
      board: 'housing', // rendered from the Figma case board (assets/js/board-housing.js)
      coverStickers: ['movein', 'keys'],
      year: '2025',
      summary:
        'A national service where families join the state housing queue, apply for subsidised mortgages and track their place — redesigned from a form-heavy portal into a guided, transparent flow.',
      meta: {
        role: 'Lead Product Designer — research, IA, UI, design system, handoff',
        timeline: '10 weeks · Mar – May 2025',
        team: 'PM, analyst, 2 frontend, 1 backend, eGov integration lead',
        platform: 'Responsive web · eGov SSO · RU / KZ / EN',
        deliverables: 'Research report, journey map, IA, design system, 24 hi-fi screens, prototype, specs',
      },
      tools: ['Figma', 'FigJam', 'Maze', 'Dovetail', 'Amplitude', 'Hotjar', 'Jira'],
      impact: [
        { value: 46, prefix: '−', suffix: '%', label: 'Time to submit', from: '18 → 9.7 min' },
        { value: 31, prefix: '+', suffix: '%', label: 'Completed applications', from: '34% → 45%' },
        { value: 52, prefix: '−', suffix: '%', label: '“What is my status?” calls', from: '6 400 → 3 050 / month' },
        { value: 82, suffix: '', label: 'SUS score', from: 'was 58' },
      ],
      problem:
        'Families who need housing must register in the state queue, but the old portal hid eligibility rules in long PDFs, asked for data the State already had, and showed nothing while 11 databases were queried. Half of all calls to 1432 were “what is my status?”.',
      goals: {
        business: ['Cut call-centre load on status questions', 'Raise completed applications', 'One entry point for all programmes'],
        user: ['Know in a minute if I am eligible', 'Apply without paper or office visits', 'See where I am in the queue'],
      },
      constraints: ['eGov EDS signing is mandatory', '11 gov databases · 30–90 s latency', 'RU / KZ + low-vision mode (WCAG 2.1 AA)', 'Legacy backend statuses'],
      methods: [
        { n: '12', label: 'Interviews · Almaty, Shymkent, Ust-Kamenogorsk', tool: 'Dovetail' },
        { n: '1,840', label: 'Survey responses', tool: 'Maze' },
        { n: '3,200', label: 'Call-centre tickets coded', tool: 'Dovetail' },
        { n: '6', label: 'Gov services benchmarked', tool: 'FigJam' },
      ],
      funnel: {
        label: 'Application funnel, % of people who started',
        steps: ['Started', 'Category chosen', 'Consent signed', 'Data check passed', 'Submitted'],
        before: [100, 71, 52, 38, 34],
        after: [100, 86, 72, 58, 45],
        highlight: 1,
        note: 'Highlighted: choosing a category — the biggest single drop (−29 pts). The rules lived in a 40-page PDF.',
      },
      researchTag: 'n = 12 interviews',
      insights: [
        { stat: '7/12', title: 'People pick categories by guessing', text: '7 of 12 chose the wrong category; the rules lived in a 40-page PDF.' },
        { stat: '5/12', title: 'Silence feels like an error', text: 'During the 90-second database check, 5 of 12 reloaded the page and lost progress.' },
        { stat: '1 job', title: 'Status is the real product', text: 'After applying, users only ever come back for one thing — their place in the queue.' },
      ],
      hmw: ['How might we explain eligibility before people start?', 'How might we make a 90-second wait feel like progress?', 'How might we answer “where am I in the queue?” without a call?'],
      process: [
        { phase: 'Discover', weeks: 'Wk 1–3', what: 'Interviews, survey, ticket coding, analytics', tools: ['Dovetail', 'Amplitude'] },
        { phase: 'Define', weeks: 'Wk 4', what: 'Journey map, IA, success metrics, HMWs', tools: ['FigJam'] },
        { phase: 'Design', weeks: 'Wk 5–8', what: 'Flows, design system, hi-fi screens, copy', tools: ['Figma'] },
        { phase: 'Validate', weeks: 'Wk 9', what: '2 rounds of usability tests, a11y audit', tools: ['Maze', 'Hotjar'] },
        { phase: 'Handoff', weeks: 'Wk 10', what: 'Specs, tokens, QA with devs, pilot', tools: ['Figma Dev Mode', 'Jira'] },
      ],
      decisions: [
        { title: 'One landing for six programmes', text: 'Eligibility and limits sit on each programme card, so people self-qualify before signing in.' },
        { title: 'Categories in plain language', text: 'Each category explains who qualifies; proofs (birth, disability, income) are pulled from State databases automatically.' },
        { title: 'Design the waiting', text: 'A live checklist shows each of the 11 databases answering; leaving is safe — we SMS when it is done.' },
        { title: 'A cabinet built around status', text: 'Queue number, date and region come first; everything else is secondary.' },
        { title: 'Status without signing in', text: 'A public IIN check answers the #1 call-centre question in 10 seconds.' },
      ],
      screens: [],
      results: [
        { metric: 'Time to submit', before: '18 min', after: '9.7 min', delta: '−46%' },
        { metric: 'Completed applications', before: '34%', after: '45%', delta: '+31%' },
        { metric: 'Status calls per month', before: '6 400', after: '3 050', delta: '−52%' },
        { metric: 'Errors on category step', before: '22%', after: '6%', delta: '−16 pp' },
        { metric: 'SUS score', before: '58', after: '82', delta: '+24' },
      ],
      quote: { text: 'For the first time I didn’t have to call anyone to find out where my family is in the queue.', who: 'P7 · mother of four, Shymkent · usability test round 2' },
      learnings: [
        'Design the waiting. Integration latency is a UX problem — showing each source answering cut reloads to zero.',
        'Status is a feature. The cabinet became a status page first; navigation shrank from 11 items to 5.',
        'Accessibility finds everyone’s bugs. Fixing 200% zoom also fixed small laptops and the Kazakh copy, which runs 30% longer.',
      ],
    },
    {
      slug: 'loan',
      no: '02',
      client: 'Otbasy Bank',
      category: 'Banking · Mobile app',
      title: ['LOAN', 'paid off early'],
      short: 'Early loan repayment and encumbrance removal in the app',
      color: 'mint',
      ill: 'coinStack',
      board: 'loan', // rendered from the Figma case board (assets/js/board-loan.js)
      coverStickers: ['paidoff', 'coins'],
      year: '2026',
      summary:
        'Otbasy Bank clients repay their housing loan ahead of schedule — partly or in full — and lift the encumbrance from their home, in two guided flows inside the mobile app. Built on 2 236 real branch service-desk tickets.',
      tools: ['Figma', 'FigJam', 'Excel', 'Maze', 'Amplitude', 'Jira'],
      impact: [
        { value: '2 236', suffix: '', label: 'Branch tickets analysed' },
        { value: 75, suffix: '%', label: 'Needed no code fix — design gaps' },
      ],
      screens: [],
    },
    {
      slug: 'market',
      no: '03',
      client: 'Otbasy Bank',
      category: 'Marketplace · Responsive web',
      title: ['PROPERTY', 'and a mortgage'],
      short: 'Property marketplace with state mortgage programmes',
      color: 'yellow',
      ill: 'homeSign',
      board: 'market', // rendered from the Figma case board (assets/js/board-market.js)
      coverStickers: ['newbuild', 'yurtcard'],
      year: '2025',
      summary:
        'Baspana Market is Otbasy Bank’s property marketplace: new builds, resale and rentals next to the state and bank mortgage programmes that pay for them — catalog, residential-complex page and programme pages for web and mobile.',
      tools: ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Jira'],
      impact: [
        { value: '102 000', suffix: '', label: 'Listings in the catalog' },
        { value: 8, suffix: '', label: 'State & bank programmes' },
      ],
      screens: [],
    },
    {
      slug: 'smartbank',
      no: '04',
      client: 'Eurasian Bank',
      category: 'Mobile banking · Design system',
      title: ['STATEMENTS', 'and a design system'],
      short: 'Statements for Smartbank and the design system under them',
      color: 'pink',
      ill: 'statementMac',
      board: 'smartbank', // rendered as a case board (assets/js/board-smartbank.js)
      coverStickers: ['pdffree', 'viptheme'],
      cardSticker: 'viptheme',
      year: '2023',
      summary:
        'Statements for cards, accounts and deposits in Eurasian Bank’s Smartbank app — 12 months back, a free PDF, readable names and bonuses per purchase — and the design-system atoms underneath: four themes, colour tokens, 617 icons and vector bank cards.',
      tools: ['Figma', 'FigJam', 'Jira'],
      impact: [
        { value: 617, suffix: '', label: 'Icons in the design system' },
        { value: 4, suffix: '', label: 'Themes × 76 tokens' },
      ],
      screens: [],
    },
    {
      slug: 'carloan',
      no: '05',
      client: 'Eurasian Bank',
      category: 'Online lending · Responsive web',
      title: ['USED CAR', 'on credit, online'],
      short: 'c2c car loan for used cars — a decision online in 2 minutes',
      color: 'orange',
      ill: 'carLoan',
      board: 'carloan', // rendered as a case board (assets/js/board-carloan.js)
      coverStickers: ['twomin', 'usedcar'],
      cardSticker: 'twomin',
      year: '2022',
      summary:
        'An online car loan for a used car bought from another person: interviews, a JTBD analysis, a persona and two usability tests, then the flow from the landing to the decision for mobile and desktop. Online car loans grew 2.5× in a quarter.',
      tools: ['Figma', 'FigJam'],
      impact: [
        { value: 79, suffix: '', label: 'NPS AUTO online, from 61' },
        { value: 8, suffix: '%', label: 'Car-loan conversion, from 6%' },
      ],
      screens: [],
    },
    {
      slug: 'wallet',
      no: '06',
      client: 'Concept',
      category: 'Mobile banking · Concept',
      title: ['GROUP WALLETS', 'and money in envelopes'],
      short: 'A 2025 mobile-bank concept: shared wallets and envelope budgeting',
      color: 'lilac',
      ill: 'groupPurse',
      board: 'wallet', // rendered as a case board (assets/js/board-wallet.js)
      coverStickers: ['splitok', 'envelopes4'],
      cardSticker: 'splitok',
      year: '2023',
      summary:
        'A concept of a daily-banking app: group wallets where everyone chips in and sees what they owe, and a money manager that splits each income into envelopes. Ideas, storyboards, a prototype, remote usability tests with 6 people aged 16–22, final UI and a pitch.',
      tools: ['Figma', 'FigJam'],
      impact: [
        { value: 6, suffix: '', label: 'Respondents in usability tests' },
        { value: 4, suffix: '', label: 'Kinds of envelopes' },
      ],
      screens: [],
    },
  ];

  const ru = root.LANG === 'ru';
  // on Russian pages every display string goes through the dictionary (ids, colours and asset keys stay as they are)
  root.PROJECTS = ru && root.deepT ? root.deepT(PROJECTS, ['slug', 'color', 'ill', 'board', 'coverStickers', 'screens', 'no', 'year', 'tools']) : PROJECTS;
  // Links. Static builds (scripts/build-static.js) override these with one file per project and language.
  if (!root.caseUrl) root.caseUrl = (slug) => (ru ? 'case-ru.html?p=' : 'case.html?p=') + slug;
  if (!root.altCaseUrl) root.altCaseUrl = (slug) => (ru ? 'case.html?p=' : 'case-ru.html?p=') + slug;
  if (!root.homeUrl) root.homeUrl = ru ? 'index-ru.html' : 'index.html';
  if (typeof module !== 'undefined' && module.exports) module.exports = PROJECTS;
})(typeof window !== 'undefined' ? window : globalThis);
