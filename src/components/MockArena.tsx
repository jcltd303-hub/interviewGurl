import React, { useState } from 'react';
import { InterviewConfig, TranscriptItem } from '../types';
import { Mic, MicOff, Send, Sparkles, User, Bot, Play, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MockArenaProps {
  config: InterviewConfig;
  onLaunchHUD: () => void;
}

export const MockArena: React.FC<MockArenaProps> = ({ config, onLaunchHUD }) => {
  const [messages, setMessages] = useState<TranscriptItem[]>([
    {
      id: '1',
      speaker: 'Interviewer',
      text: `Hello! Welcome to your mock interview for the ${config.role} position at ${config.companyName || 'Top Tech Corp'}. Let's start with a brief introduction. Can you walk me through your background and why you're interested in this role?`,
      timestamp: '10:00 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg: TranscriptItem = {
      id: Date.now().toString(),
      speaker: 'You',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/interview/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          role: config.role,
          history: updatedMessages
        })
      });
      const data = await res.json();

      const aiMsg: TranscriptItem = {
        id: (Date.now() + 1).toString(),
        speaker: 'Interviewer',
        text: data.reply || "Thank you for that response. Let's dive deeper into your technical experience.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedMessages, aiMsg]);
    } catch (err) {
      console.error('Error in mock interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        speaker: 'Interviewer',
        text: `Hello! Welcome to your mock interview for the ${config.role} position at ${config.companyName || 'Top Tech Corp'}. Let's start with a brief introduction. Can you walk me through your background and why you're interested in this role?`,
        timestamp: '10:00 AM'
      }
    ]);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Mock Interview Arena
            </span>
            <span className="text-xs text-slate-400">· Target: {config.role}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Practice Live with AI Hiring Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test your answers, practice your pacing, and launch the Live HUD Overlay simultaneously to experience real-time prompting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchHUD}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-400 to-emerald-400 hover:from-pink-300 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-pink-500/20"
          >
            <ShieldCheck className="w-4 h-4" /> Launch HUD Overlay
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>

      {/* Chat Transcript Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[520px]">
        {/* Transcript Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Live Interview Transcript</span>
          </div>
          <span className="text-xs text-slate-500">{messages.length} exchanges</span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.speaker === 'You' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.speaker === 'You' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {m.speaker === 'You' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl p-4 rounded-2xl text-sm ${
                m.speaker === 'You'
                  ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-100 rounded-tr-none'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="text-xs font-semibold text-slate-400">{m.speaker}</span>
                  <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                </div>
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                Interviewer is evaluating your response...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response to the interviewer (or speak using your microphone)..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-md shadow-emerald-500/20"
            >
              <span>Send Answer</span> <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
