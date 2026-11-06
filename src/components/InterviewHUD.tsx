import React, { useState } from 'react';
import { SuggestedAnswer, SentimentData, PacingData, TranscriptItem, InterviewConfig } from '../types';
import { Sparkles, Sliders, Minimize2, Maximize2, Copy, Check, AlertTriangle, ArrowRight, Activity, Zap, Database, Quote } from 'lucide-react';

interface InterviewHUDProps {
  config: InterviewConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenRAGSetup?: () => void;
}

export const InterviewHUD: React.FC<InterviewHUDProps> = ({ config, isOpen, onClose, onOpenRAGSetup }) => {
  const [opacity, setOpacity] = useState<number>(95);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      id: '1',
      speaker: 'Interviewer',
      text: "Tell me about a time you had to lead a complex technical project under tight deadlines.",
      timestamp: '10:14 AM'
    }
  ]);
  const [latestQuestion, setLatestQuestion] = useState<string>("Tell me about a time you had to lead a complex technical project under tight deadlines.");
  const [customInput, setCustomInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [retrievedCitations, setRetrievedCitations] = useState<string[]>([
    "Resume: Led the zero-downtime migration of checkout pipeline handling $14M daily transaction volume under a 3-week deadline.",
    "JD Requirement: 5+ years building highly reliable distributed systems with low-latency APIs and event queues."
  ]);

  const [suggestions, setSuggestions] = useState<SuggestedAnswer[]>([
    {
      title: "STAR Method Approach (Recommended)",
      headlineScript: "At FinTech Corp, our core payment pipeline faced severe latency spikes risking $14M daily transactions, and we had a strict 3-week hard deadline to migrate...",
      bulletPoints: [
        "Situation: High-volume checkout API experiencing 320ms p99 latency spikes under peak load.",
        "Task: Spearheaded an urgent cross-functional migration to a Redis-cached, event-driven pipeline.",
        "Action: Built distributed idempotency safeguards and blue-green canary deployment gates.",
        "Result: Dropped latency by 73% (down to 85ms) with zero customer downtime during rollout."
      ]
    },
    {
      title: "Direct & Concise Answer",
      headlineScript: "I tackle high-pressure deadlines by establishing immediate architectural guardrails and unblocking team bottlenecks early.",
      bulletPoints: [
        "Align technical stakeholders on MVP scope within first 24 hours.",
        "Implement automated CI/CD canary verification to prevent regressions.",
        "Communicate transparent async status reports with clear dependency paths."
      ]
    },
    {
      title: "Technical Deep Dive",
      headlineScript: "We leveraged distributed Redis clusters and idempotent async workers to maintain strict transaction atomicity.",
      bulletPoints: [
        "Engineered distributed locking patterns to prevent duplicate card charges.",
        "Configured circuit breakers to gracefully isolate downstream provider failures.",
        "Achieved 99.999% availability during peak transaction spikes."
      ]
    }
  ]);

  const [sentiment, setSentiment] = useState<SentimentData>({
    score: 88,
    label: 'Confident',
    advice: "Strong, assertive tone. Your pacing matches leadership cadence."
  });

  const [pacing, setPacing] = useState<PacingData>({
    wpm: 138,
    fillerWordsDetected: ['um'],
    critique: "Excellent pacing. Natural pause between key metrics."
  });

  const fetchAIResponse = async (questionText: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: questionText,
          role: config.role,
          jobDescription: config.jobDescription,
          resume: config.resume,
          history: transcript
        })
      });
      const data = await res.json();
      if (data.suggestedAnswers) {
        setSuggestions(data.suggestedAnswers);
      }
      if (data.sentiment) {
        setSentiment(data.sentiment);
      }
      if (data.pacing) {
        setPacing(data.pacing);
      }
      if (data.retrievedCitations && data.retrievedCitations.length > 0) {
        setRetrievedCitations(data.retrievedCitations);
      }
    } catch (err) {
      console.error('Failed to fetch AI prompt guidance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateQuestion = (question: string) => {
    const newItem: TranscriptItem = {
      id: Date.now().toString(),
      speaker: 'Interviewer',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...transcript, newItem];
    setTranscript(updated);
    setLatestQuestion(question);
    fetchAIResponse(question);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    handleSimulateQuestion(customInput.trim());
    setCustomInput('');
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ opacity: opacity / 100 }}
      className={`fixed top-16 right-4 left-4 md:left-auto md:w-[700px] z-50 transition-all duration-200 bg-slate-900/95 backdrop-blur-2xl border border-pink-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            interview<span className="text-pink-400">Gurl</span> Live HUD
          </span>
          <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2 hidden sm:inline">
            {config.role} @ {config.companyName || 'Target Corp'}
          </span>
          {config.isRAGIndexed && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
              <Database className="w-3 h-3" /> RAG Grounded
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Opacity slider */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5" />
            <input
              type="range"
              min="55"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-16 accent-pink-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono">{opacity}%</span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isMinimized ? "Expand HUD" : "Minimize HUD"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-sm font-semibold rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col max-h-[82vh] overflow-y-auto">
          {/* Live Sentiment & Pacing Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-slate-400 text-[10px]">Sentiment Tone</p>
                <p className="font-semibold text-emerald-300">{sentiment.label} ({sentiment.score}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-slate-400 text-[10px]">Speaking Pace</p>
                <p className="font-semibold text-cyan-300">{pacing.wpm} WPM</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-slate-400 text-[10px]">Filler Words</p>
                <p className="font-semibold text-amber-300">
                  {pacing.fillerWordsDetected.length > 0 ? pacing.fillerWordsDetected.join(', ') : 'None detected'}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Question Highlight */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Interviewer Question Detected
              </span>
              <span className="text-[11px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md font-mono">
                Real-Time Latency: 0.08s
              </span>
            </div>
            <p className="text-sm font-medium text-white italic">
              "{latestQuestion}"
            </p>
          </div>

          {/* Retrieved RAG Citations (Personalized from candidate's resume/JD) */}
          {retrievedCitations.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Database className="w-3 h-3" /> Retrieved from Resume & JD (RAG Match):
                </span>
                {onOpenRAGSetup && (
                  <button
                    onClick={onOpenRAGSetup}
                    className="text-slate-400 hover:text-white underline text-[10px]"
                  >
                    Manage RAG
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {retrievedCitations.map((citation, i) => (
                  <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 font-sans">
                    <Quote className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{citation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Response Suggestions (Teleprompter) */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Best Response Suggestions (Teleprompter)
              </h3>
              {loading && <span className="text-xs text-pink-400 animate-pulse">Generating prompt from RAG...</span>}
            </div>

            <div className="space-y-3">
              {suggestions.map((ans, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-pink-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-pink-400">
                      {ans.title}
                    </span>
                    <button
                      onClick={() => handleCopy(ans.headlineScript + ' ' + ans.bulletPoints.join(' '), idx)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-pink-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === idx ? 'Copied' : 'Copy Script'}
                    </button>
                  </div>

                  <p className="text-sm text-white font-medium mb-2.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    "{ans.headlineScript}"
                  </p>

                  <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc">
                    {ans.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>

                  {ans.codeSnippet && (
                    <pre className="mt-2.5 p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 overflow-x-auto">
                      {ans.codeSnippet}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Input Bar */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800">
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Simulate interviewer asking another question..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-emerald-400 hover:from-pink-400 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                Prompt AI <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Sample Questions */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Instant Test:</span>
              {[
                "Tell me about a time you optimized a slow system.",
                "How do you handle disagreement with a tech lead?",
                "Why are you the best fit for this specific position?"
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSimulateQuestion(q)}
                  className="text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg whitespace-nowrap border border-slate-700/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
