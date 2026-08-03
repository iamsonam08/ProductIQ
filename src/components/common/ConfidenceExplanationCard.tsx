import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  ShieldCheck,
  Zap,
  Database,
  GitFork,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { ProductIntelligenceResult } from '../../types';

interface ConfidenceExplanationCardProps {
  result: ProductIntelligenceResult;
  className?: string;
}

export const ConfidenceExplanationCard: React.FC<ConfidenceExplanationCardProps> = ({
  result,
  className = ''
}) => {
  const { structuredData, validation, knowledgeGraph, retrievedRAGContext } = result;
  const overallConfidence = validation?.overallConfidence ?? 50;
  const isHighConfidence = overallConfidence >= 70;

  // Build high confidence positive reasoning points
  const positiveReasons: { text: string; subtext?: string }[] = [];

  if (structuredData?.name && structuredData.name !== 'N/A' && structuredData.name !== 'Unknown' && structuredData.name !== '') {
    positiveReasons.push({
      text: 'Product Name identified',
      subtext: `"${structuredData.name}"`
    });
  }

  if (structuredData?.material && structuredData.material !== 'N/A' && structuredData.material !== 'Unknown' && structuredData.material !== '') {
    positiveReasons.push({
      text: 'Material matched catalog',
      subtext: `Grade: ${structuredData.material}`
    });
  }

  if (structuredData?.pressure && structuredData.pressure !== 'N/A' && structuredData.pressure !== 'Unknown' && structuredData.pressure !== '') {
    positiveReasons.push({
      text: 'Pressure validated',
      subtext: `Rating: ${structuredData.pressure}`
    });
  }

  if (structuredData?.spec && structuredData.spec !== 'N/A' && structuredData.spec !== 'Unknown' && structuredData.spec !== '') {
    positiveReasons.push({
      text: 'Standard verified',
      subtext: `Code: ${structuredData.spec}`
    });
  }

  if (knowledgeGraph?.anomalies?.length === 0) {
    positiveReasons.push({
      text: 'Knowledge Graph validation passed',
      subtext: '0 physical constraint anomalies detected'
    });
  }

  if (retrievedRAGContext && retrievedRAGContext.length > 0) {
    const topMatch = retrievedRAGContext[0];
    positiveReasons.push({
      text: 'Retrieved from RAG Store',
      subtext: `Matched benchmark: "${topMatch.name}"`
    });

    if (topMatch.similarityScore >= 70) {
      positiveReasons.push({
        text: 'High similarity score',
        subtext: `${topMatch.similarityScore}% vector similarity match`
      });
    }
  }

  // Build low confidence negative uncertainty points
  const uncertaintyReasons: { text: string; subtext?: string }[] = [];

  if (!structuredData?.name || structuredData.name === 'N/A' || structuredData.name === 'Unknown' || structuredData.name === '' || (validation?.fields?.name?.score ?? 0) < 50) {
    uncertaintyReasons.push({
      text: 'Product Name unverified',
      subtext: 'Unable to confidently extract this field from the uploaded document.'
    });
  }

  if (!structuredData?.material || structuredData.material === 'N/A' || structuredData.material === 'Unknown' || structuredData.material === '' || (validation?.fields?.material?.score ?? 0) < 50) {
    uncertaintyReasons.push({
      text: 'Material grade unverified',
      subtext: 'Unable to confidently extract this field from the uploaded document.'
    });
  }

  if (!structuredData?.pressure || structuredData.pressure === 'N/A' || structuredData.pressure === 'Unknown' || structuredData.pressure === '' || (validation?.fields?.pressure?.score ?? 0) < 50) {
    uncertaintyReasons.push({
      text: 'Pressure rating unverified',
      subtext: 'Unable to confidently extract this field from the uploaded document.'
    });
  }

  if (!structuredData?.spec || structuredData.spec === 'N/A' || structuredData.spec === 'Unknown' || structuredData.spec === '' || (validation?.fields?.spec?.score ?? 0) < 50) {
    uncertaintyReasons.push({
      text: 'Standard code unverified',
      subtext: 'Unable to confidently extract this field from the uploaded document.'
    });
  }

  if (knowledgeGraph?.anomalies && knowledgeGraph.anomalies.length > 0) {
    uncertaintyReasons.push({
      text: 'Knowledge Graph rule violation',
      subtext: `${knowledgeGraph.anomalies.length} material/spec constraint anomalies flagged`
    });
  }

  if (!retrievedRAGContext || retrievedRAGContext.length === 0 || (retrievedRAGContext[0]?.similarityScore ?? 0) < 70) {
    uncertaintyReasons.push({
      text: 'Weak RAG match',
      subtext: 'Catalog similarity score is below high-confidence threshold'
    });
  }

  // Recommendations for improvement
  const recommendations = [
    'Ensure product name, grade (e.g. 316 SS), and pressure rating (e.g. Class 150) are explicitly stated in document.',
    'Upload a higher-resolution technical datasheet PDF or specification document.',
    'Include standard manufacturing codes such as ANSI B16.34, ASME B16.5, or API 6D.',
    'Use the Human-in-the-Loop editor below to review and manually confirm field entries.'
  ];

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-xl transition-all space-y-4 shadow-xl ${
        isHighConfidence
          ? 'bg-slate-900/90 border-teal-500/30 text-slate-100'
          : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
      } ${className}`}
    >
      {/* Header: Overall Score & Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isHighConfidence
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isHighConfidence ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                Overall Confidence
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  isHighConfidence
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {isHighConfidence ? 'High Confidence' : 'Low Confidence'}
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight flex items-baseline space-x-1.5">
              <span className={isHighConfidence ? 'text-teal-300' : 'text-amber-300'}>
                {overallConfidence}%
              </span>
              <span className="text-xs font-normal text-slate-400">
                {isHighConfidence ? 'Fully Grounded & Validated' : 'Uncertainty Detected'}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Progress Meter */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Score Gauge</span>
            <span className="font-bold text-white">{overallConfidence} / 100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighConfidence
                  ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-400'
                  : 'bg-gradient-to-r from-rose-500 via-amber-500 to-amber-400'
              }`}
              style={{ width: `${overallConfidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* High Confidence Reasoning Section */}
      {isHighConfidence && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-teal-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Reasoning & Validation Rationale</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {positiveReasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-teal-500/20 flex items-start space-x-2"
              >
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <div className="min-w-0">
                  <div className="font-bold text-slate-200">{reason.text}</div>
                  {reason.subtext && (
                    <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                      {reason.subtext}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Confidence Uncertainty Section */}
      {!isHighConfidence && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Reason for Uncertainty</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {uncertaintyReasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-start space-x-2"
              >
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <div className="min-w-0">
                  <div className="font-bold text-amber-200">{reason.text}</div>
                  {reason.subtext && (
                    <div className="text-[11px] text-amber-100/70 font-normal truncate mt-0.5">
                      {reason.subtext}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Box */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-indigo-300 font-mono font-bold">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Recommendations for Improving Extraction:</span>
        </div>

        <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed pl-1">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-teal-400 font-bold">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
