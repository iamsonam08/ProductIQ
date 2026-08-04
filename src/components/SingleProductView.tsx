import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Database,
  ShieldCheck,
  AlertTriangle,
  GitFork,
  CheckCircle2,
  RefreshCw,
  Info,
  FileCode,
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  MessageSquare,
  FileDown
} from 'lucide-react';
import { ProductIntelligenceResult, StructuredProductData } from '../types';
import { SAMPLE_PRODUCT_INPUTS, SampleProductInput } from '../data/samplePrompts';
import { EnterpriseAlert } from './common/EnterpriseAlert';
import { ERROR_CATALOG, parseErrorToCatalog, CatalogErrorDetails } from '../lib/errorCatalog';
import { ConfidenceExplanationCard } from './common/ConfidenceExplanationCard';
import { apiFetch } from '../lib/api';

interface SingleProductViewProps {
  onAskAboutProduct?: (productName: string) => void;
}

export const SingleProductView: React.FC<SingleProductViewProps> = ({ onAskAboutProduct }) => {
  const [rawInputText, setRawInputText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<'idle' | 'upload' | 'extract' | 'validate' | 'kg' | 'ready'>('idle');
  const [stepLabel, setStepLabel] = useState<string>('');
  const [result, setResult] = useState<ProductIntelligenceResult | null>(null);
  const [errorState, setErrorState] = useState<CatalogErrorDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'extracted' | 'rag' | 'knowledgeGraph' | 'rawText'>('extracted');
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');

  // Human in the loop state
  const [editableData, setEditableData] = useState<StructuredProductData | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorState(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'txt', 'csv'];

    if (!allowedExts.includes(ext)) {
      setErrorState({
        ...ERROR_CATALOG.UNSUPPORTED_FILE,
        message: `File '${file.name}' with extension .${ext} is not supported.`
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorState(ERROR_CATALOG.INVALID_PDF);
    };

    reader.onload = () => {
      const base64Str = reader.result as string;
      setSelectedFile({
        name: file.name,
        type: file.type,
        base64: base64Str
      });

      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        try {
          setRawInputText(atob(base64Str.split(',')[1]));
        } catch {
          setRawInputText(base64Str);
        }
      } else {
        setRawInputText(`[Uploaded Document: ${file.name}] (Binary file ready for Gemini OCR extraction)`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run Pipeline API call
  const handleRunPipeline = async (overrideText?: string) => {
    setErrorState(null);
    const textToProcess = overrideText !== undefined ? overrideText : rawInputText;

    if (!textToProcess.trim() && !selectedFile) {
      setErrorState(ERROR_CATALOG.EMPTY_INPUT);
      return;
    }

    setLoading(true);
    setIsSaved(false);
    setProcessingStep('upload');
    setStepLabel('Uploading document & initializing Gemini OCR...');

    // Smooth step progress simulation
    const t1 = setTimeout(() => {
      setProcessingStep('extract');
      setStepLabel('Extracting specs & detecting products...');
    }, 600);

    const t2 = setTimeout(() => {
      setProcessingStep('validate');
      setStepLabel('Validating schema & cross-checking confidence...');
    }, 1400);

    const t3 = setTimeout(() => {
      setProcessingStep('kg');
      setStepLabel('Building Knowledge Graph & vector embeddings...');
    }, 2200);

    try {
      const response = await apiFetch('/api/process-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInputText: textToProcess,
          documentType: selectedFile ? (selectedFile.type.includes('pdf') ? 'pdf' : 'image') : 'text',
          fileName: selectedFile?.name,
          fileData: selectedFile?.base64
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: ProductIntelligenceResult = await response.json();
      setResult(data);
      setEditableData({ ...data.structuredData });
      setProcessingStep('ready');
      setStepLabel('Analysis Complete');
    } catch (err: any) {
      console.error('Error running pipeline:', err);
      setErrorState(parseErrorToCatalog(err));
      setProcessingStep('idle');
      setStepLabel('');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setLoading(false);
    }
  };

  // Load Preset Handler
  const handleLoadPreset = (preset: SampleProductInput) => {
    setErrorState(null);
    setSelectedFile(null);
    setRawInputText(preset.rawText);
    setInputMode('text');
    handleRunPipeline(preset.rawText);
  };

  // Save/Approve Record (Human-In-The-Loop)
  const handleApproveRecord = () => {
    if (!result || !editableData) return;
    const updatedResult: ProductIntelligenceResult = {
      ...result,
      structuredData: { ...editableData },
      status: 'human_verified'
    };
    setResult(updatedResult);
    setIsSaved(true);
  };

  // Export Handlers
  const handleDownloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.structuredData.name || 'product'}-intelligence.json`;
    a.click();
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const report = `# Product Intelligence Report: ${result.structuredData.name}
Generated by ProductIQ • ${new Date().toLocaleDateString()}

## Summary
- Overall Confidence: ${result.validation.overallConfidence}%
- Validation Status: ${result.status}
- Flagged Fields: ${result.validation.flaggedCount}

## Structured Attributes
- Product Name: ${result.structuredData.name}
- Category: ${result.structuredData.category}
- Material: ${result.structuredData.material}
- Pressure Rating: ${result.structuredData.pressure}
- Size: ${result.structuredData.size}
- Specification Standard: ${result.structuredData.spec}

## Knowledge Graph Rules
${result.knowledgeGraph.rulesChecked.map(r => `- ${r}`).join('\n')}
`;
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.structuredData.name || 'product'}-report.md`;
    a.click();
  };

  const steps = [
    { id: 'upload', label: 'Upload' },
    { id: 'extract', label: 'Extract' },
    { id: 'validate', label: 'Validate' },
    { id: 'kg', label: 'Knowledge Graph' },
    { id: 'ready', label: 'Ready' }
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['idle', 'upload', 'extract', 'validate', 'kg', 'ready'];
    const currentIdx = order.indexOf(processingStep);
    const stepIdx = order.indexOf(stepId);

    if (currentIdx === 0) return 'pending';
    if (currentIdx > stepIdx || processingStep === 'ready') return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      
      {/* Active Error Alert Card */}
      {errorState && (
        <EnterpriseAlert
          type={errorState.type}
          title={errorState.title}
          message={errorState.message}
          code={errorState.code}
          solution={errorState.solution}
          nextActionLabel={errorState.nextActionLabel}
          onNextAction={() => {
            if (errorState.code === 'ERR_EMPTY_INPUT' || errorState.code === 'ERR_RANDOM_TEXT') {
              handleLoadPreset(SAMPLE_PRODUCT_INPUTS[0]);
            } else {
              setErrorState(null);
            }
          }}
          onRetry={() => handleRunPipeline()}
          onDismiss={() => setErrorState(null)}
        />
      )}

      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161E2D] border border-white/[0.08] text-xs font-mono text-[#19D3AE]">
          <Sparkles className="w-3.5 h-3.5 text-[#19D3AE]" />
          <span>ProductIQ • AI Product Intelligence Platform</span>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Transform Raw Datasheets Into <br className="hidden sm:inline" />
            <span className="text-[#19D3AE]">Commerce-Ready Intelligence</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A8B3CF] leading-relaxed">
            Extract, ground with RAG benchmarks, validate field confidence, and cross-check Knowledge Graph constraint rules instantly.
          </p>
        </div>

        {/* Mode Toggle Bar */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#101827] border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-[#161E2D] text-white shadow-sm border border-white/[0.08]'
                : 'text-[#A8B3CF] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#19D3AE]" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              inputMode === 'text'
                ? 'bg-[#161E2D] text-white shadow-sm border border-white/[0.08]'
                : 'text-[#A8B3CF] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#19D3AE]" />
            <span>Paste Product Text</span>
          </button>
        </div>

        {/* HERO INPUT CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#161E2D] border border-white/[0.06] shadow-2xl space-y-5 text-left relative overflow-hidden">
          
          {inputMode === 'upload' ? (
            <div className="relative border-2 border-dashed border-white/10 hover:border-[#19D3AE]/40 rounded-xl p-8 sm:p-10 bg-[#101827] transition-all text-center group cursor-pointer">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#161E2D] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform text-[#19D3AE]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Drop PDF datasheet or click to browse'}
                  </span>
                  <span className="text-xs text-[#A8B3CF] mt-1 block">
                    Supports technical PDFs, scanned product labels, CSV specifications, and images
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                rows={6}
                placeholder="Paste raw industrial product specs, datasheet lines, or email catalog text..."
                className="w-full p-4 rounded-xl bg-[#101827] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[#19D3AE]/50 leading-relaxed resize-none"
              />
            </div>
          )}

          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center space-x-2 text-xs text-[#A8B3CF]">
              <span className="font-mono text-[11px]">Quick Samples:</span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PRODUCT_INPUTS.slice(0, 3).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(p)}
                    className="px-2.5 py-1 rounded-md bg-[#101827] hover:bg-white/[0.05] border border-white/[0.06] text-[11px] text-[#A8B3CF] hover:text-white transition-all cursor-pointer"
                  >
                    {p.title.split('-')[1]?.trim() || p.category}
                  </button>
                ))}
              </div>
            </div>

            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-xs text-[#19D3AE] hover:underline"
              >
                Remove File
              </button>
            )}
          </div>

          {/* PRIMARY CTA BUTTON */}
          <button
            type="button"
            onClick={() => handleRunPipeline()}
            disabled={loading || (!rawInputText.trim() && !selectedFile)}
            className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg ${
              loading
                ? 'bg-[#101827] text-[#A8B3CF] border border-white/[0.06] cursor-not-allowed'
                : 'bg-[#19D3AE] text-slate-950 hover:bg-[#15bfa0] border border-[#19D3AE]/40 cursor-pointer shadow-[#19D3AE]/15 hover:shadow-[#19D3AE]/25'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running Pipeline (Gemini OCR → RAG → Knowledge Graph)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Product</span>
              </>
            )}
          </button>

        </div>

        {/* HORIZONTAL PROGRESS TIMELINE */}
        <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.id);
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        status === 'completed'
                          ? 'bg-[#19D3AE] text-slate-950'
                          : status === 'active'
                          ? 'bg-[#101827] text-[#19D3AE] border-2 border-[#19D3AE] animate-pulse'
                          : 'bg-[#101827] text-[#A8B3CF]/40 border border-white/[0.06]'
                      }`}
                    >
                      {status === 'completed' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-mono transition-colors ${
                        status === 'completed' || status === 'active'
                          ? 'text-white font-medium'
                          : 'text-[#A8B3CF]/50'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                        getStepStatus(steps[idx + 1].id) !== 'pending'
                          ? 'bg-[#19D3AE]'
                          : 'bg-white/[0.06]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {stepLabel && (
            <div className="text-center font-mono text-xs text-[#19D3AE] animate-pulse">
              {stepLabel}
            </div>
          )}
        </div>

      </section>

      {/* PROCESSING RESULT SECTION (Shown after processing or result selection) */}
      {result && (
        <section className="space-y-6 pt-4 border-t border-white/[0.06]">
          
          {/* Ask AI & Export Action Bar */}
          <div className="p-4 rounded-2xl bg-[#161E2D] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#101827] border border-white/[0.08] flex items-center justify-center text-[#19D3AE]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Ask AI About This Product</span>
                <span className="text-[11px] text-[#A8B3CF]">
                  Query specifications, compatible fittings, or pressure standards
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {onAskAboutProduct && (
                <button
                  type="button"
                  onClick={() => onAskAboutProduct(result.structuredData.name)}
                  className="px-3 py-1.5 rounded-lg bg-[#19D3AE] text-slate-950 hover:bg-[#15bfa0] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="px-3 py-1.5 rounded-lg bg-[#101827] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-[#A8B3CF] hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#19D3AE]" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="px-3 py-1.5 rounded-lg bg-[#101827] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-medium text-[#A8B3CF] hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-400" />
                <span>Report</span>
              </button>
            </div>
          </div>
          
          {/* Status Header Bar */}
          <div className="p-4 rounded-2xl bg-[#161E2D] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                result.status === 'auto_approved'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : result.status === 'human_verified'
                  ? 'bg-[#19D3AE]/10 text-[#19D3AE] border-[#19D3AE]/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {result.status === 'auto_approved' && '✓ AUTO APPROVED'}
                {result.status === 'human_verified' && '✓ HUMAN VERIFIED'}
                {result.status === 'needs_review' && '⚠ NEEDS HUMAN REVIEW'}
              </div>

              <span className="text-xs text-[#A8B3CF] font-mono">
                Overall Confidence: <strong className="text-white font-bold">{result.validation.overallConfidence}%</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#101827] border border-white/[0.06] text-[#A8B3CF] font-mono">
                {result.validation.flaggedCount} Flagged Fields
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#101827] border border-white/[0.06] text-[#A8B3CF] font-mono">
                Graph: <strong className="text-white">{result.knowledgeGraph.status.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-2 border-b border-white/[0.06] pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('extracted')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'extracted'
                  ? 'bg-[#161E2D] text-white border border-white/[0.08]'
                  : 'text-[#A8B3CF] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Structured Data</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rag')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'rag'
                  ? 'bg-[#161E2D] text-white border border-white/[0.08]'
                  : 'text-[#A8B3CF] hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>RAG Context ({result.retrievedRAGContext.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('knowledgeGraph')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'knowledgeGraph'
                  ? 'bg-[#161E2D] text-white border border-white/[0.08]'
                  : 'text-[#A8B3CF] hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Knowledge Graph</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rawText')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'rawText'
                  ? 'bg-[#161E2D] text-white border border-white/[0.08]'
                  : 'text-[#A8B3CF] hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#A8B3CF]" />
              <span>OCR Text</span>
            </button>
          </div>

          {/* TAB 1: STRUCTURED DATA */}
          {activeTab === 'extracted' && editableData && (
            <div className="space-y-4">
              <ConfidenceExplanationCard result={result} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(editableData) as Array<keyof StructuredProductData>).map((fieldKey) => {
                  const val = editableData[fieldKey];
                  const valInfo = result.validation.fields[fieldKey];
                  const score = valInfo?.score ?? 50;
                  const needsReview = score < 50;

                  return (
                    <div
                      key={fieldKey}
                      className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-medium uppercase text-[#A8B3CF]">
                          {fieldKey}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            score >= 80
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : score >= 50
                              ? 'bg-[#19D3AE]/10 text-[#19D3AE] border-[#19D3AE]/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {score}% CONFIDENCE
                        </span>
                      </div>

                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          setEditableData({ ...editableData, [fieldKey]: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#101827] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[#19D3AE]/50"
                      />

                      <p className="text-[11px] text-[#A8B3CF] leading-tight flex items-start space-x-1">
                        <Info className="w-3 h-3 text-[#A8B3CF] shrink-0 mt-0.5" />
                        <span>{valInfo?.reason || 'Verified field extraction'}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-semibold text-white block">Human Verification</span>
                  <span className="text-[#A8B3CF]">
                    {isSaved ? 'Record finalized.' : 'Verify field values and approve for catalog write.'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleApproveRecord}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
                    isSaved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#19D3AE] text-slate-950 font-bold hover:bg-[#15bfa0]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaved ? 'Approved' : 'Approve Record'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: RAG CONTEXT */}
          {activeTab === 'rag' && (
            <div className="space-y-3">
              {result.retrievedRAGContext.map((rag, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{rag.name}</span>
                    <span className="text-[10px] font-mono text-[#19D3AE]">
                      {rag.similarityScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-[#A8B3CF]">{rag.spec}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: KNOWLEDGE GRAPH */}
          {activeTab === 'knowledgeGraph' && (
            <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] space-y-3">
              <span className="text-xs font-semibold text-white block">Constraint Rules Checked</span>
              <ul className="list-disc list-inside text-xs text-[#A8B3CF] space-y-1">
                {result.knowledgeGraph.rulesChecked.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB 4: RAW OCR TEXT */}
          {activeTab === 'rawText' && (
            <pre className="p-4 rounded-xl bg-[#101827] border border-white/[0.06] text-xs font-mono text-[#A8B3CF] whitespace-pre-wrap leading-relaxed">
              {result.extractedRawText}
            </pre>
          )}

        </section>
      )}

    </div>
  );
};
