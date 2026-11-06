import React, { useState } from 'react';
import { InterviewConfig } from '../types';
import { Settings, Save, CheckCircle2, Briefcase, FileText, Building2 } from 'lucide-react';

interface SettingsViewProps {
  config: InterviewConfig;
  onUpdateConfig: (newConfig: InterviewConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  const [formData, setFormData] = useState<InterviewConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Interview Configuration
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Role & Resume Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your target job title, company, job description, and resume context so the AI Copilot provides hyper-tailored prompts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Target Job Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Senior Software Engineer / Staff ML Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Google, Stripe, OpenAI"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Job Description (Paste JD)
          </label>
          <textarea
            rows={4}
            value={formData.jobDescription}
            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="Paste the job description requirements here..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" /> Candidate Resume Summary / Key Highlights
          </label>
          <textarea
            rows={4}
            value={formData.resume}
            onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            placeholder="Summarize your core achievements, tech stack, and experience..."
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {saved ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully!
            </div>
          ) : <div />}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
