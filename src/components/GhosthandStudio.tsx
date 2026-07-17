'use client';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import {
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from 'react';
import GhosthandMark from './GhosthandMark';

type CaseStudy = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  context: string;
  constraint: string;
  build: string;
  outcome: string;
  signal: string;
  engagement: string;
  note?: string;
  tags: string[];
};

type MethodStep = {
  id: string;
  number: string;
  title: string;
  promise: string;
  description: string;
  input: string;
  deliverable: string;
  checkpoint: string;
  horizon: string;
  signal: string;
};

const cases: CaseStudy[] = [
  {
    id: 'tetra',
    number: '01',
    eyebrow: 'TETRA / DESIGN OPERATIONS',
    title: 'A design operating system made for real delivery pressure.',
    subtitle: 'Human-guided workflow architecture in a regulated enterprise context.',
    context: 'A complex product organization needed a more coherent way to move research, design, documentation, review, and handoff through one accountable system.',
    constraint: 'Quality could not be traded for speed. Every recommendation needed enough context for teams and stakeholders to trust the next step.',
    build: 'TETRA: a reusable operating model connecting research signals, component work, design critique, decision records, and delivery rituals.',
    outcome: 'A shared language for faster, more legible product work—designed to increase team autonomy while keeping human review in the loop.',
    signal: 'WORKFLOW ACCELERATION / HUMAN CHECKPOINTS',
    engagement: 'Design operations · workflow architecture',
    note: 'Selected experience completed in an employee capacity at American Express. No endorsement or affiliation is implied.',
    tags: ['Research synthesis', 'Design QA', 'Decision records'],
  },
  {
    id: 'whole-body',
    number: '02',
    eyebrow: 'WHOLE BODY / PLATFORM ECOSYSTEM',
    title: 'One platform logic across a family of distinct businesses.',
    subtitle: 'Brand, product, and operating systems built as one connected surface.',
    context: 'A growing independent ecosystem needed its membership, commerce, content, and brand operations to feel coherent without flattening the character of each property.',
    constraint: 'The system had to support experimentation and small-team velocity without becoming a pile of disconnected tools and one-off decisions.',
    build: 'A shared product and identity foundation with modular experiences, clear navigation rules, and repeatable launch patterns for new offerings.',
    outcome: 'A durable platform approach that lets individual properties evolve while preserving a recognizable operating core.',
    signal: 'MULTI-PROPERTY FOUNDATION / COMPOUNDING SYSTEMS',
    engagement: 'Product foundation · brand systems',
    tags: ['Membership', 'Commerce', 'Content systems'],
  },
  {
    id: 'thermo',
    number: '03',
    eyebrow: 'THERMO FISHER / COMPONENT SYSTEMS',
    title: 'Scientific commerce patterns that teams can actually reuse.',
    subtitle: 'Component thinking for high-accuracy, high-volume product work.',
    context: 'Scientific customers and internal teams needed consistent product patterns that could carry complex information without adding friction to discovery or purchasing.',
    constraint: 'Accuracy, accessibility, and speed all mattered at once—there was no room for a visual system detached from how the product behaved.',
    build: 'Reusable product foundations, documented interaction patterns, and a practical way to translate design intent into scalable implementation work.',
    outcome: 'A clearer shared baseline for product decisions, handoff, and iterative work across a large technical surface area.',
    signal: 'SCALABLE COMPONENT APPROACH / CLEARER HANDOFF',
    engagement: 'Component systems · product architecture',
    tags: ['Accessibility', 'Scientific commerce', 'System documentation'],
  },
  {
    id: 'knowledge',
    number: '04',
    eyebrow: 'KNOWLEDGE SYSTEMS / IN DEVELOPMENT',
    title: 'Answers with context—not another black box.',
    subtitle: 'Source-aware knowledge architecture for consequential decisions.',
    context: 'Teams have information everywhere, yet the critical context often disappears at the exact moment a decision needs to be made.',
    constraint: 'A useful AI system has to distinguish signal from noise, expose what it knows, and preserve an accountable human decision point.',
    build: 'Knowledge foundations that connect retrieval, source context, operational workflows, and carefully scoped agent behaviors.',
    outcome: 'A credible path from fragmented internal knowledge to a system people can use—and challenge—with confidence.',
    signal: 'SOURCE-AWARE CONTEXT / DECISION SUPPORT',
    engagement: 'Knowledge architecture · agentic workflow pilot',
    tags: ['Retrieval context', 'Human review', 'System boundaries'],
  },
];

const methodSteps: MethodStep[] = [
  {
    id: 'audit',
    number: '01',
    title: 'Audit',
    promise: 'Find the drag worth removing.',
    description: 'Map the work, decisions, constraints, and opportunities before proposing automation.',
    input: 'Workflow reality: people, artifacts, handoffs, policies, and bottlenecks.',
    deliverable: 'System audit with opportunity map, risk notes, and a practical first pilot.',
    checkpoint: 'Leaders agree on what stays human, what becomes assistive, and what success means.',
    horizon: '2–4 weeks',
    signal: 'A prioritized path into a real operational problem.',
  },
  {
    id: 'architect',
    number: '02',
    title: 'Architect',
    promise: 'Design the loop before the agent.',
    description: 'Define the relationships among data, models, people, approval points, and product surfaces.',
    input: 'A selected use case, source systems, constraints, and required accountability.',
    deliverable: 'Human + agent system blueprint with clear data boundaries and experience flows.',
    checkpoint: 'Teams can see who decides, what is automated, and where the system needs oversight.',
    horizon: '2–5 weeks',
    signal: 'A buildable system that earns adoption instead of forcing it.',
  },
  {
    id: 'deploy',
    number: '03',
    title: 'Deploy',
    promise: 'Ship inside the work—not beside it.',
    description: 'Turn the blueprint into a narrow, useful pilot that lives in the places people already make decisions.',
    input: 'Approved architecture, a focused workstream, and an accountable client team.',
    deliverable: 'Working pilot, onboarding path, instrumentation plan, and operating documentation.',
    checkpoint: 'Real users can review output, correct the loop, and understand how it affects their work.',
    horizon: '4–10 weeks',
    signal: 'A usable system with observable adoption and quality signals.',
  },
  {
    id: 'scale',
    number: '04',
    title: 'Evolve',
    promise: 'Expand only where trust is earned.',
    description: 'Measure adoption, repair weak handoffs, and extend agent coverage only after the first loop is healthy.',
    input: 'Pilot evidence, user feedback, performance signals, and newly visible constraints.',
    deliverable: 'Evolution roadmap, system governance rhythm, and prioritized next coverage areas.',
    checkpoint: 'The organization owns the operating model—not just the initial build.',
    horizon: 'Ongoing',
    signal: 'A system that compounds value without compounding fragility.',
  },
];

const navItems = [
  { label: 'Outcomes', target: 'outcomes' },
  { label: 'Method', target: 'method' },
  { label: 'Team', target: 'team' },
];

const ease = [0.16, 1, 0.3, 1] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tabKeyNavigation(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  length: number,
  select: (next: number) => void,
  refs: Array<HTMLButtonElement | null>,
) {
  let nextIndex: number | null = null;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + length) % length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = length - 1;
  if (nextIndex === null) return;
  event.preventDefault();
  select(nextIndex);
  refs[nextIndex]?.focus();
}

function Arrow({ direction = 'down' }: { direction?: 'down' | 'right' }) {
  return <span className={`gh-arrow gh-arrow--${direction}`} aria-hidden="true">→</span>;
}

export default function GhosthandStudio() {
  const [activeCase, setActiveCase] = useState(0);
  const [activeMethod, setActiveMethod] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const reducedMotion = useReducedMotion();
  const caseRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const methodRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.25 });
  const selectedCase = cases[activeCase];
  const selectedMethod = methodSteps[activeMethod];

  const closeAndScroll = (target: string) => {
    setIsMenuOpen(false);
    scrollToSection(target);
  };

  const handleInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const honeypot = String(data.get('website') ?? '').trim();

    if (honeypot) return;
    if (!name || !email || !company || !message) {
      setFormState('error');
      setFormMessage('Please complete the four required fields so we can respond usefully.');
      return;
    }

    const subject = encodeURIComponent(`Ghosthand inquiry — ${company}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nTeam / budget: ${String(data.get('scope') ?? '').trim()}\n\nWhat is slowing down:\n${message}`,
    );

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          scope: String(data.get('scope') ?? '').trim(),
          message,
          website: honeypot,
        }),
      });
      const result = await response.json() as { success?: boolean; delivered?: boolean; message?: string };

      if (!response.ok || !result.success) {
        setFormState('error');
        setFormMessage(result.message ?? 'We could not deliver that inquiry. Please email hello@ghosthand.studios directly.');
        return;
      }

      if (result.delivered) {
        setFormState('success');
        setFormMessage('Received. We will respond within two business days.');
        form.reset();
        return;
      }

      setFormState('success');
      setFormMessage('Your email client will open with the inquiry details preserved.');
      window.location.href = `mailto:hello@ghosthand.studios?subject=${subject}&body=${body}`;
    } catch {
      setFormState('error');
      setFormMessage('We could not reach the inquiry service. Please email hello@ghosthand.studios directly.');
    }
  };

  return (
    <main className="ghosthand" id="top">
      <motion.div className="gh-scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <header className="gh-nav">
        <a className="gh-brand" href="#top" aria-label="Ghosthand Studios home">
          <span className="gh-brand__mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Ghosthand</span>
          <em>Studios</em>
        </a>

        <nav className="gh-nav__links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.target} type="button" onClick={() => scrollToSection(item.target)}>{item.label}</button>
          ))}
        </nav>

        <button className="gh-nav__cta" type="button" onClick={() => scrollToSection('contact')}>
          Request audit <Arrow direction="right" />
        </button>

        <button
          className={`gh-menu-toggle${isMenuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="gh-mobile-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease }}
            >
              {navItems.map((item) => (
                <button key={item.target} type="button" onClick={() => closeAndScroll(item.target)}>{item.label}<Arrow direction="right" /></button>
              ))}
              <button type="button" onClick={() => closeAndScroll('contact')}>Request audit<Arrow direction="right" /></button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="gh-hero" aria-labelledby="hero-heading">
        <motion.div
          className="gh-hero__copy"
          initial={false}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
          }}
        >
          <motion.p className="gh-eyebrow" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease }}>
            <i /> GOVERNED AI SYSTEMS / 01
          </motion.p>
          <motion.h1 id="hero-heading" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8, ease }}>
            Build systems<br />your organization<br /><span>can own.</span>
          </motion.h1>
          <motion.p className="gh-hero__lede" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.65, ease }}>
            Ghosthand Studios designs human-guided AI systems, product foundations, and operational workflows for teams who need speed <em>without surrendering control.</em>
          </motion.p>
          <motion.div className="gh-hero__actions" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.62, ease }}>
            <button className="gh-button gh-button--primary" type="button" onClick={() => scrollToSection('contact')}>
              Start a systems audit <Arrow direction="right" />
            </button>
            <button className="gh-button gh-button--quiet" type="button" onClick={() => scrollToSection('outcomes')}>
              Review outcomes <Arrow direction="right" />
            </button>
          </motion.div>
          <motion.div className="gh-proof-strip" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: 0.7, ease }}>
            <span>Product systems</span><i /><span>AI infrastructure</span><i /><span>Workflow transformation</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="gh-hero__system"
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.28, ease }}
        >
          <div className="gh-hero__system-header">
            <span><i /> SYSTEM READINESS</span>
            <b>V.01</b>
          </div>
          <GhosthandMark className="gh-operating-field" reducedMotion={Boolean(reducedMotion)} />
          <div className="gh-hero__system-footer">
            <span>Signals → systems → capability</span>
            <span>Human-approved</span>
          </div>
        </motion.div>

        <button className="gh-hero__scroll" type="button" onClick={() => scrollToSection('outcomes')} aria-label="Scroll to selected outcomes">
          <span>Scroll to evidence</span><i /><Arrow />
        </button>
      </section>

      <section className="gh-section gh-outcomes" id="outcomes" aria-labelledby="outcomes-heading">
        <motion.div className="gh-section__heading" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease }}>
          <p className="gh-eyebrow"><i /> SELECTED OUTCOMES / 02</p>
          <div>
            <h2 id="outcomes-heading">Evidence is more useful<br /><span>than spectacle.</span></h2>
            <p>Each engagement connects the product surface to the operational system that makes it durable.</p>
          </div>
        </motion.div>

        <motion.div className="gh-case-console" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.72, ease }}>
          <div className="gh-case-index">
            <div className="gh-console-label"><span>CASE INDEX</span><b>04</b></div>
            <div role="tablist" aria-label="Selected case studies" className="gh-case-index__tabs">
              {cases.map((caseStudy, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`case-tab-${caseStudy.id}`}
                  key={caseStudy.id}
                  ref={(node) => { caseRefs.current[index] = node; }}
                  aria-selected={activeCase === index}
                  aria-controls="case-brief"
                  tabIndex={activeCase === index ? 0 : -1}
                  className={activeCase === index ? 'is-active' : ''}
                  onClick={() => setActiveCase(index)}
                  onKeyDown={(event) => tabKeyNavigation(event, index, cases.length, setActiveCase, caseRefs.current)}
                >
                  <span>{caseStudy.number}</span>
                  <strong>{caseStudy.eyebrow.split(' / ')[0]}</strong>
                  <i>{caseStudy.subtitle}</i>
                  <Arrow direction="right" />
                </button>
              ))}
            </div>
          </div>

          <article className="gh-case-brief" id="case-brief" role="tabpanel" aria-labelledby={`case-tab-${selectedCase.id}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCase.id}
                initial={reducedMotion ? false : { opacity: 0, y: 14, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: reducedMotion ? 0 : 0.32, ease }}
              >
                <div className="gh-case-brief__topline"><span>{selectedCase.eyebrow}</span><i>{selectedCase.number} / 04</i></div>
                <p className="gh-case-brief__signal">{selectedCase.signal}</p>
                <h3>{selectedCase.title}</h3>
                <p className="gh-case-brief__subtitle">{selectedCase.subtitle}</p>
                <div className="gh-case-brief__grid">
                  <div><span>Context</span><p>{selectedCase.context}</p></div>
                  <div><span>Constraint</span><p>{selectedCase.constraint}</p></div>
                  <div><span>What we built</span><p>{selectedCase.build}</p></div>
                  <div><span>Outcome</span><p>{selectedCase.outcome}</p></div>
                </div>
                <div className="gh-case-brief__footer">
                  <div><span>Engagement shape</span><b>{selectedCase.engagement}</b></div>
                  <ul aria-label="Selected case study artifacts">{selectedCase.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                {selectedCase.note && <p className="gh-case-brief__note">{selectedCase.note}</p>}
              </motion.div>
            </AnimatePresence>
          </article>
        </motion.div>
      </section>

      <section className="gh-section gh-method" id="method" aria-labelledby="method-heading">
        <motion.div className="gh-section__heading gh-section__heading--split" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease }}>
          <p className="gh-eyebrow"><i /> CONTROL PLANE / 03</p>
          <div><h2 id="method-heading">A method made for<br /><span>adoption, not theater.</span></h2></div>
          <p>We do not put an agent beside a broken workflow and call it transformation. We find the leverage, design the guardrails, ship the first useful loop, then evolve it with the people accountable for the work.</p>
        </motion.div>

        <motion.div className="gh-method-console" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.72, ease }}>
          <div className="gh-method-steps" role="tablist" aria-label="Ghosthand delivery method">
            {methodSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                role="tab"
                id={`method-tab-${step.id}`}
                ref={(node) => { methodRefs.current[index] = node; }}
                aria-selected={activeMethod === index}
                aria-controls="method-detail"
                tabIndex={activeMethod === index ? 0 : -1}
                className={activeMethod === index ? 'is-active' : ''}
                onClick={() => setActiveMethod(index)}
                onKeyDown={(event) => tabKeyNavigation(event, index, methodSteps.length, setActiveMethod, methodRefs.current)}
              >
                <span>{step.number}</span>
                <b>{step.title}</b>
                <i>{step.promise}</i>
                <em aria-hidden="true" />
              </button>
            ))}
          </div>

          <article className="gh-method-detail" id="method-detail" role="tabpanel" aria-labelledby={`method-tab-${selectedMethod.id}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod.id}
                initial={reducedMotion ? false : { opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease }}
              >
                <div className="gh-method-detail__topline"><span>PHASE {selectedMethod.number}</span><b>{selectedMethod.horizon}</b></div>
                <h3>{selectedMethod.title}<span>.</span></h3>
                <p className="gh-method-detail__description">{selectedMethod.description}</p>
                <div className="gh-method-detail__grid">
                  <div><span>Client input</span><p>{selectedMethod.input}</p></div>
                  <div><span>Ghosthand delivers</span><p>{selectedMethod.deliverable}</p></div>
                  <div><span>Human checkpoint</span><p>{selectedMethod.checkpoint}</p></div>
                </div>
                <p className="gh-method-detail__signal"><i /> {selectedMethod.signal}</p>
              </motion.div>
            </AnimatePresence>
          </article>
        </motion.div>
      </section>

      <section className="gh-section gh-team" id="team" aria-labelledby="team-heading">
        <motion.div className="gh-section__heading" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease }}>
          <p className="gh-eyebrow"><i /> THE STUDIO / 04</p>
          <div>
            <h2 id="team-heading">Two disciplines.<br /><span>One delivery system.</span></h2>
            <p>Strategy is only useful when it can become a working system. Engineering is only useful when people can understand, adopt, and extend it.</p>
          </div>
        </motion.div>

        <div className="gh-team-grid">
          <motion.article className="gh-team-card gh-team-card--jesse" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, ease }}>
            <div className="gh-team-card__visual" aria-hidden="true"><span>JG</span><i /><i /><i /><b>Experience system</b></div>
            <div className="gh-team-card__content">
              <p className="gh-team-card__index">01 / PRODUCT &amp; SYSTEMS DESIGN</p>
              <h3>Jesse<br /><span>Gawlik</span></h3>
              <p>Jesse makes complex products legible and shippable. His work spans enterprise fintech, scientific commerce, brand systems, and independent platform building.</p>
              <div className="gh-team-card__lists"><div><span>Leads</span><b>Experience strategy<br />Operating design<br />Product foundations</b></div><div><span>Brings into the room</span><b>Clarity, momentum,<br />and a buildable point of view</b></div></div>
            </div>
          </motion.article>

          <motion.article className="gh-team-card gh-team-card--chris" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay: reducedMotion ? 0 : 0.1, ease }}>
            <div className="gh-team-card__visual" aria-hidden="true"><span>CK</span><i /><i /><i /><b>Infrastructure graph</b></div>
            <div className="gh-team-card__content">
              <p className="gh-team-card__index">02 / TECHNICAL SYSTEMS</p>
              <h3>Chris<br /><span>Kyser</span></h3>
              <p>Chris architects the application and knowledge systems that allow AI products to become useful in production—not merely impressive in a prototype.</p>
              <div className="gh-team-card__lists"><div><span>Leads</span><b>Systems architecture<br />AI implementation<br />Technical foundations</b></div><div><span>Brings into the room</span><b>Structure, rigor,<br />and systems that hold up</b></div></div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="gh-contact" id="contact" aria-labelledby="contact-heading">
        <motion.div className="gh-contact__intro" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease }}>
          <p className="gh-eyebrow"><i /> START HERE / 05</p>
          <h2 id="contact-heading">Bring the<br /><span>bottleneck.</span></h2>
          <p>Tell us where work stalls, what must stay under human control, and what a useful first win would look like.</p>
          <div className="gh-contact__availability"><i /><span>Typical first step</span><b>Systems audit</b></div>
          <a className="gh-contact__email" href="mailto:hello@ghosthand.studios">hello@ghosthand.studios <Arrow direction="right" /></a>
        </motion.div>

        <motion.form className="gh-form" onSubmit={handleInquiry} initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, ease }}>
          <div className="gh-form__topline"><span>INQUIRY / 01</span><b>Response within two business days</b></div>
          <label><span>Your name</span><input name="name" autoComplete="name" required placeholder="Name" /></label>
          <div className="gh-form__split"><label><span>Work email</span><input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label><label><span>Organization</span><input name="company" autoComplete="organization" required placeholder="Company" /></label></div>
          <label><span>Engagement shape <em>optional</em></span><select name="scope" defaultValue=""><option value="" disabled>Select a range</option><option>Systems audit</option><option>Focused pilot</option><option>Product or knowledge foundation</option><option>Embedded partnership</option></select></label>
          <label><span>What is slowing down?</span><textarea name="message" required rows={5} placeholder="Describe the operational drag, the decision that is too slow, or the workflow that needs a better loop." /></label>
          <input className="gh-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="gh-button gh-button--primary gh-form__submit" type="submit">Start the conversation <Arrow direction="right" /></button>
          <AnimatePresence>
            {formState !== 'idle' && <motion.p className={`gh-form__message is-${formState}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><i /> {formMessage}</motion.p>}
          </AnimatePresence>
          <p className="gh-form__privacy">We use this information only to respond to your inquiry. No tracker. No list.</p>
        </motion.form>
      </section>

      <footer className="gh-footer">
        <div className="gh-footer__mark"><span className="gh-brand__mark" aria-hidden="true"><i /><i /><i /></span><b>Ghosthand Studios</b></div>
        <p>Human-guided AI systems for product, operations, and innovation leaders navigating high-consequence workflow change.</p>
        <div><span>Remote-first</span><i /><span>Morongo Valley, CA / Northport, AL</span></div>
        <small>© {new Date().getFullYear()} Ghosthand Studios. Built with accountability in the loop.</small>
      </footer>
    </main>
  );
}
