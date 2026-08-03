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
  Edit3,
  RefreshCw,
  Info,
  Check,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProductIntelligenceResult, StructuredProductData } from '../types';
import { SAMPLE_PRODUCT_INPUTS, SampleProductInput } from '../data/samplePrompts';
import { EnterpriseAlert } from './common/EnterpriseAlert';
import { ERROR_CATALOG, parseErrorToCatalog, CatalogErrorDetails } from '../lib/errorCatalog';
import { AIProcessingWorkflow } from './AIProcessingWorkflow';
import { ConfidenceExplanationCard } from './common/ConfidenceExplanationCard';

export const SingleProductView: React.FC = () => {
  const [rawInputText, setRawInputText] = useState<string>(SAMPLE_PRODUCT_INPUTS[0].rawText);
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ProductIntelligenceResult | null>(null);
  const [errorState, setErrorState] = useState<CatalogErrorDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'extracted' | 'rag' | 'knowledgeGraph' | 'rawText'>('extracted');

  // Human in the loop state
  const [editableData, setEditableData] = useState<StructuredProductData | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorState(null);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'txt'];

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

      // If text file, also populate rawInputText
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
    try {
      const response = await fetch('/api/process-product', {
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
    } catch (err: any) {
      console.error('Error running pipeline:', err);
      setErrorState(parseErrorToCatalog(err));
    } finally {
      setLoading(false);
    }
  };

  // Load Preset Handler
  const handleLoadPreset = (preset: SampleProductInput) => {
    setErrorState(null);
    setSelectedFile(null);
    setRawInputText(preset.rawText);
    handleRunPipeline(preset.rawText);
  };

  // Save/Approve Record (Human-In-The-Loop)
  const handleApproveRecord = () => {
    if (!result || !editableData) return;

    // Update result with edited values
    const updatedResult: ProductIntelligenceResult = {
      ...result,
      structuredData: { ...editableData },
      status: 'human_verified'
    };
    setResult(updatedResult);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Explanation */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Single Product Document Intelligence</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-normal leading-relaxed">
              Extract, ground with RAG benchmarks, validate field confidence, and cross-check Knowledge Graph rules for any product document.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-mono w-full sm:w-auto">Sample Presets:</span>
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {SAMPLE_PRODUCT_INPUTS.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(p)}
                  className="px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all hover:border-teal-500/40 shrink-0"
                >
                  {p.title.split('-')[1]?.trim() || p.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {/* Main Grid: Left Input, Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Input Form & File Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Source Input Document</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">PDF, JPG, PNG or TXT</span>
            </div>

            {/* File Upload Zone */}
            <div className="relative border border-dashed border-white/20 hover:border-teal-500/60 rounded-2xl p-6 bg-white/[0.02] backdrop-blur-md transition-all text-center group">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="w-7 h-7 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-200">
                  {selectedFile ? `File Selected: ${selectedFile.name}` : 'Drag & drop technical spec document or click to browse'}
                </span>
                <span className="text-[11px] text-slate-400">Supports scanned PDFs, product labels, and technical datasheets</span>
              </div>
            </div>

            {/* Raw Text Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200 flex items-center justify-between">
                <span>Or Paste Unstructured Description Text:</span>
                {selectedFile && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-xs text-teal-400 hover:underline"
                  >
                    Clear File
                  </button>
                )}
              </label>
              <textarea
                value={rawInputText}
                onChange={(e) => setRawInputText(e.target.value)}
                rows={7}
                placeholder="Paste messy industrial product specs, catalog lines, or email order snippets here..."
                className="w-full px-3.5 py-3 rounded-xl bg-slate-950/40 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-400/60 leading-relaxed"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleRunPipeline()}
              disabled={loading || (!rawInputText.trim() && !selectedFile)}
              className={`w-full py-3.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center space-x-2 ${
                loading
                  ? 'bg-white/5 text-slate-400 cursor-not-allowed border border-white/10'
                  : 'bg-teal-500/80 hover:bg-teal-400 text-slate-950 border border-teal-400/40 hover:shadow-lg hover:shadow-teal-500/20'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
                  <span>Processing AI Pipeline (OCR → RAG → Schema → Rules)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Run Product Intelligence Pipeline</span>
                </>
              )}
            </button>

          </div>

          {/* Preset Prompts List */}
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-medium text-slate-200 flex items-center space-x-2">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Quick Test Scenarios:</span>
            </h3>
            <div className="space-y-2">
              {SAMPLE_PRODUCT_INPUTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadPreset(sample)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-teal-500/30 text-xs transition-all flex items-center justify-between group"
                >
                  <div>
                    <span className="font-medium text-slate-100 block">{sample.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5 font-normal">{sample.description}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Output Pipeline Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {!result && !loading && (
            <div className="h-full min-h-[400px] p-8 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-sm font-semibold text-white font-mono">Ready to process your first product document.</h3>
              <p className="text-xs text-slate-300 max-w-md font-normal leading-relaxed">
                Upload a catalog PDF or paste a product description to begin analysis.
              </p>
            </div>
          )}

          {loading && (
            <AIProcessingWorkflow
              isProcessing={loading}
              documentName={selectedFile?.name || 'Raw Product Specs Document'}
            />
          )}

          {result && !loading && (
            <div className="space-y-4">

              {/* Status Header Bar */}
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium font-mono border ${
                    result.status === 'auto_approved'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : result.status === 'human_verified'
                      ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                  }`}>
                    {result.status === 'auto_approved' && '✓ AUTO APPROVED'}
                    {result.status === 'human_verified' && '✓ HUMAN VERIFIED'}
                    {result.status === 'needs_review' && '⚠ NEEDS HUMAN REVIEW'}
                  </div>

                  <span className="text-xs text-slate-300 font-mono">
                    Overall Confidence: <strong className="text-white font-bold">{result.validation.overallConfidence}%</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono">
                    {result.validation.flaggedCount} Low-Conf Fields
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl font-mono border ${
                    result.knowledgeGraph.status === 'valid'
                      ? 'bg-white/5 text-slate-300 border-white/10'
                      : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  }`}>
                    Graph: {result.knowledgeGraph.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* View Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab('extracted')}
                  className={`flex items-center space-x-1.5 px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === 'extracted'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Structured Data & Confidence</span>
                </button>

                <button
                  onClick={() => setActiveTab('rag')}
                  className={`flex items-center space-x-1.5 px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === 'rag'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>RAG Grounding ({result.retrievedRAGContext.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('knowledgeGraph')}
                  className={`flex items-center space-x-1.5 px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === 'knowledgeGraph'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitFork className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Knowledge Graph</span>
                </button>

                <button
                  onClick={() => setActiveTab('rawText')}
                  className={`flex items-center space-x-1.5 px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-xl text-xs font-medium transition-all shrink-0 ${
                    activeTab === 'rawText'
                      ? 'bg-white/10 text-white border border-white/15'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>OCR Text</span>
                </button>
              </div>

              {/* TAB 1: STRUCTURED DATA & FIELD CONFIDENCE */}
              {activeTab === 'extracted' && editableData && (() => {
                const isInvalidInput =
                  result.validation.overallConfidence === 0 ||
                  Object.values(result.validation.fields).every((f) => f.score === 0) ||
                  (result.validation.overallConfidence < 25 &&
                    (result.structuredData.name === 'N/A' ||
                      result.structuredData.name === 'Unidentified Product' ||
                      result.structuredData.name === 'Unknown' ||
                      !result.structuredData.name ||
                      result.structuredData.category === 'N/A'));

                if (isInvalidInput) {
                  return (
                    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 space-y-5 backdrop-blur-md shadow-xl">
                      {/* Card Header */}
                      <div className="flex items-start space-x-3.5 pb-4 border-b border-slate-800">
                        <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0 mt-0.5 border border-teal-500/20">
                          <Info className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-white font-mono">
                            Non-Industrial Document Input Detected
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-normal">
                            This input does not appear to describe an industrial product. Please upload a technical datasheet or enter a valid product description.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Missing Fields Checklist */}
                        <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-teal-300 uppercase font-mono tracking-wider flex items-center space-x-2">
                            <Info className="w-3.5 h-3.5 text-teal-400" />
                            <span>Expected Datasheet Fields:</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-medium font-mono">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Product Name</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Category</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Material Grade</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Port Size</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Pressure Class</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">•</span>
                              <span>Spec Standard</span>
                            </div>
                          </div>
                        </div>

                        {/* Suggested Actions */}
                        <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <h4 className="text-xs font-bold text-teal-300 uppercase font-mono tracking-wider">
                            Recommended Next Steps:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300 font-normal">
                            <li className="flex items-center space-x-2">
                              <span className="text-teal-400">•</span>
                              <span>Upload a technical PDF or specification datasheet</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <span className="text-teal-400">•</span>
                              <span>Paste structured line items from an industrial invoice</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <span className="text-teal-400">•</span>
                              <span>Select a sample preset on the left to test the pipeline</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Valid Example Box */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Valid Example Product Format:
                        </span>
                        <div className="text-xs text-teal-300 space-y-0.5 leading-relaxed font-semibold">
                          <div>304 Stainless Steel Ball Valve, 2" Class 300, ANSI B16.34</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    
                    {/* Explainable Confidence Card */}
                    <ConfidenceExplanationCard result={result} />

                    {/* Field Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(Object.keys(editableData) as Array<keyof StructuredProductData>).map((fieldKey) => {
                        const val = editableData[fieldKey];
                        const valInfo = result.validation.fields[fieldKey];
                        const score = valInfo?.score ?? 50;
                        const needsReview = score < 50;

                        return (
                          <div
                            key={fieldKey}
                            className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
                              needsReview
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-400">
                                {fieldKey}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-medium font-mono border ${
                                  score >= 80
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                    : score >= 50
                                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {score > 0 ? `${score}% CONFIDENCE` : 'UNVERIFIED FIELD'}
                              </span>
                            </div>

                            {/* Editable Field Input */}
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                setEditableData({ ...editableData, [fieldKey]: e.target.value })
                              }
                              className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono border transition-all focus:outline-none ${
                                needsReview
                                  ? 'bg-slate-950/60 border-amber-500/40 text-amber-200 focus:border-amber-400'
                                  : 'bg-slate-950/40 border-white/10 text-white focus:border-teal-400'
                              }`}
                            />

                            {/* Traceable Reason */}
                            <p className="text-[11px] text-slate-400 mt-2 leading-tight flex items-start space-x-1.5 font-normal">
                              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{valInfo?.reason || 'Verified field extraction'}</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Human-in-the-loop Finalizer Box */}
                    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-200 block">Human-in-the-loop Verification</span>
                        <span className="text-slate-400 font-normal">
                          {isSaved
                            ? '✓ Record verified and finalized.'
                            : 'Review field edits above and click to finalize record.'}
                        </span>
                      </div>

                      <button
                        onClick={handleApproveRecord}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2 ${
                          isSaved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-teal-500/80 hover:bg-teal-400 text-slate-950 font-semibold hover:shadow-lg hover:shadow-teal-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSaved ? 'Approved & Finalized' : 'Verify & Approve Record'}</span>
                      </button>
                    </div>

                  </div>
                );
              })()}

              {/* TAB 2: RAG GROUNDING CONTEXT */}
              {activeTab === 'rag' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200">
                    <p className="font-semibold mb-1 flex items-center space-x-1.5">
                      <Database className="w-3.5 h-3.5 text-teal-400" />
                      <span>RAG Retrieval-Augmented Grounding Context</span>
                    </p>
                    <p className="text-[11px] text-slate-300 font-normal">
                      Top benchmark reference products retrieved from the catalog store to anchor LLM generation and eliminate hallucinations.
                    </p>
                  </div>

                  {(!result.retrievedRAGContext || result.retrievedRAGContext.length === 0) ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-2 shadow-lg">
                      <div className="flex items-center space-x-2 font-semibold text-xs text-teal-300 font-mono">
                        <Database className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Catalog Benchmark Lookup</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        No similar products were found in the indexed catalog. The extracted information is shown below, but it has not yet been grounded against an existing catalog entry.
                      </p>
                    </div>
                  ) : (
                    result.retrievedRAGContext.map((rag, idx) => (
                      <div key={rag.id || idx} className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-100 flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-white/5 text-teal-300 flex items-center justify-center text-[10px] font-mono border border-white/10">
                              #{idx + 1}
                            </span>
                            <span>{rag.name}</span>
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium font-mono border ${
                            rag.similarityScore >= 70
                              ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}>
                            {rag.similarityScore}% {rag.similarityScore >= 70 ? 'SIMILARITY' : 'LOW CONFIDENCE MATCH'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-950/40 p-3 rounded-xl border border-white/10 font-mono text-slate-300">
                          <div><span className="text-slate-400">Cat:</span> {rag.category}</div>
                          <div><span className="text-slate-400">Mat:</span> {rag.material}</div>
                          <div><span className="text-slate-400">Size:</span> {rag.size}</div>
                          <div><span className="text-slate-400">Spec:</span> {rag.spec}</div>
                        </div>

                        <p className="text-[11px] text-slate-400 font-normal italic">
                          {rag.matchReason}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: KNOWLEDGE GRAPH VALIDATION */}
              {activeTab === 'knowledgeGraph' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200">
                    <p className="font-semibold mb-1 flex items-center space-x-1.5">
                      <GitFork className="w-3.5 h-3.5 text-teal-400" />
                      <span>Knowledge Graph Industrial Rules Check</span>
                    </p>
                    <p className="text-[11px] text-slate-300 font-normal">
                      Cross-checks categories, allowable materials, standard spec codes, and material pressure limits.
                    </p>
                  </div>

                  {result.knowledgeGraph.anomalies.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-emerald-300 flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>All Knowledge Graph constraint rules passed cleanly. No physical or material anomalies detected.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {result.knowledgeGraph.anomalies.map((anom, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                          <div className="flex items-center justify-between font-semibold text-purple-300">
                            <span className="flex items-center space-x-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span>Graph Anomaly on Field: '{anom.field.toUpperCase()}'</span>
                            </span>
                            <span className="uppercase text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                              Severity: {anom.severity}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-normal">
                            {anom.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                    <span className="font-medium text-slate-400 text-[10px] uppercase font-mono block">Rules Evaluated:</span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-normal">
                      {result.knowledgeGraph.rulesChecked.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: RAW OCR / TEXT */}
              {activeTab === 'rawText' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>EXTRACTED RAW DOCUMENT CONTENT</span>
                    <span>Length: {result.extractedRawText.length} chars</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950/40 border border-white/10 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {result.extractedRawText}
                  </pre>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
