import Link from 'next/link'
import { GuruLogo } from '@/components/ui/GuruLogo'

const features = [
  {
    icon: '🧠',
    tag: 'AI Tutor',
    title: 'Evidence-based answers, grounded in real-time sources',
    description:
      'Ask any clinical question in natural language — pharmacological mechanisms, guideline dosing thresholds, differential diagnoses. Before generating a response, the system queries authoritative medical databases in real time and injects the retrieved content as structured citations. Answers reflect current guidelines, not a training data cutoff.',
    technical:
      'Retrieval-augmented via Tavily · Streamed token-by-token via SSE · Context-aware within learning modules',
  },
  {
    icon: '📚',
    tag: 'Learning Paths',
    title: 'Structured curricula, written to EU clinical conventions',
    description:
      'Navigate organised learning paths across Cardiology, Pharmacology, Anatomy, and more. Each path contains ordered modules with rich clinical content — ESC threshold values, FASS drug names, SI units throughout. Progress is tracked per module and persisted per user across sessions, so the curriculum resumes exactly where it left off.',
    technical:
      'Per-user progress in PostgreSQL · Markdown-rendered module content · Ordered sequences with completion states',
  },
  {
    icon: '📝',
    tag: 'AI Quizzes',
    title: 'Fresh questions generated from the exact content you studied',
    description:
      "At the end of each module, Claude reads the module content and generates five multiple-choice questions calibrated to the material's difficulty. Each question includes a detailed explanation. Questions are regenerated on every attempt — there is no fixed bank to memorise. Scoring 60% or above marks the module complete.",
    technical:
      'Claude-generated MCQs from module content · JSON-validated output · Per-attempt regeneration · 60% completion gate',
  },
  {
    icon: '📡',
    tag: 'News & Podcast',
    title: 'Live medical updates synthesised into a spoken episode',
    description:
      "The news feed pulls real-time medical updates filtered to EU and Swedish sources — ESC guideline revisions, EMA drug approvals, Socialstyrelsen advisories. The podcast feature takes today's headlines and generates a 2–3 minute spoken episode script using Claude, then delivers it via browser Speech Synthesis for passive learning.",
    technical:
      'Real-time Tavily search · Topic-filtered for EU/SE sources · Claude-generated script · Browser Speech Synthesis API',
  },
]

const stack = [
  {
    icon: '▲',
    name: 'Next.js 16 App Router',
    desc: 'Hybrid rendering: server components for authenticated data, client components for interactive features, edge API routes for AI inference',
  },
  {
    icon: 'A',
    name: 'Claude Sonnet 4.6 (Anthropic)',
    desc: 'AI reasoning engine for tutor chat, quiz generation, recommendations, and podcast scripting — with prompt caching enabled',
  },
  {
    icon: '⚡',
    name: 'Tavily Search API',
    desc: 'Real-time web search scoped to authoritative medical sources — ESC, FASS, EMA, Janusinfo — injected into AI context before each generation',
  },
  {
    icon: 'S',
    name: 'Supabase PostgreSQL',
    desc: 'Database and authentication with row-level security. Stores progress, chat sessions, quiz attempts, and an append-only activity log per user',
  },
  {
    icon: '◆',
    name: 'Vercel',
    desc: 'Serverless edge deployment with automatic CI/CD from the GitHub repository and global CDN distribution',
  },
]

const sources = [
  'ESC Guidelines',
  'FASS',
  'Janusinfo',
  'EMA',
  'Socialstyrelsen',
  'SI units',
  'EU clinical conventions',
]

export default function Home() {
  return (
    <div style={{ backgroundColor: '#020a05' }} className="text-white min-h-screen overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,116,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,116,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4"
        style={{
          borderBottom: '1px solid rgba(0,212,116,0.1)',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(2,10,5,0.88)',
        }}
      >
        <div className="flex items-center gap-3">
          <GuruLogo size={30} />
          <span className="font-bold text-lg">
            Guru, <span style={{ color: '#00d474' }}>M.D.</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg transition-colors hover:text-white"
            style={{ color: '#a8d5ba' }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm rounded-xl font-semibold transition-all duration-200 hover:brightness-110"
            style={{
              backgroundColor: '#00d474',
              color: '#020a05',
              boxShadow: '0 0 16px rgba(0,212,116,0.3)',
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(0,212,116,0.09) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,116,0.07) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,180,100,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              border: '1px solid rgba(0,212,116,0.3)',
              backgroundColor: 'rgba(0,212,116,0.05)',
              color: '#00d474',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: '#00d474' }}
            />
            AI-powered · EU / Swedish clinical guidelines
          </div>

          <div className="flex justify-center">
            <GuruLogo size={110} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            The AI tutor
            <br />
            <span style={{ color: '#00d474' }}>built for medicine.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#a8d5ba' }}>
            Evidence-based answers from live medical sources. Adaptive learning paths.
            AI-generated quizzes. A daily medical podcast. All calibrated to EU and
            Swedish clinical standards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:brightness-110"
              style={{
                backgroundColor: '#00d474',
                color: '#020a05',
                boxShadow: '0 0 28px rgba(0,212,116,0.4)',
              }}
            >
              Start for free →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-base transition-all duration-200 hover:text-white"
              style={{
                border: '1px solid rgba(0,212,116,0.25)',
                color: '#a8d5ba',
              }}
            >
              Sign in
            </Link>
          </div>

          <p className="text-sm" style={{ color: '#3d6b52' }}>
            FASS · Janusinfo · ESC Guidelines · EMA · Socialstyrelsen
          </p>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#3d6b52' }}
        >
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 4v10M5 10l4 4 4-4" />
          </svg>
        </div>
      </section>

      {/* Capabilities */}
      <section
        className="relative z-10 px-4 py-28"
        style={{ borderTop: '1px solid rgba(0,212,116,0.08)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#00d474' }}
            >
              Capabilities
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Everything you need
              <br />
              to master clinical medicine
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#a8d5ba' }}>
              Four deeply integrated features, each powered by live data and large language
              models calibrated to EU and Swedish clinical context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="relative p-8 rounded-2xl transition-all duration-300"
                style={{
                  border: '1px solid rgba(0,212,116,0.12)',
                  backgroundColor: 'rgba(10,26,15,0.5)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        backgroundColor: 'rgba(0,212,116,0.1)',
                        border: '1px solid rgba(0,212,116,0.2)',
                      }}
                    >
                      {f.icon}
                    </div>
                    <span
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: '#00d474' }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">{f.title}</h3>
                  <p className="leading-relaxed text-[15px]" style={{ color: '#a8d5ba' }}>
                    {f.description}
                  </p>
                  <div className="pt-4" style={{ borderTop: '1px solid rgba(0,212,116,0.1)' }}>
                    <p className="text-xs font-mono leading-relaxed" style={{ color: '#3d6b52' }}>
                      {f.technical}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section
        className="relative z-10 px-4 py-28"
        style={{ borderTop: '1px solid rgba(0,212,116,0.08)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#00d474' }}
            >
              Architecture
            </p>
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Built on live knowledge,
              <br />
              not static training data
            </h2>
            <p className="leading-relaxed" style={{ color: '#a8d5ba' }}>
              Before Claude generates any response, the system queries authoritative
              medical sources in real time and injects retrieved content as a structured
              citation block. This retrieval-augmented generation (RAG) model keeps
              answers accurate as guidelines evolve — there is no knowledge cutoff in the
              tutor.
            </p>
            <p className="leading-relaxed" style={{ color: '#a8d5ba' }}>
              The application uses Next.js App Router for hybrid rendering: server
              components handle authenticated data fetching without a client-side
              waterfall, while client components manage interactive state for chat,
              quizzes, and the podcast player. AI inference runs in edge API routes,
              streaming responses via Server-Sent Events.
            </p>
          </div>

          <div className="space-y-3">
            {stack.map((s) => (
              <div
                key={s.name}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{
                  border: '1px solid rgba(0,212,116,0.1)',
                  backgroundColor: 'rgba(10,26,15,0.4)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold font-mono"
                  style={{
                    backgroundColor: 'rgba(0,212,116,0.1)',
                    border: '1px solid rgba(0,212,116,0.2)',
                    color: '#00d474',
                  }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm">{s.name}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#3d6b52' }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swedish Focus */}
      <section
        className="relative z-10 px-4 py-28"
        style={{ borderTop: '1px solid rgba(0,212,116,0.08)' }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#00d474' }}
            >
              Localisation
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Calibrated for Swedish
              <br />
              medical education
            </h2>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#a8d5ba' }}>
              Clinical content follows EU and Swedish conventions throughout — ESC guideline
              thresholds, FASS drug naming, SI units, and Socialstyrelsen advisories.
              Not a generic medical AI adapted for Sweden. Built for it.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {sources.map((s) => (
              <div
                key={s}
                className="px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid rgba(0,212,116,0.2)',
                  backgroundColor: 'rgba(0,212,116,0.04)',
                  color: '#a8d5ba',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative z-10 px-4 py-36"
        style={{ borderTop: '1px solid rgba(0,212,116,0.08)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,116,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Start learning with
            <br />
            Guru, <span style={{ color: '#00d474' }}>M.D.</span>
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: '#a8d5ba' }}>
            Join medical students studying with AI-powered, evidence-based tools built for
            EU clinical practice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:brightness-110"
              style={{
                backgroundColor: '#00d474',
                color: '#020a05',
                boxShadow: '0 0 36px rgba(0,212,116,0.4)',
              }}
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:text-white"
              style={{
                border: '1px solid rgba(0,212,116,0.25)',
                color: '#a8d5ba',
              }}
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm" style={{ color: '#3d6b52' }}>
            EU/Swedish medical guidelines · Student mode · English
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 px-6 lg:px-12 py-8"
        style={{ borderTop: '1px solid rgba(0,212,116,0.08)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GuruLogo size={22} />
            <span className="text-sm" style={{ color: '#3d6b52' }}>
              Guru, M.D. — AI Health Education
            </span>
          </div>
          <p className="text-xs" style={{ color: '#3d6b52' }}>
            Built with Claude Sonnet 4.6 · Next.js · Supabase · Vercel
          </p>
        </div>
      </footer>
    </div>
  )
}
