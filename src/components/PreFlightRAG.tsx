import React, { useState } from 'react';
import { InterviewConfig } from '../types';
import { Database, FileText, Upload, Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck, Layers, RefreshCw } from 'lucide-react';

interface PreFlightRAGProps {
  config: InterviewConfig;
  onUpdateConfig: (config: InterviewConfig) => void;
  onLaunchHUD: () => void;
}

export const PreFlightRAG: React.FC<PreFlightRAGProps> = ({ config, onUpdateConfig, onLaunchHUD }) => {
  const [role, setRole] = useState(config.role);
  const [company, setCompany] = useState(config.companyName);
  const [jobDescription, setJobDescription] = useState(config.jobDescription);
  const [resume, setResume] = useState(config.resume);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (target === 'resume') {
        setResume(text);
      } else {
        setJobDescription(text);
      }
    };
    reader.readAsText(file);
  };

  const loadSamplePreset = (preset: 'senior_swe' | 'staff_ai' | 'lead_pm') => {
    if (preset === 'senior_swe') {
      setRole('Senior Full-Stack & Systems Engineer');
      setCompany('Stripe');
      setJobDescription(`Role Overview:
We are looking for a Senior Software Engineer to design, scale, and maintain our global payment rails.
Requirements:
- 5+ years building highly reliable distributed systems in Go, TypeScript, or Node.js.
- Strong experience with low-latency APIs, event-driven queues (Kafka/RabbitMQ), and SQL/Postgres.
- Proven track record leading major architectural migrations with zero downtime.
- Experience with payment gateways, security protocols (PCI-DSS), and circuit-breaker patterns.`);
      setResume(`Summary:
Senior Software Engineer with 6 years experience architecting resilient financial infrastructure.

Experience:
- Staff Systems Engineer at FinTech Corp (2022 - Present):
  * Led the zero-downtime migration of core checkout pipeline handling $14M daily transaction volume.
  * Reduced API p99 latency from 320ms to 85ms using Redis cluster caching and async batch workers.
  * Architected idempotency layer preventing duplicate card charges during network blips.
- Senior Backend Engineer at CloudScale (2019 - 2022):
  * Rebuilt auth microservice using TypeScript, Docker, and Kubernetes with 99.999% uptime.
  * Mentored 4 engineers and established automated canary deployment gates.

Skills: TypeScript, Node.js, Go, Distributed Systems, Redis, PostgreSQL, AWS, Kafka, System Design.`);
    } else if (preset === 'staff_ai') {
      setRole('Staff AI / ML Engineer');
      setCompany('Anthropic');
      setJobDescription(`Staff ML Engineer needed to build generative AI evaluation frameworks and low-latency inference pipelines.
Requirements: Python, PyTorch, LLM fine-tuning, RAG architecture, distributed inference optimization.`);
      setResume(`Staff AI Engineer with 7 years experience in deep learning, vector databases, and real-time LLM inference.
Built high-throughput RAG systems processing 20M queries daily with sub-200ms latency.`);
    } else {
      setRole('Lead Product Manager');
      setCompany('Google');
      setJobDescription(`Seeking Lead PM to spearhead real-time collaboration products used by millions worldwide.`);
      setResume(`Lead PM with 8 years taking enterprise communication products from 0 to $50M ARR.`);
    }
  };

  const handleIndexRAG = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      alert('Please provide both the Job Description and Resume before building the RAG index.');
      return;
    }

    setIsIndexing(true);
    setIndexProgress('Extracting semantic chunks from Resume & Job Description...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setIndexProgress('Vectorizing skills, achievements, and technical requirements...');
      await new Promise((r) => setTimeout(r, 450));
      setIndexProgress('Synthesizing cross-references for ultra-low latency response lookup...');

      const res = await fetch('/api/rag/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          company,
          jobDescription,
          resume,
        }),
      });

      const data = await res.json();

      onUpdateConfig({
        role,
        companyName: company,
        jobDescription,
        resume,
        isRAGIndexed: true,
        indexedAt: Date.now(),
        ragStats: data.stats,
      });

      setIndexProgress('RAG Indexing complete! Teleprompter is primed for live calls.');
    } catch (err) {
      console.error('Failed to index RAG knowledge base:', err);
      alert('Error building RAG index. Please verify your input.');
    } finally {
      setIsIndexing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" /> Pre-Flight RAG Indexing Hub
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Ground interviewGurl with Your Resume & Job Description
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Index your exact career achievements, metrics, and target job requirements into our low-latency in-memory RAG store before launching the HUD. During the live call, interviewGurl will instantly retrieve your real experiences in &lt;100ms.
            </p>
          </div>

          {config.isRAGIndexed && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col items-start gap-2 shrink-0">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> RAG Knowledge Base Active
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {config.ragStats?.totalChunks || 8} chunks indexed · Sub-second recall
              </p>
              <button
                onClick={onLaunchHUD}
                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-300 transition-colors"
              >
                Launch HUD Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-400">Load sample role & resume preset:</span>
          <button
            type="button"
            onClick={() => loadSamplePreset('senior_swe')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Senior Systems Engineer (Stripe)
          </button>
          <button
            type="button"
            onClick={() => loadSamplePreset('staff_ai')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Staff AI/ML Engineer (Anthropic)
          </button>
          <button
            type="button"
            onClick={() => loadSamplePreset('lead_pm')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 transition-colors"
          >
            Lead Product Manager (Google)
          </button>
        </div>
      </div>

      {/* Target Role & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300">Target Role Title</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300">Target Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            placeholder="e.g. Stripe, Google, Meta"
          />
        </div>
      </div>

      {/* Upload & Paste Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Description */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Target Job Description (JD)</h2>
            </div>
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg transition-colors border border-slate-700">
              <Upload className="w-3.5 h-3.5" /> Upload File (.txt, .md)
              <input
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'jd')}
              />
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Paste the job posting requirements, responsibilities, and expected technical competencies.
          </p>

          <textarea
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete Job Description here..."
            className="w-full flex-1 bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-none"
          />
        </div>

        {/* Candidate Resume */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Candidate Resume / CV</h2>
            </div>
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 rounded-lg transition-colors border border-slate-700">
              <Upload className="w-3.5 h-3.5" /> Upload File (.txt, .md)
              <input
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'resume')}
              />
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Paste your work history, projects, metrics, and core tech stack so the AI speaks directly to your background.
          </p>

          <textarea
            rows={10}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your Resume text here..."
            className="w-full flex-1 bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* Indexing Action Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">Low-Latency RAG Compilation</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-indexes documents into in-memory semantic vector chunks for sub-second live call answers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleIndexRAG}
            disabled={isIndexing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 whitespace-nowrap"
          >
            {isIndexing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Indexing RAG Store...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" /> Index Documents & Prime Copilot
              </>
            )}
          </button>
        </div>
      </div>

      {/* Index Progress / Feedback */}
      {indexProgress && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-emerald-300 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{indexProgress}</span>
        </div>
      )}

      {/* RAG Knowledge Base Preview */}
      {config.ragStats && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Indexed Knowledge Base Preview
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
              Ready for Real-Time HUD
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-white">{config.ragStats.totalChunks}</span>
              <p className="text-[11px] text-slate-400">Total Chunks</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-emerald-400">{config.ragStats.resumeChunks}</span>
              <p className="text-[11px] text-slate-400">Resume Stories</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-cyan-400">{config.ragStats.jdChunks}</span>
              <p className="text-[11px] text-slate-400">JD Requirements</p>
            </div>
          </div>

          {config.ragStats.extractedSkills.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Extracted Core Competencies & Keywords:</p>
              <div className="flex flex-wrap gap-1.5">
                {config.ragStats.extractedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
