import React from 'react';
import { X, FileSearch, Database, Cpu, ShieldCheck, GitFork, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Document Intelligence & Multimodal OCR',
      icon: FileSearch,
      color: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
      description: 'Handles raw PDF spec sheets, catalog image scans, or messy unstructured text input.',
      details: 'Converts binary images/PDFs into machine-readable text using Gemini Flash multimodal vision OCR, extracting verbatim technical details.'
    },
    {
      num: '02',
      title: 'RAG Retrieval Grounding',
      icon: Database,
      color: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
      description: 'Retrieves top verified benchmark products from the Reference Database to ground the model.',
      details: 'Calculates domain similarity scores (0-100%) against verified industrial catalog records. Feeding these benchmark items to Gemini reduces LLM hallucinations.'
    },
    {
      num: '03',
      title: 'Structured JSON Schema Extraction',
      icon: Cpu,
      color: 'text-teal-300 bg-teal-500/10 border-teal-500/30',
      description: 'Parses unstructured descriptions into standard commerce JSON attributes.',
      details: 'Enforces a strict schema for 6 core industrial fields: Name, Category, Material, Size, Pressure Class, and Specification Standard.'
    },
    {
      num: '04',
      title: 'Dual-Pass AI Confidence Audit',
      icon: ShieldCheck,
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
      description: 'Evaluates extraction accuracy field-by-field with traceable proof.',
      details: 'Assigns 0-100% confidence scores and 1-line source justifications per field. Any field with <50% confidence is flagged for Human Review.'
    },
    {
      num: '05',
      title: 'Knowledge Graph Constraint Verification',
      icon: GitFork,
      color: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
      description: 'Cross-checks extracted data against physical industrial rules & material limits.',
      details: 'Detects impossible combinations (e.g., PVC material assigned Class 1500 rating or ASME B16.5 flange spec on a pump) and flags physical anomalies.'
    },
    {
      num: '06',
      title: 'Human-In-The-Loop (HITL) Finalizer',
      icon: UserCheck,
      color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
      description: 'Allows domain engineers to review flagged fields, make edits, and approve records.',
      details: 'Highlighted low-confidence or graph-anomaly fields can be manually corrected and verified before exporting to production databases or CSV.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-teal-500/10 text-teal-300 border border-teal-500/30">
                INDUSTRIAL PIPELINE ARCHITECTURE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-white">How the Product Intelligence Pipeline Works</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
              An end-to-end overview of how raw technical documents become structured, validated product data.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s) => {
            const IconComp = s.icon;
            return (
              <div
                key={s.num}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/[0.07] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-lg border ${s.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-medium text-slate-400">STAGE {s.num}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Active Engine</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mt-3">{s.title}</h3>
                  <p className="text-xs text-slate-300 font-normal mt-1">{s.description}</p>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/10 font-normal">
                    {s.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow Summary Footer */}
        <div className="mt-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200 gap-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-normal">Zero Hallucination Grounding + Automated Physical Anomaly Detection</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-500/80 hover:bg-teal-400 text-slate-950 font-medium transition-all shrink-0 shadow-lg hover:shadow-teal-500/20"
          >
            Got It! Explore App
          </button>
        </div>

      </div>
    </div>
  );
};
