import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ArrowUpRightBadge, GeometricWireframe } from '../components/common/BrandGraphics';

export const HomePage = () => {
  const [activeCapability, setActiveCapability] = useState(0);

  const capabilities = [
    {
      num: '01',
      title: 'Plain-Language Legal Summaries',
      subtitle: 'Executive Factual Synthesis',
      desc: 'Deconstructs dense statutory citations, procedural technicalities, and multi-clause liabilities into plain-language executive summaries with verified factual findings.',
      deliverable: 'Extracts claimant demands, respondent liabilities, and statutory references.',
      tag: 'FACTUAL SYNTHESIS',
      badge: 'VERIFIED FINDINGS',
    },
    {
      num: '02',
      title: 'Legal FAQs & Key Information Extraction',
      subtitle: 'Obligation & Notice Tracking',
      desc: 'Isolates critical dates, cure periods, financial claims, and statutory deadlines into structured question-and-answer pairs designed for immediate comprehension.',
      deliverable: 'Identifies cure periods, arbitration clauses, and liquidated damages thresholds.',
      tag: 'STATUTORY EXTRACT',
      badge: 'TIME-SENSITIVE DATES',
    },
    {
      num: '03',
      title: 'Procedural Flowcharts',
      subtitle: 'Interactive Directed Graphs',
      desc: 'Transforms litigation stages, notice deadlines, and court filing procedures into interactive directed graphs rendered via React Flow, highlighting statutory timeframes.',
      deliverable: 'Displays procedural sequence, appellate options, and limitation milestones.',
      tag: 'REACT FLOW PIPELINE',
      badge: 'INTERACTIVE NODES',
    },
    {
      num: '04',
      title: 'Legal Timelines & Action Items',
      subtitle: 'Chronological Milestone Mapping',
      desc: 'Builds a chronological timeline of material facts, defaults, and statutory notices, paired with an actionable checklist of required next steps.',
      deliverable: 'Chronological timeline mapping from document inception to dispute deadlines.',
      tag: 'CHRONOLOGY ENGINE',
      badge: 'ACTION CHECKLIST',
    },
    {
      num: '05',
      title: 'Document-Grounded AI Chat',
      subtitle: 'Verifiable Clause Dialogue',
      desc: 'Query specific clauses or liabilities. Every response is constrained exclusively to verified document text with exact source page citations, admitting uncertainty when facts are absent.',
      deliverable: 'Page-level citations accompany every conversational answer.',
      tag: 'DETERMINISTIC CITATION',
      badge: 'STRICT DEFENSE',
    },
    {
      num: '06',
      title: 'Lawyer-Oriented Argument Mapping',
      subtitle: 'Litigation Strategy & Counter-Claims',
      desc: 'For legal professionals: dual-column argument structures contrasting claimant submissions and evidentiary basis against viable respondent counter-claims and statutory defenses.',
      deliverable: 'Empowers legal practitioners to model claims against statutory counter-arguments.',
      tag: 'ADVOCATE SUITE',
      badge: 'DUAL-COLUMN MATRIX',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-charcoal-800 flex flex-col selection:bg-royal-700 selection:text-white w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow w-full overflow-x-hidden">
        {/* ======================================================== */}
        {/* SECTION 1 — HERO: CINEMATIC LADY JUSTICE BACKGROUND      */}
        {/* ======================================================== */}
        <section className="relative min-h-[660px] lg:h-[760px] flex items-center bg-midnight-950 text-white overflow-hidden w-full">
          {/* Full-width Background Image: LadyJustice.png */}
          <div
            className="absolute inset-0 bg-cover bg-right md:bg-center z-0 opacity-90 scale-100 transition-transform duration-1000"
            style={{ backgroundImage: `url('/images/LadyJustice.png')` }}
          ></div>

          {/* Dark Navy Atmospheric Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-950/85 to-midnight-950/30 z-10 pointer-events-none"></div>

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-midnight-950 to-transparent z-10 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-20 w-full">
            <div className="max-w-2xl space-y-8">
              {/* Restrained Eyebrow Badge */}


              {/* Sophisticated Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-serif font-semibold text-white tracking-tight leading-[1.08] break-words">
                Clarity in Law.<br />
                <span className="italic font-normal text-ice-200">
                  Confidence in Every Decision.
                </span>
              </h1>

              {/* Supporting Editorial Paragraph */}
              <p className="text-base sm:text-lg font-sans text-steel-300 leading-relaxed max-w-xl">
                Understand complex legal documents through structured summaries, procedural flowcharts, and document-grounded AI assistance with verifiable citations.
              </p>

              {/* Minimalist CTAs (EquityLegal Style) */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white hover:bg-pale-200 text-midnight-950 text-xs font-sans font-semibold uppercase tracking-[0.16em] transition-all shadow-subtle group text-center"
                >
                  <span>Analyze Your Document</span>
                  <span className="w-4 h-4 rounded-full bg-midnight-950 text-white flex items-center justify-center shrink-0">
                    <ArrowUpRightBadge className="w-3.5 h-3.5 text-white" />
                  </span>
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-full border border-white/25 hover:border-white text-white text-xs font-sans font-medium uppercase tracking-[0.16em] transition-colors text-center"
                >
                  Explore the Platform
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2 — INTRODUCTION / ABOUT NYAYASETU (SPLIT)       */}
        {/* ======================================================== */}
        <section id="about" className="py-24 md:py-32 bg-white text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Split Editorial Header & Supporting Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Editorial Heading & Content */}
              <div className="lg:col-span-7 space-y-6 min-w-0">
                <div className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                    About NyayaSetu
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-midnight-900 leading-[1.15] break-words">
                  Delivering Unparalleled Legal Support in Complex Document Comprehension.
                </h2>
                <p className="text-base font-sans text-charcoal-600 leading-relaxed">
                  NyayaSetu is an AI-powered legal document intelligence platform engineered to bridge the gap between citizens, legal professionals, and impenetrable jurisprudence. We deconstruct court judgments, legal demand notices, commercial contracts, and petitions into clear factual timelines, interactive procedural pathways, and verifiable answers.
                </p>
                <div className="pt-2">
                  <a
                    href="#capabilities"
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-midnight-900 hover:text-royal-700 underline underline-offset-4 group"
                  >
                    <span>View Our Capabilities</span>
                    <ArrowUpRightBadge className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Supporting Visual (EquityLegal Style) */}
              <div className="lg:col-span-5 min-w-0">
                <div className="relative rounded-2xl overflow-hidden shadow-panel border border-pale-300 aspect-[4/3] bg-pale-100 group">
                  <img
                    src="/images/image.png"
                    alt="Classical bronze statue of Lady Justice with leatherbound legal volumes representing authoritative legal research"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/70 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-white/90 backdrop-blur-md border border-white/20 text-xs font-sans text-midnight-950 flex items-center justify-between">
                    <span className="font-serif font-semibold">Institutional Jurisprudence</span>
                    <span className="font-mono text-[10px] text-steel-600 uppercase">Verifiable Grounding</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Restrained Metrics Row Beneath (EquityLegal 4-Column Stat Bar) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-pale-300 mt-20 pt-12">
              <div className="space-y-1.5 min-w-0">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
                  100%
                </div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-700">
                  Grounded Citations
                </div>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  Every legal answer links directly to verified source page numbers.
                </p>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
                  25 MB
                </div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-700">
                  Ingestion Capacity
                </div>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  Full PDF buffer streaming with cryptographic integrity verification.
                </p>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
                  200 DPI
                </div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-700">
                  OCR Rasterization
                </div>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  Tesseract fallback handles scanned or low-density pages seamlessly.
                </p>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-midnight-900">
                  &lt; 60s
                </div>
                <div className="text-xs font-sans font-semibold uppercase tracking-wider text-royal-700">
                  Synthesis Pipeline
                </div>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  Fast deterministic extraction and structured Pydantic schema validation.
                </p>
              </div>
            </div>

            {/* Corporate / Institutional Standards Ticker (EquityLegal Style) */}
            <div className="mt-14 pt-8 border-t border-pale-200 flex flex-wrap items-center justify-start sm:justify-between gap-x-6 gap-y-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] sm:tracking-[0.18em] text-steel-500">
              <span className="text-charcoal-400 font-sans font-medium">Platform Standards:</span>
              <span>PyMuPDF Engine</span>
              <span className="hidden sm:inline text-pale-300">•</span>
              <span>Google Gemini Pro</span>
              <span className="hidden sm:inline text-pale-300">•</span>
              <span>Tesseract OCR 200 DPI</span>
              <span className="hidden sm:inline text-pale-300">•</span>
              <span>FastAPI Architecture</span>
              <span className="hidden sm:inline text-pale-300">•</span>
              <span>Pydantic Schema Validation</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3 — PLATFORM CAPABILITIES (EXPANDABLE LIST)      */}
        {/* ======================================================== */}
        <section id="capabilities" className="py-24 md:py-32 bg-pale-100 text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Introduction (EquityLegal Style) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                    Comprehensive Suite
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-midnight-900 leading-tight">
                  Legal Document Intelligence Capabilities
                </h2>
                <p className="text-sm font-sans text-charcoal-600 leading-relaxed">
                  Explore how our specialized extraction pipelines and generative synthesis tools turn opaque legal prose into structured actionable clarity.
                </p>
                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-midnight-900 hover:bg-slate-700 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all group"
                  >
                    <span>Analyze Document</span>
                    <ArrowUpRightBadge className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Expandable List with Visual Deliverables */}
              <div className="lg:col-span-8 divide-y divide-pale-300 border-y border-pale-300 bg-white rounded-2xl shadow-subtle p-2 md:p-6">
                {capabilities.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveCapability(activeCapability === idx ? null : idx)}
                    className="py-6 px-4 cursor-pointer transition-colors hover:bg-pale-100/60 rounded-xl"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-5 sm:gap-8">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-steel-400">
                          {item.num}
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-serif font-semibold text-midnight-900">
                            {item.title}
                          </h3>
                          <span className="text-xs font-sans uppercase tracking-[0.16em] text-steel-500 mt-0.5 block">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <span className="w-7 h-7 rounded-full border border-steel-300 flex items-center justify-center text-xs font-mono text-midnight-900 shrink-0">
                        {activeCapability === idx ? '−' : '+'}
                      </span>
                    </div>

                    {activeCapability === idx && (
                      <div className="mt-5 pt-5 border-t border-pale-200 pl-0 sm:pl-16 space-y-4 animate-fadeIn">
                        <p className="text-sm font-sans text-charcoal-600 leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="p-4 rounded-xl bg-pale-100 border border-pale-200 text-xs font-sans text-midnight-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="font-semibold text-royal-700 uppercase tracking-wider block mb-0.5">
                              Key Deliverable:
                            </span>
                            <span>{item.deliverable}</span>
                          </div>
                          <span className="shrink-0 px-2.5 py-1 rounded bg-white border border-pale-300 text-[10px] font-mono text-midnight-900 font-semibold tracking-wider uppercase">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4 — HOW NYAYASETU WORKS (DARK HORIZONTAL)        */}
        {/* ======================================================== */}
        <section id="how-it-works" className="py-24 md:py-32 bg-midnight-950 text-white border-b border-white/10 relative overflow-hidden">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-grid-navy grid-fade-mask pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header with Carousel Indicators */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-gold-500">
                    Disciplined Methodology
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-white leading-tight">
                  Designed to Simplify Complex Legal Matters at Every Stage.
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-sans text-steel-400 max-w-sm hidden sm:block">
                  Four rigorous procedural stages delivering transparent document ingestion, extraction, and verifiable synthesis.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Previous step"
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-steel-400 hover:text-white hover:border-white transition-colors text-xs font-mono"
                  >
                    &lt;
                  </button>
                  <button
                    aria-label="Next step"
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-steel-400 hover:text-white hover:border-white transition-colors text-xs font-mono"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Horizontal Steps with Thin Separators & Active Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  phase: 'INGESTION',
                  title: 'Upload Legal PDF',
                  desc: 'Securely upload judgments, demand notices, or contracts up to 25MB. Files are verified for true %PDF- bytes and isolated strictly to your account.',
                  highlight: false,
                },
                {
                  step: '02',
                  phase: 'EXTRACTION',
                  title: 'Extract Text & OCR',
                  desc: 'High-speed PyMuPDF text parsing automatically triggers 200 DPI Tesseract OCR rasterization for scanned, image-based, or low-density pages.',
                  highlight: false,
                },
                {
                  step: '03',
                  phase: 'SYNTHESIS',
                  title: 'Structured Legal Insights',
                  desc: 'Deterministic AI models identify facts, parties, and procedural stages under strict Pydantic schemas, generating summaries and interactive flowcharts.',
                  highlight: true,
                },
                {
                  step: '04',
                  phase: 'DIALOGUE',
                  title: 'Grounded Dialogue',
                  desc: 'Query specific clauses and liabilities. Every answer cites exact source page numbers and maintains strict uncertainty defenses.',
                  highlight: false,
                },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-xl flex flex-col justify-between space-y-6 transition-all ${stage.highlight
                      ? 'bg-midnight-900 border-2 border-gold-500/60 shadow-panel relative'
                      : 'bg-midnight-900/80 border border-white/10 hover:border-white/30'
                    }`}
                >
                  {stage.highlight && (
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gold-500 text-midnight-950 font-mono text-[9px] font-bold uppercase tracking-widest">
                      Core Engine
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="font-serif text-3xl font-bold text-gold-500">
                        {stage.step}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-steel-400">
                        {stage.phase}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-sans text-steel-300 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-steel-500 uppercase tracking-widest flex items-center justify-between">
                    <span>STAGE {idx + 1} OF 4</span>
                    <span className="text-gold-500 font-bold">[x]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5 — PRACTICAL APPLICATIONS: 2x2 CROSSED GRID     */}
        {/* (Following EquityLegal's Exact Success Stories Layout)   */}
        {/* ======================================================== */}
        <section className="py-24 md:py-32 bg-white text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                  Case Studies & Practical Applications
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-midnight-900 mt-2">
                Explore Real-World Document Transformations
              </h2>
              <p className="text-sm font-sans text-charcoal-600 mt-3">
                Experience how actual legal instruments are deconstructed into structured timelines, procedural flowcharts, and clear action items.
              </p>
            </div>

            {/* 2x2 Crossed Editorial Grid with Center Dividing Lines (EquityLegal Style) */}
            <div className="relative border border-pale-300 rounded-2xl overflow-hidden bg-pale-100/40">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-pale-300">
                {/* Quadrant 1: Commercial Demand Notice */}
                <div className="p-8 md:p-10 space-y-4 bg-white/70 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-steel-500 border-b border-pale-200 pb-3">
                    <span className="uppercase font-semibold text-midnight-900">Commercial Demand Notice</span>
                    <span className="text-royal-700 font-semibold">PAGE 2, PARA 4</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900">
                    Commercial Default & Liquidated Damages Notice
                  </h3>
                  <p className="text-xs font-sans text-charcoal-700 leading-relaxed">
                    Isolates the 15-day cure window under Clause 14 for alleged delivery consignment breach before arbitration proceedings can be lawfully initiated.
                  </p>
                  <div className="p-3.5 rounded-lg bg-pale-100 border border-pale-200 text-xs font-sans text-midnight-900">
                    <span className="font-semibold text-royal-700 block mb-1">Crucial Action Item:</span>
                    15 calendar days to remit contested damages or tender documentation of cure.
                  </div>
                </div>

                {/* Quadrant 2: Tenancy & Eviction Deed */}
                <div className="p-8 md:p-10 space-y-4 bg-white/70 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-steel-500 border-b border-pale-200 pb-3">
                    <span className="uppercase font-semibold text-midnight-900">Tenancy Contract</span>
                    <span className="text-royal-700 font-semibold">PAGE 5, CLAUSE 9</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900">
                    Residential Lease & Security Deposit Disentanglement
                  </h3>
                  <p className="text-xs font-sans text-charcoal-700 leading-relaxed">
                    Clarifies statutory notice timelines for rent escalations and maps the mandatory conciliation steps required before filing rent tribunal petitions.
                  </p>
                  <div className="p-3.5 rounded-lg bg-pale-100 border border-pale-200 text-xs font-sans text-midnight-900">
                    <span className="font-semibold text-royal-700 block mb-1">Crucial Action Item:</span>
                    30-day statutory notice required prior to lease termination; deposit refund window defined.
                  </div>
                </div>
              </div>

              {/* Horizontal Separator for 2x2 Grid */}
              <div className="hidden md:block w-full border-t border-pale-300"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-pale-300">
                {/* Quadrant 3: Court Appellate Judgment */}
                <div className="p-8 md:p-10 space-y-4 bg-white/70 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-steel-500 border-b border-pale-200 pb-3">
                    <span className="uppercase font-semibold text-midnight-900">Court Order & Judgment</span>
                    <span className="text-royal-700 font-semibold">PAGE 14, PARA 22</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900">
                    High Court Appellate Ruling & Ratio Decidendi
                  </h3>
                  <p className="text-xs font-sans text-charcoal-700 leading-relaxed">
                    Extracts binding principles of law from obiter dicta, summarizes judicial precedents cited, and calculates limitation deadlines for filing special leave appeals.
                  </p>
                  <div className="p-3.5 rounded-lg bg-pale-100 border border-pale-200 text-xs font-sans text-midnight-900">
                    <span className="font-semibold text-royal-700 block mb-1">Crucial Action Item:</span>
                    90-day statutory limitation window applies for appellate revision filing.
                  </div>
                </div>

                {/* Quadrant 4: Employment Master Agreement */}
                <div className="p-8 md:p-10 space-y-4 bg-white/70 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-steel-500 border-b border-pale-200 pb-3">
                    <span className="uppercase font-semibold text-midnight-900">Service Contract</span>
                    <span className="text-royal-700 font-semibold">PAGE 8, CLAUSE 17</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900">
                    Employment Service Deed & Restrictive Covenants
                  </h3>
                  <p className="text-xs font-sans text-charcoal-700 leading-relaxed">
                    Evaluates post-termination non-compete enforceability under Section 27 of the Contract Act, outlining severance rights and internal arbitration pathways.
                  </p>
                  <div className="p-3.5 rounded-lg bg-pale-100 border border-pale-200 text-xs font-sans text-midnight-900">
                    <span className="font-semibold text-royal-700 block mb-1">Crucial Action Item:</span>
                    Jurisdiction restricted to agreed city courts; 3-month garden leave clause mapped.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6 — TESTIMONIALS / PRACTITIONER ENDORSEMENTS     */}
        {/* (EquityLegal 3-Card Layout: Dark, Visual, Pale)          */}
        {/* ======================================================== */}
        <section className="py-24 md:py-32 bg-pale-100 text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-pale-300">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                    User Verification
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-midnight-900">
                  What Practitioners & Citizens Say
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border border-steel-300 bg-white flex items-center justify-center text-midnight-900 hover:border-midnight-900 transition-colors text-xs font-mono"
                >
                  &lt;
                </button>
                <button
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border border-steel-300 bg-white flex items-center justify-center text-midnight-900 hover:border-midnight-900 transition-colors text-xs font-mono"
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* 3 Unified Cards: All deep navy, consistent design language */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Card 1: Advocate */}
              <div className="p-8 md:p-10 rounded-2xl bg-midnight-900 text-white flex flex-col justify-between space-y-6 shadow-panel border border-white/5">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                    ADVOCATE VERIFICATION
                  </div>
                  <p className="text-base sm:text-lg font-serif italic leading-relaxed text-ice-100">
                    "NyayaSetu cut our pre-litigation document review time by more than 70%. Being able to immediately verify obligations against exact source page citations transforms commercial contract dispute assessment."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-800 border border-gold-500/40 text-gold-400 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    RS
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-semibold text-white">
                      Adv. Rajeshwar Sen
                    </h4>
                    <p className="text-xs font-sans text-steel-400">
                      Senior Counsel, Commercial Appellate Practice
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: General Counsel */}
              <div className="p-8 md:p-10 rounded-2xl bg-midnight-900 text-white flex flex-col justify-between space-y-6 shadow-panel border border-white/5">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                    GENERAL COUNSEL ENDORSEMENT
                  </div>
                  <p className="text-base sm:text-lg font-serif italic leading-relaxed text-ice-100">
                    "Verifiable precision where generic chatbots hallucinate. The structured timeline and flowchart make complex filings transparent to our entire legal operations team."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-800 border border-gold-500/40 text-gold-400 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    MN
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-semibold text-white">
                      Dr. Meera Nambiar
                    </h4>
                    <p className="text-xs font-sans text-steel-400">
                      General Counsel, Apex Infrastructure
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Citizen */}
              <div className="p-8 md:p-10 rounded-2xl bg-midnight-900 text-white flex flex-col justify-between space-y-6 shadow-panel border border-white/5">
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-gold-400">
                    CITIZEN CASE REVIEW
                  </div>
                  <p className="text-base sm:text-lg font-serif italic leading-relaxed text-ice-100">
                    "As an independent citizen facing an unfair lease forfeiture notice, the procedural flowchart gave me immediate clarity on my 30-day statutory conciliation window."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-slate-800 border border-gold-500/40 text-gold-400 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    AS
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-semibold text-white">
                      Ananya Sharma
                    </h4>
                    <p className="text-xs font-sans text-steel-400">
                      Founder, Studio Vayu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 7 — TRUST AND PRIVACY PRINCIPLES                 */}
        {/* ======================================================== */}
        <section id="trust" className="py-24 md:py-32 bg-white text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                  Integrity by Design
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-midnight-900 mt-2">
                Platform Trust Principles
              </h2>
              <p className="text-sm font-sans text-charcoal-600 mt-2">
                Architected from the ground up for data isolation, factual grounding, and ethical AI assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Trust Card 1 */}
              <div className="p-7 rounded-xl bg-pale-100/60 border border-pale-300 shadow-subtle space-y-4 hover:border-slate-700/40 transition-colors">
                <div className="w-10 h-10 rounded-md bg-midnight-900 text-white flex items-center justify-center">
                  <GeometricWireframe type="traceability" className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-midnight-900">
                  Page-Level Citations
                </h3>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  Every extracted fact, timeline milestone, and answer is tied directly to verified document page citations.
                </p>
                <div className="text-[10px] font-mono text-royal-700 pt-2 border-t border-pale-200">
                  DETERMINISTIC VERIFICATION
                </div>
              </div>

              {/* Trust Card 2 */}
              <div className="p-7 rounded-xl bg-pale-100/60 border border-pale-300 shadow-subtle space-y-4 hover:border-slate-700/40 transition-colors">
                <div className="w-10 h-10 rounded-md bg-midnight-900 text-white flex items-center justify-center">
                  <GeometricWireframe type="privacy" className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-midnight-900">
                  Tenant Document Isolation
                </h3>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  User documents and chat histories are cryptographically isolated and never used to train public AI models.
                </p>
                <div className="text-[10px] font-mono text-royal-700 pt-2 border-t border-pale-200">
                  CRYPTOGRAPHIC BOUNDARIES
                </div>
              </div>

              {/* Trust Card 3 */}
              <div className="p-7 rounded-xl bg-pale-100/60 border border-pale-300 shadow-subtle space-y-4 hover:border-slate-700/40 transition-colors">
                <div className="w-10 h-10 rounded-md bg-midnight-900 text-white flex items-center justify-center">
                  <GeometricWireframe type="clarity" className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-midnight-900">
                  Uncertainty Handling
                </h3>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  When facts are absent from the document record, the system explicitly acknowledges absence rather than speculating.
                </p>
                <div className="text-[10px] font-mono text-royal-700 pt-2 border-t border-pale-200">
                  ZERO SPECULATION POLICY
                </div>
              </div>

              {/* Trust Card 4 */}
              <div className="p-7 rounded-xl bg-pale-100/60 border border-pale-300 shadow-subtle space-y-4 hover:border-slate-700/40 transition-colors">
                <div className="w-10 h-10 rounded-md bg-midnight-900 text-white flex items-center justify-center text-xs font-mono font-bold">
                  [i]
                </div>
                <h3 className="text-lg font-serif font-semibold text-midnight-900">
                  Informational Assistance
                </h3>
                <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                  All outputs provide objective document comprehension support without impersonating licensed legal counsel.
                </p>
                <div className="text-[10px] font-mono text-royal-700 pt-2 border-t border-pale-200">
                  ADVOCATE PARTNER MODEL
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 8 — LEGAL INSIGHTS / EDUCATIONAL GUIDES          */}
        {/* (EquityLegal Editorial Layout with Date Badges)          */}
        {/* ======================================================== */}
        <section className="py-24 md:py-32 bg-pale-100 text-charcoal-800 border-b border-pale-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-pale-300">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-midnight-900"></span>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-steel-500">
                    Knowledge Base
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-serif font-semibold text-midnight-900">
                  Stay Informed with Legal Document Guides
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-steel-500">
                  &lt; 1 — 3 &gt;
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-midnight-900 hover:text-royal-700 underline underline-offset-4 group"
                >
                  <span>Explore All Insights</span>
                  <ArrowUpRightBadge className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Article 1 */}
              <div className="p-7 rounded-2xl bg-white border border-pale-300 space-y-5 hover:border-slate-700/40 transition-colors flex flex-col justify-between shadow-subtle group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-midnight-900 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
                      12 NOV
                    </span>
                    <span className="text-[10px] font-mono text-steel-500 uppercase tracking-widest">
                      5 MIN READ
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900 leading-snug group-hover:text-royal-700 transition-colors">
                    Deconstructing Default Notices: 15-Day Cure Windows in Arbitration
                  </h3>
                  <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                    How pre-arbitral notice periods operate under standard commercial agreements and the legal consequences of failing to tender timely response.
                  </p>
                </div>
                <div className="pt-4 border-t border-pale-200 text-[11px] font-sans font-semibold text-royal-700 flex items-center justify-between">
                  <span>Commercial Practice</span>
                  <ArrowUpRightBadge className="w-3.5 h-3.5 text-royal-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Article 2 */}
              <div className="p-7 rounded-2xl bg-white border border-pale-300 space-y-5 hover:border-slate-700/40 transition-colors flex flex-col justify-between shadow-subtle group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-midnight-900 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
                      06 OCT
                    </span>
                    <span className="text-[10px] font-mono text-steel-500 uppercase tracking-widest">
                      7 MIN READ
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900 leading-snug group-hover:text-royal-700 transition-colors">
                    Ratio Decidendi vs Obiter Dicta in Judicial Orders
                  </h3>
                  <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                    A practical guide to distinguishing binding legal findings from non-binding judicial commentary when reviewing High Court and Supreme Court rulings.
                  </p>
                </div>
                <div className="pt-4 border-t border-pale-200 text-[11px] font-sans font-semibold text-royal-700 flex items-center justify-between">
                  <span>Jurisprudence</span>
                  <ArrowUpRightBadge className="w-3.5 h-3.5 text-royal-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Article 3 */}
              <div className="p-7 rounded-2xl bg-white border border-pale-300 space-y-5 hover:border-slate-700/40 transition-colors flex flex-col justify-between shadow-subtle group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-midnight-900 text-white font-mono text-[10px] font-bold tracking-wider uppercase">
                      13 SEP
                    </span>
                    <span className="text-[10px] font-mono text-steel-500 uppercase tracking-widest">
                      6 MIN READ
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-midnight-900 leading-snug group-hover:text-royal-700 transition-colors">
                    Navigating Security Deposit Clauses in Tenancy Agreements
                  </h3>
                  <p className="text-xs font-sans text-charcoal-600 leading-relaxed">
                    Statutory limitation periods, lawful deductions, and the procedural escalation routes available under contemporary rent control legislation.
                  </p>
                </div>
                <div className="pt-4 border-t border-pale-200 text-[11px] font-sans font-semibold text-royal-700 flex items-center justify-between">
                  <span>Property Rights</span>
                  <ArrowUpRightBadge className="w-3.5 h-3.5 text-royal-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* SECTION 9 — FOOTER: DARK MIDNIGHT NAVY                   */}
      {/* ======================================================== */}
      <Footer />
    </div>
  );
};
