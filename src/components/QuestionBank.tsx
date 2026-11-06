import React, { useState } from 'react';
import { Search, BookOpen, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { InterviewConfig } from '../types';

interface QuestionBankProps {
  config: InterviewConfig;
  onSelectQuestion: (q: string) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ config, onSelectQuestion }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Behavioral', 'System Design', 'Coding & Technical', 'Leadership'];

  const questions = [
    {
      category: 'Behavioral',
      title: 'Tell me about a time you had a conflict with a team member.',
      difficulty: 'Medium',
      starGuide: {
        situation: 'Disagreed on architectural direction for a microservices migration.',
        task: 'Resolve the deadlock without impacting Q3 release timeline.',
        action: 'Organized a structured tradeoff matrix and benchmarked both approaches.',
        result: 'Adopted a hybrid pattern that reduced latency by 30% and improved team cohesion.'
      }
    },
    {
      category: 'Behavioral',
      title: 'Describe a project where you failed and what you learned.',
      difficulty: 'Hard',
      starGuide: {
        situation: 'Shipped a caching update without adequate load testing.',
        task: 'Identified latency spikes in production within 15 minutes of release.',
        action: 'Rolled back immediately, instituted automated canary testing and synthetic monitoring.',
        result: 'Zero recurrence of unverified deployments over the subsequent 18 months.'
      }
    },
    {
      category: 'System Design',
      title: 'Design a globally distributed real-time chat notification system.',
      difficulty: 'Hard',
      starGuide: {
        situation: 'Scaling to 10M concurrent users with sub-50ms latency requirements.',
        task: 'Architect a fault-tolerant WebSocket cluster with automatic reconnection.',
        action: 'Utilized Redis pub/sub with stateless Node.js gateway nodes and Cassandra storage.',
        result: 'Successfully handled peak traffic spikes during major live events with 99.999% reliability.'
      }
    },
    {
      category: 'Coding & Technical',
      title: 'Explain how you approach optimizing slow database queries.',
      difficulty: 'Medium',
      starGuide: {
        situation: 'An analytics dashboard query was taking over 8 seconds to load.',
        task: 'Optimize query execution time below 200ms.',
        action: 'Analyzed query plan, added composite indexes, and denormalized cold aggregates.',
        result: 'Reduced query latency from 8.2s to 140ms, lowering server CPU utilization by 40%.'
      }
    },
    {
      category: 'Leadership',
      title: 'How do you mentor junior engineers and handle underperformance?',
      difficulty: 'Medium',
      starGuide: {
        situation: 'A junior developer struggled with code quality and delivery deadlines.',
        task: 'Provide constructive support and foster technical growth.',
        action: 'Paired weekly, established clear acceptance criteria, and encouraged smaller PR slices.',
        result: 'Engineer successfully promoted within 12 months and now independently leads features.'
      }
    }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Curated Question Bank
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Top Interview Questions & STAR Frameworks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Master high-frequency behavioral and technical questions tailored for {config.role}.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {q.category}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {q.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {q.title}
                </h3>
              </div>

              <button
                onClick={() => onSelectQuestion(q.title)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Use in Copilot HUD</span> <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* STAR Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Situation</span>
                <p className="text-xs text-slate-300 mt-1">{q.starGuide.situation}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Task</span>
                <p className="text-xs text-slate-300 mt-1">{q.starGuide.task}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Action</span>
                <p className="text-xs text-slate-300 mt-1">{q.starGuide.action}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Result</span>
                <p className="text-xs text-slate-300 mt-1">{q.starGuide.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
