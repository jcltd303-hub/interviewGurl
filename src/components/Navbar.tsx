import React from 'react';
import { TabType } from '../types';
import { Sparkles, Radio, Database, MessageSquare, BookOpen, BarChart2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLaunchHUD: () => void;
  isRAGIndexed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLaunchHUD, isRAGIndexed }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-4 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('copilot')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          interview<span className="text-pink-400">Gurl</span><span className="text-emerald-400 text-xs font-mono ml-1">.ai</span>
        </span>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'copilot' ? 'text-pink-400 font-semibold' : 'hover:text-white'}`}
        >
          <Radio className="w-4 h-4" /> Live Copilot
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'rag' ? 'text-pink-400 font-semibold' : 'hover:text-white'}`}
        >
          <Database className="w-4 h-4" /> Pre-Flight RAG
          {isRAGIndexed && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="RAG Indexed" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('mock')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'mock' ? 'text-pink-400 font-semibold' : 'hover:text-white'}`}
        >
          <MessageSquare className="w-4 h-4" /> Mock Arena
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'questions' ? 'text-pink-400 font-semibold' : 'hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" /> Question Bank
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'analytics' ? 'text-pink-400 font-semibold' : 'hover:text-white'}`}
        >
          <BarChart2 className="w-4 h-4" /> Scorecard
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onLaunchHUD}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-pink-400 to-emerald-400 hover:from-pink-300 hover:to-emerald-300 rounded-lg transition-all shadow-md shadow-pink-500/20 whitespace-nowrap shrink-0"
        >
          <ShieldCheck className="w-4 h-4" /> Launch HUD Overlay
        </button>
      </div>
    </header>
  );
};
