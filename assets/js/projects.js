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
      slug: 'medly',
      no: '05',
      client: 'Medly Clinics',
      category: 'Healthcare · Responsive web',
      title: ['BOOKING', 'without the call'],
      short: 'Self-service appointment booking for 40 clinics',
      color: 'orange',
      ill: 'researcher',
      year: '2024',
      summary:
        'Patients had to call to book, and call centres were overwhelmed. I designed a self-service booking flow, accessible to older patients, that took the median booking from 6:40 to 2:10 and cut call volume by 31%.',
      meta: {
        role: 'Product Designer (booking lead)',
        timeline: '10 weeks · 2024',
        team: '1 PM, 3 engineers, 1 content designer, clinic ops',
        platform: 'Responsive web',
        deliverables: 'Service blueprint, IA, prototype, UI, content guidelines',
      },
      tools: ['Figma', 'FigJam', 'Hotjar', 'Optimal Workshop', 'Lookback', 'Google Analytics', 'Jira'],
      impact: [
        { value: 27, prefix: '+', suffix: '%', label: 'Booking conversion', from: '18% → 23%' },
        { value: 2.1, suffix: ' min', label: 'Median time to book', from: 'from 6:40', decimals: 1 },
        { value: 31, prefix: '−', suffix: '%', label: 'Call-centre volume', from: 'across 40 clinics' },
        { value: 84, suffix: '', label: 'SUS score', from: 'from 61' },
      ],
      problem:
        'Booking a GP visit meant a 9-minute phone queue. The web flow existed, but 82% of visitors gave up — most at the “choose a doctor” step.',
      goals: {
        business: ['Shift bookings from phone to web', 'Reduce no-shows', 'Fill same-day cancellations'],
        user: ['Book in under 3 minutes', 'Find the earliest slot, not a specific doctor', 'Feel confident on a phone with large text'],
      },
      constraints: ['Legacy scheduling API with 2s latency', 'Patients aged 65+ are 34% of visits', 'Medical-safety copy reviewed by clinicians'],
      methods: [
        { n: '10', label: 'Patient interviews (4 aged 65+)', tool: 'Lookback' },
        { n: '6', label: 'Reception shadowing sessions', tool: 'FigJam' },
        { n: '12k', label: 'Recorded sessions & heatmaps', tool: 'Hotjar' },
        { n: '120', label: 'Tree-test participants', tool: 'Optimal Workshop' },
        { n: '8', label: 'Moderated usability tests', tool: 'Lookback' },
        { n: '40', label: 'Clinics in service blueprint', tool: 'FigJam' },
      ],
      funnel: {
        label: 'Web booking funnel, % of visitors (before)',
        steps: ['Landing', 'Reason', 'Doctor', 'Time slot', 'Details', 'Booked'],
        before: [100, 71, 38, 27, 21, 18],
        after: [100, 84, 79, 62, 41, 23],
        highlight: 2,
        note: 'Highlighted: “choose a doctor” lost a third of visitors — so time came first.',
      },
      researchTag: 'n = 10 patients',
      insights: [
        { stat: '7/10', title: '“Any doctor, soonest”', text: 'Most patients wanted the earliest slot, but the flow forced them to choose a doctor first.' },
        { stat: '34%', title: 'Older eyes, small taps', text: 'Patients over 65 struggled with 32px time chips and grey-on-grey text.' },
        { stat: '1 in 5', title: 'Forgotten appointments', text: 'No-shows came from bookings made weeks ahead without reminders.' },
      ],
      hmw: ['How might we lead with time, not doctor?', 'How might we design for the oldest patient first?', 'How might we turn cancellations into someone else’s slot?'],
      process: [
        { phase: 'Discover', weeks: 'Wk 1–2', what: 'Shadowing, interviews, Hotjar review', tools: ['Lookback', 'Hotjar'] },
        { phase: 'Map', weeks: 'Wk 3', what: 'Service blueprint, IA, tree test', tools: ['FigJam', 'Optimal Workshop'] },
        { phase: 'Design', weeks: 'Wk 4–6', what: 'Time-first flow, large-text first UI', tools: ['Figma'] },
        { phase: 'Test', weeks: 'Wk 7–8', what: '8 moderated sessions, 2 iterations', tools: ['Figma', 'Lookback'] },
        { phase: 'Launch', weeks: 'Wk 9–10', what: 'Pilot in 5 clinics → all 40', tools: ['Jira', 'Google Analytics'] },
      ],
      decisions: [
        { title: 'Time first, doctor optional', text: '“Earliest available” became the default. Choosing a specific doctor is still one tap away.' },
        { title: 'Designed at 200% text size', text: 'Every screen was designed and tested at 200% zoom first; tap targets are at least 48px.' },
        { title: 'Smart reminders + 1-tap cancel', text: 'SMS reminders at 48h and 2h. Cancelled slots go to a waitlist automatically.' },
        { title: 'Plain-language triage', text: 'Co-written with clinicians: “What do you need help with?” instead of medical codes.' },
      ],
      screens: ['phone-booking', 'desk-booking'],
      results: [
        { metric: 'Booking conversion', before: '18%', after: '23%', delta: '+27%' },
        { metric: 'Median time to book', before: '6:40', after: '2:10', delta: '−68%' },
        { metric: 'Call-centre volume', before: '9.8k/wk', after: '6.8k/wk', delta: '−31%' },
        { metric: 'No-show rate', before: '11.4%', after: '8.9%', delta: '−22%' },
        { metric: 'SUS score', before: '61', after: '84', delta: '+23' },
      ],
      quote: { text: 'Our receptionists finally have time to look up from the phone and talk to patients.', who: 'Operations Director, Medly Clinics' },
      learnings: [
        'Designing for the edge (65+, 200% zoom) made the product better for everyone.',
        'Shadowing receptionists surfaced problems no analytics dashboard could show.',
        'Content design is product design — the triage copy did as much as the UI.',
      ],
    },
    {
      slug: 'shoply',
      no: '06',
      client: 'Shoply',
      category: 'E-commerce · AI assistant',
      title: ['AI THAT', 'actually helps'],
      short: 'A conversational shopping assistant people trust',
      color: 'lilac',
      ill: 'commenter',
      year: '2025',
      summary:
        'Shoply wanted “an AI chatbot”. Research showed people wanted help comparing products, not small talk. I designed an assistant that answers with products, not paragraphs, lifting assisted conversion from 3.1% to 4.4%.',
      meta: {
        role: 'Senior Product Designer',
        timeline: '12 weeks · 2025',
        team: '1 PM, 2 ML engineers, 3 engineers, 1 data scientist',
        platform: 'Web & iOS',
        deliverables: 'Conversation design, UI patterns, prompt guidelines, eval rubric',
      },
      tools: ['Figma', 'FigJam', 'Voiceflow', 'Maze', 'Amplitude', 'Notion', 'Linear'],
      impact: [
        { value: 4.4, suffix: '%', label: 'Assisted conversion', from: 'from 3.1%', decimals: 1 },
        { value: 12, prefix: '+', suffix: '%', label: 'Average order value', from: 'assisted sessions' },
        { value: 4.6, suffix: '/5', label: 'Assistant CSAT', from: '9.8k ratings', decimals: 1 },
        { value: 9, prefix: '−', suffix: '%', label: 'Return rate', from: 'on assisted orders' },
      ],
      problem:
        'Shoppers bounced between 8+ tabs to compare products. The first chatbot prototype answered in long paragraphs — and testers didn’t trust it.',
      goals: {
        business: ['Increase conversion on high-consideration categories', 'Reduce returns from wrong-fit purchases', 'Collect intent data responsibly'],
        user: ['Compare options fast', 'Understand why something is recommended', 'Stay in control — no pushy upsell'],
      },
      constraints: ['LLM latency of 2–6s', 'Product data quality varied by brand', 'EU AI Act transparency requirements'],
      methods: [
        { n: '16', label: 'Diary-study participants', tool: 'dscout' },
        { n: '220', label: 'Support chats analysed', tool: 'Dovetail' },
        { n: '3', label: 'Wizard-of-Oz prototypes', tool: 'Voiceflow' },
        { n: '64', label: 'Unmoderated testers', tool: 'Maze' },
        { n: '500', label: 'Answers in quality eval', tool: 'Notion' },
        { n: '2', label: 'A/B test rounds', tool: 'Amplitude' },
      ],
      funnel: {
        label: 'Trust score by answer format (1–7)',
        steps: ['Paragraph', 'Bullets', 'Cards', 'Cards + why', 'Compare table'],
        before: [2.9, 3.8, 4.9, 6.1, 5.8],
        after: [2.9, 3.8, 4.9, 6.1, 5.8],
        scale: 7,
        highlight: 3,
        note: 'Highlighted: cards + a one-line “why” earned the most trust and became the default answer.',
      },
      researchTag: 'n = 16 diaries',
      insights: [
        { stat: '8+', title: 'Tab overload', text: 'Shoppers opened eight or more tabs to compare two products. The job was comparison, not conversation.' },
        { stat: '6.1', title: 'Show the why', text: 'Answers with product cards and a one-line reason scored highest on trust (6.1 of 7).' },
        { stat: '71%', title: 'Speed is UX', text: '71% abandoned answers that took longer than 4s with no feedback.' },
      ],
      hmw: ['How might we answer with products instead of paragraphs?', 'How might we make AI reasoning visible but light?', 'How might we make waiting feel like progress?'],
      process: [
        { phase: 'Discover', weeks: 'Wk 1–3', what: 'Diary study, chat log analysis', tools: ['dscout', 'Dovetail'] },
        { phase: 'Wizard of Oz', weeks: 'Wk 4–5', what: 'Humans-as-AI prototypes to test formats', tools: ['Voiceflow', 'Figma'] },
        { phase: 'Design', weeks: 'Wk 6–8', what: 'Answer patterns, streaming states, guardrails', tools: ['Figma', 'FigJam'] },
        { phase: 'Evaluate', weeks: 'Wk 9–10', what: '500-answer eval rubric with ML team', tools: ['Notion', 'Maze'] },
        { phase: 'Experiment', weeks: 'Wk 11–12', what: 'A/B test on 3 categories', tools: ['Amplitude', 'Linear'] },
      ],
      decisions: [
        { title: 'Answers are product cards', text: 'Every answer leads with up to three products and a one-line “why this fits you”.' },
        { title: 'Streaming skeletons', text: 'A visible “thinking” state that names what the AI is checking makes 4s feel like 1.5s (perceived-wait test).' },
        { title: 'Compare in one tap', text: 'Any two cards can become a side-by-side table — the single most-used feature.' },
        { title: 'Honest AI labelling', text: 'Clear AI disclosure, sources and a “not sure” state instead of guessing.' },
      ],
      screens: ['phone-chat', 'phone-compare'],
      results: [
        { metric: 'Assisted conversion', before: '3.1%', after: '4.4%', delta: '+42%' },
        { metric: 'Average order value', before: '€62', after: '€69', delta: '+12%' },
        { metric: 'Assistant CSAT', before: '3.7', after: '4.6', delta: '+0.9' },
        { metric: 'Return rate (assisted)', before: '18%', after: '16.4%', delta: '−9%' },
        { metric: 'Sessions using assistant', before: '—', after: '38%', delta: 'new' },
      ],
      quote: { text: 'We asked for a chatbot. We got a shopping tool that people actually come back to.', who: 'VP Digital, Shoply' },
      learnings: [
        'Prototype AI with humans first — Wizard of Oz saved us months of model work.',
        'Design the failure states before the happy path. “I’m not sure” built more trust than any answer.',
        'Pair with ML on eval rubrics: quality is a design decision.',
      ],
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
