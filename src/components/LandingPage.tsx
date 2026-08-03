import React from 'react';
import {
  Rocket,
  Lock,
  Sparkles,
  Zap,
  Database,
  GitFork,
  FileSearch,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenAdminAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDemo,
  onOpenAdminAuth,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Gradients & Glow Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-teal-500/15 via-indigo-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header / Brand Nav */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white flex items-center space-x-1.5">
              <span>Product</span>
              <span className="text-teal-400">IQ</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono">Commerce-Ready AI Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onStartDemo}
            className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-teal-300 border border-teal-500/30 transition-all flex items-center space-x-1.5"
          >
            <Rocket className="w-3.5 h-3.5 text-teal-400" />
            <span>Launch Instant Demo</span>
          </button>
          <button
            onClick={onOpenAdminAuth}
            className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40 transition-all flex items-center space-x-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Sign In</span>
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center space-y-10 my-auto">
        
        {/* Hackathon Judge Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-xs text-teal-300 font-mono shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Hackathon Demo Experience • No Account Required</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[10px] font-bold text-teal-200">
            Instant Access
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Product<span className="text-teal-400">IQ</span>
          </h1>
          <p className="text-lg sm:text-2xl font-semibold text-teal-200 tracking-tight">
            AI-Powered Product Intelligence Platform
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn messy, unformatted industrial equipment specs into structured, validated, and commerce-ready intelligence using Gemini 3.6 Flash, RAG Vector Search, and Knowledge Graphs.
          </p>
        </div>

        {/* Two Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* Try Demo Button */}
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-8 py-4 min-h-[56px] rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
          >
            <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>🚀 Try Demo Mode</span>
            <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Admin Login Button */}
          <button
            onClick={onOpenAdminAuth}
            className="w-full sm:w-auto px-8 py-4 min-h-[56px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base shadow-lg hover:border-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group"
          >
            <Lock className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>🔐 Admin Login</span>
          </button>

        </div>

        {/* Instant Access Guarantee */}
        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 font-mono pt-2">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Registration</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Email Required</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sample Catalog Preloaded</span>
          </span>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 text-left">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 backdrop-blur-md">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Single & Batch Extractor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract structured metadata (material, size, rating, standard) with confidence scoring from messy raw text or spec sheets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 backdrop-blur-md">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">RAG Catalog Vector Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ground structured data against indexed catalog items using cosine similarity embeddings for exact reference matching.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 backdrop-blur-md">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Knowledge Graph Validation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validate physical anomalies (e.g. PVC high pressure limits) against material physics rules before catalog ingestion.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>ProductIQ • Powered by Gemini 3.6 Flash & Firebase Authentication</p>
      </footer>

    </div>
  );
};
