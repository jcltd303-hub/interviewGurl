import React, { useState } from 'react';
import { TabType, InterviewConfig } from './types';
import { Navbar } from './components/Navbar';
import { InterviewHUD } from './components/InterviewHUD';
import { PreFlightRAG } from './components/PreFlightRAG';
import { MockArena } from './components/MockArena';
import { QuestionBank } from './components/QuestionBank';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { Sparkles, Radio, MessageSquare, BookOpen, BarChart2, ShieldCheck, ArrowRight, Database, CheckCircle2, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('copilot');
  const [isHUDOpen, setIsHUDOpen] = useState<boolean>(true);
  const [config, setConfig] = useState<InterviewConfig>({
    role: 'Senior Full-Stack & Systems Engineer',
    companyName: 'Stripe',
    jobDescription: `We are looking for a Senior Software Engineer to design, scale, and maintain our global payment rails.
Requirements:
- 5+ years building highly reliable distributed systems in TypeScript, Go, or Node.js.
- Strong experience with low-latency APIs, event-driven queues (Kafka/RabbitMQ), and SQL/Postgres.
- Proven track record leading major architectural migrations with zero downtime.
- Experience with payment gateways, security protocols (PCI-DSS), and circuit-breaker patterns.`,
    resume: `Senior Software Engineer with 6 years experience architecting resilient financial infrastructure.
- Staff Systems Engineer at FinTech Corp (2022 - Present):
  * Led the zero-downtime migration of core checkout pipeline handling $14M daily transaction volume.
  * Reduced API p99 latency from 320ms to 85ms using Redis cluster caching and async batch workers.
  * Architected idempotency layer preventing duplicate card charges during network blips.
- Senior Backend Engineer at CloudScale (2019 - 2022):
  * Rebuilt auth microservice using TypeScript, Docker, and Kubernetes with 99.999% uptime.
Skills: TypeScript, Node.js, Go, Distributed Systems, Redis, PostgreSQL, AWS, Kafka, System Design.`,
    isRAGIndexed: true,
    indexedAt: Date.now(),
    ragStats: {
      totalChunks: 6,
      resumeChunks: 4,
      jdChunks: 2,
      extractedSkills: ['TypeScript', 'Node.js', 'Go', 'Distributed Systems', 'Redis', 'PostgreSQL', 'AWS', 'Kafka', 'System Design']
    }
  });

  const handleSelectQuestionFromBank = (questionTitle: string) => {
    setIsHUDOpen(true);
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchHUD={() => setIsHUDOpen(true)}
        isRAGIndexed={config.isRAGIndexed}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'copilot' && (
          <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Next-Gen Real-Time Interview Copilot
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Ace Every Live Call with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-emerald-400">interviewGurl</span>
                </h1>

                <p className="text-base text-slate-300 leading-relaxed">
                  The transparent floating HUD teleprompter for live video calls (Zoom, Google Meet, Microsoft Teams). Powered by pre-indexed RAG over your resume and job description, interviewGurl delivers instant STAR responses, live sentiment tracking, and pacing guidance with sub-second latency.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setIsHUDOpen(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-pink-400 to-emerald-400 hover:from-pink-300 hover:to-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-pink-500/20"
                  >
                    <ShieldCheck className="w-5 h-5" /> Launch Transparent HUD
                  </button>

                  <button
                    onClick={() => setActiveTab('rag')}
                    className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl transition-colors border border-slate-700"
                  >
                    <Database className="w-5 h-5 text-emerald-400" /> Pre-Flight RAG Indexer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RAG Readiness Callout Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Pre-Flight Knowledge Base (RAG) Grounding</h3>
                    {config.isRAGIndexed ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        Grounded & Active
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                        Not Indexed Yet
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Job Description & Resume are pre-indexed into semantic chunks for lower latency and deeply thoughtful responses.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('rag')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Configure RAG Documents</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Transparent HUD Teleprompter</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Seamlessly overlays your live interview window with adjustable opacity and auto-scroll teleprompter scripts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">RAG Grounded STAR Answers</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Retrieves specific achievements, metrics, and project anecdotes directly from your resume in &lt;100ms.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Live Sentiment & Pacing</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time sentiment score, speaking pace monitor (WPM), and filler word detection with tactical speech coaching.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rag' && (
          <PreFlightRAG
            config={config}
            onUpdateConfig={setConfig}
            onLaunchHUD={() => {
              setIsHUDOpen(true);
              setActiveTab('copilot');
            }}
          />
        )}
        {activeTab === 'mock' && <MockArena config={config} onLaunchHUD={() => setIsHUDOpen(true)} />}
        {activeTab === 'questions' && <QuestionBank config={config} onSelectQuestion={handleSelectQuestionFromBank} />}
        {activeTab === 'analytics' && <AnalyticsView config={config} />}
        {activeTab === 'settings' && <SettingsView config={config} onUpdateConfig={setConfig} />}
      </main>

      {/* Transparent Floating HUD Overlay */}
      <InterviewHUD
        config={config}
        isOpen={isHUDOpen}
        onClose={() => setIsHUDOpen(false)}
        onOpenRAGSetup={() => {
          setActiveTab('rag');
        }}
      />
    </div>
  );
}
