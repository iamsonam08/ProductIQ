import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  FileText,
  Sparkles,
  GitFork,
  Database,
  ShieldCheck,
  Zap,
  Clock,
  Activity
} from 'lucide-react';

export interface AIProcessingStage {
  id: number;
  name: string;
  subtext: string;
  icon: React.ElementType;
}

export const WORKFLOW_STAGES: AIProcessingStage[] = [
  {
    id: 1,
    name: 'Uploading PDF...',
    subtext: 'Ingesting file stream and document structure',
    icon: FileText
  },
  {
    id: 2,
    name: 'Extracting text...',
    subtext: 'Executing Gemini Vision OCR on layout and specification tables',
    icon: Cpu
  },
  {
    id: 3,
    name: 'Generating structured JSON...',
    subtext: 'Extracting product name, category, material, size, pressure rating, and specs',
    icon: Sparkles
  },
  {
    id: 4,
    name: 'Creating embeddings...',
    subtext: 'Generating 1536-dim semantic vector representations for chunked text',
    icon: Database
  },
  {
    id: 5,
    name: 'Updating Knowledge Graph...',
    subtext: 'Mapping ontology nodes, material properties, and engineering standards',
    icon: GitFork
  },
  {
    id: 6,
    name: 'Indexing products...',
    subtext: 'Storing vector embeddings and metadata in persistent RAG store',
    icon: ShieldCheck
  },
  {
    id: 7,
    name: 'Completed ✓',
    subtext: 'Product intelligence dataset fully validated & indexed',
    icon: CheckCircle2
  }
];

interface AIProcessingWorkflowProps {
  isProcessing: boolean;
  onComplete?: () => void;
  documentName?: string;
  className?: string;
}

export const AIProcessingWorkflow: React.FC<AIProcessingWorkflowProps> = ({
  isProcessing,
  onComplete,
  documentName,
  className = ''
}) => {
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const totalStages = WORKFLOW_STAGES.length;

  // Timer & Stage Progression
  useEffect(() => {
    if (!isProcessing) {
      // Reset when not processing
      setCurrentStageId(1);
      setElapsedMs(0);
      return;
    }

    const startTime = Date.now();
    setCurrentStageId(1);

    // Timer for elapsed time display
    const timerInterval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    // Stage advance interval (advances stages 1 -> 7 over ~3.5s)
    const stageInterval = setInterval(() => {
      setCurrentStageId((prev) => {
        if (prev < 7) {
          return prev + 1;
        }
        return prev; // hold at 7 until isProcessing becomes false
      });
    }, 500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(stageInterval);
    };
  }, [isProcessing]);

  // When isProcessing finishes, trigger final stage 8 "Completed"
  useEffect(() => {
    if (!isProcessing && elapsedMs > 0) {
      setCurrentStageId(8);
      if (onComplete) {
        const timeout = setTimeout(() => {
          onComplete();
        }, 600);
        return () => clearTimeout(timeout);
      }
    }
  }, [isProcessing, elapsedMs, onComplete]);

  // Calculate overall percentage
  const progressPercent = Math.min(
    100,
    Math.round(((currentStageId - 1) / (totalStages - 1)) * 100)
  );

  // Estimate remaining time based on stage
  const estimatedTotalMs = 3800; // ~3.8 seconds target
  const remainingMs = Math.max(0, estimatedTotalMs - elapsedMs);
  const formattedElapsed = (elapsedMs / 1000).toFixed(1);
  const formattedRemaining = (remainingMs / 1000).toFixed(1);

  const activeStageObj = WORKFLOW_STAGES.find((s) => s.id === currentStageId) || WORKFLOW_STAGES[0];

  return (
    <div className={`p-6 sm:p-7 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-teal-500/30 shadow-2xl space-y-6 relative overflow-hidden ${className}`}>
      
      {/* Top Animated Pulse Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-400 animate-pulse" />

      {/* Workflow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Activity className="w-4 h-4 animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              AI Intelligence Pipeline Workflow
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            {documentName ? `Processing file: "${documentName}"` : 'Executing multi-stage extraction, grounding & graph validation'}
          </p>
        </div>

        {/* Time Estimate Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="text-slate-300">Elapsed: <strong className="text-teal-300">{formattedElapsed}s</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Est. remaining: <strong className="text-indigo-300">{formattedRemaining}s</strong></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Stage {currentStageId} of {totalStages}: {activeStageObj.name}</span>
          </span>
          <span className="text-teal-400 font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 8 Processing Stages Timeline */}
      <div className="space-y-2.5 pt-1">
        {WORKFLOW_STAGES.map((stage) => {
          const isDone = stage.id < currentStageId;
          const isCurrent = stage.id === currentStageId;
          const isPending = stage.id > currentStageId;
          const StageIcon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : isCurrent
                  ? 'bg-teal-500/10 border-teal-500/50 text-white shadow-lg shadow-teal-950'
                  : 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Status Indicator Icon */}
                <div className="shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-slate-600 flex items-center justify-center border border-slate-800 text-[10px] font-mono">
                      {stage.id}
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className="truncate">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold truncate ${isDone ? 'text-emerald-300' : isCurrent ? 'text-teal-200' : 'text-slate-400'}`}>
                      Stage {stage.id}: {stage.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                    {stage.subtext}
                  </p>
                </div>
              </div>

              {/* Stage Type Icon */}
              <div className="shrink-0 ml-3">
                <StageIcon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-teal-300' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Detail Footer Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-300 truncate">
          <Zap className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="truncate">
            Currently executing: <strong className="text-white">{activeStageObj.name}</strong>
          </span>
        </div>
        <span className="text-[10px] text-teal-400 font-bold shrink-0 ml-2">
          {isProcessing ? 'AI ACTIVE' : 'FINALIZING'}
        </span>
      </div>

    </div>
  );
};
