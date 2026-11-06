import React from 'react';
import { BarChart2, TrendingUp, Award, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { InterviewConfig } from '../types';

interface AnalyticsViewProps {
  config: InterviewConfig;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ config }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Performance Scorecard
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Interview Readiness Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive breakdown of your mock interview performance, pacing, tone confidence, and STAR method execution for {config.role}.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Overall Readiness</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">94<span className="text-emerald-400 text-lg">/100</span></div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last session
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Avg Pace (WPM)</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white">138 <span className="text-slate-400 text-sm">WPM</span></div>
          <p className="text-xs text-cyan-400 mt-1">Optimal conversational range</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Confidence Score</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">91<span className="text-purple-400 text-lg">%</span></div>
          <p className="text-xs text-purple-400 mt-1">Low filler word frequency</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">STAR Adherence</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">5/5</div>
          <p className="text-xs text-amber-400 mt-1">Structured responses used</p>
        </div>
      </div>

      {/* Detailed Skill Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Strengths</h3>
          <div className="space-y-3">
            {[
              "Exceptional clarity when explaining technical architectures.",
              "Consistent use of quantifiable metrics ($ volume, % latency reduction).",
              "Calm, steady vocal pacing under probing interview questions.",
              "Strong adherence to the STAR framework across behavioral queries."
            ].map((strength, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Areas for Improvement</h3>
          <div className="space-y-3">
            {[
              "Occasional use of filler words ('um', 'like') during open-ended questions.",
              "Consider pausing for 1.5 seconds after complex technical explanations to let interviewers digest.",
              "Expand slightly on trade-off analysis during system design questions."
            ].map((area, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
