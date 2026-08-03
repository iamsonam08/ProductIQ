import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Layers,
  Upload,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Edit3,
  X,
  Database,
  GitFork,
  FileSpreadsheet
} from 'lucide-react';
import { ProductIntelligenceResult, StructuredProductData, BatchProgress } from '../types';
import { SAMPLE_BATCH_CSV } from '../data/samplePrompts';
import { EnterpriseAlert } from './common/EnterpriseAlert';
import { ERROR_CATALOG, parseErrorToCatalog, CatalogErrorDetails } from '../lib/errorCatalog';
import { AIProcessingWorkflow } from './AIProcessingWorkflow';
import { ConfidenceExplanationCard } from './common/ConfidenceExplanationCard';

interface BatchProcessingViewProps {
  batchResults?: ProductIntelligenceResult[];
  onBatchResultsChange?: (results: ProductIntelligenceResult[]) => void;
}

export const BatchProcessingView: React.FC<BatchProcessingViewProps> = ({
  batchResults: initialBatchResults = [],
  onBatchResultsChange
}) => {
  const [csvText, setCsvText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [batchResults, setBatchResults] = useState<ProductIntelligenceResult[]>(initialBatchResults);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [errorState, setErrorState] = useState<CatalogErrorDetails | null>(null);

  // Filter and Search
  const [filterStatus, setFilterStatus] = useState<'all' | 'auto_approved' | 'needs_review' | 'anomaly'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Human Review Modal State
  const [reviewingItem, setReviewingItem] = useState<ProductIntelligenceResult | null>(null);
  const [reviewForm, setReviewForm] = useState<StructuredProductData | null>(null);

  // CSV File Upload Handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorState(null);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (ext !== 'csv' && ext !== 'tsv' && ext !== 'txt') {
      setErrorState({
        ...ERROR_CATALOG.UNSUPPORTED_FILE,
        message: `File '${file.name}' is not a valid CSV or TSV file.`
      });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorState(ERROR_CATALOG.INVALID_PDF);
    };

    reader.onload = () => {
      const text = reader.result as string;
      setCsvText(text);
      processBatchCSV(text);
    };
    reader.readAsText(file);
  };

  // Load Sample Batch
  const handleLoadSampleCSV = () => {
    setErrorState(null);
    setCsvText(SAMPLE_BATCH_CSV);
    processBatchCSV(SAMPLE_BATCH_CSV);
  };

  // Process Batch CSV Execution
  const processBatchCSV = async (csvContent: string) => {
    setErrorState(null);

    if (!csvContent.trim()) {
      setErrorState(ERROR_CATALOG.EMPTY_INPUT);
      return;
    }

    setLoading(true);
    try {
      const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
      const rows = parsed.data as Array<Record<string, string>>;

      if (rows.length === 0) {
        setErrorState({
          ...ERROR_CATALOG.EMPTY_INPUT,
          title: 'CSV File Empty or Invalid',
          message: 'The uploaded CSV file contains no readable product rows or column headers.'
        });
        setLoading(false);
        return;
      }

      // Extract item descriptions
      const itemsToProcess = rows.map((r, i) => {
        const raw = r.Product_Description || r.description || r.text || r.item || Object.values(r)[0] || '';
        return {
          rawInputText: raw,
          fileName: `row_${i + 1}.csv`
        };
      });

      setProgress({
        total: itemsToProcess.length,
        processed: 0,
        autoApproved: 0,
        needsReview: 0,
        graphAnomalies: 0
      });

      // Send to batch endpoint
      const response = await fetch('/api/batch-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToProcess })
      });

      if (!response.ok) {
        throw new Error(`Server batch error HTTP ${response.status}`);
      }

      const data = await response.json();
      const results: ProductIntelligenceResult[] = data.results || [];

      setBatchResults(results);
      onBatchResultsChange?.(results);

      // Compute stats
      const autoApproved = results.filter(r => r.status === 'auto_approved').length;
      const needsReview = results.filter(r => r.status === 'needs_review').length;
      const graphAnomalies = results.filter(r => r.knowledgeGraph.status === 'anomaly_flagged').length;

      setProgress({
        total: results.length,
        processed: results.length,
        autoApproved,
        needsReview,
        graphAnomalies
      });

    } catch (err: any) {
      console.error('Batch CSV error:', err);
      setErrorState(parseErrorToCatalog(err));
    } finally {
      setLoading(false);
    }
  };

  // Open Review Modal
  const handleOpenReview = (item: ProductIntelligenceResult) => {
    setReviewingItem(item);
    setReviewForm({ ...item.structuredData });
  };

  // Save Edits from Review Modal
  const handleSaveReview = () => {
    if (!reviewingItem || !reviewForm) return;

    const updated = batchResults.map(item => {
      if (item.id === reviewingItem.id) {
        return {
          ...item,
          structuredData: { ...reviewForm },
          status: 'human_verified' as const
        };
      }
      return item;
    });

    setBatchResults(updated);
    onBatchResultsChange?.(updated);
    setReviewingItem(null);
    setReviewForm(null);

  };

  // Export Results to CSV
  const handleExportCSV = () => {
    if (batchResults.length === 0) return;

    const exportRows = batchResults.map(r => ({
      ID: r.id,
      Status: r.status,
      Product_Name: r.structuredData.name,
      Category: r.structuredData.category,
      Material: r.structuredData.material,
      Size: r.structuredData.size,
      Pressure: r.structuredData.pressure,
      Spec: r.structuredData.spec,
      Overall_Confidence: `${r.validation.overallConfidence}%`,
      Graph_Status: r.knowledgeGraph.status,
      Flagged_Fields_Count: r.validation.flaggedCount,
      Raw_Input: r.rawInputText
    }));

    const csvStr = Papa.unparse(exportRows);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `validated_product_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredResults = batchResults.filter(r => {
    const matchesSearch = 
      r.structuredData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.structuredData.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.structuredData.material.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'auto_approved') return r.status === 'auto_approved' || r.status === 'human_verified';
    if (filterStatus === 'needs_review') return r.status === 'needs_review';
    if (filterStatus === 'anomaly') return r.knowledgeGraph.status === 'anomaly_flagged';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 text-slate-200 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Scalable Batch CSV Processing Engine</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-normal">
              Process hundreds of messy catalog lines through the complete pipeline (RAG → Schema → Confidence Audit → Knowledge Graph) in one click.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLoadSampleCSV}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-indigo-950 flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-200" />
              <span>Load Industrial Sample CSV (12 Items)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Alert Card */}
      {errorState && (
        <EnterpriseAlert
          type={errorState.type}
          title={errorState.title}
          message={errorState.message}
          code={errorState.code}
          solution={errorState.solution}
          nextActionLabel={errorState.nextActionLabel}
          onNextAction={() => {
            if (errorState.code === 'ERR_EMPTY_INPUT') {
              handleLoadSampleCSV();
            } else {
              setErrorState(null);
            }
          }}
          onRetry={() => {
            if (csvText) {
              processBatchCSV(csvText);
            } else {
              handleLoadSampleCSV();
            }
          }}
          onDismiss={() => setErrorState(null)}
        />
      )}

      {/* AI Processing Workflow Stage Component */}
      {loading && (
        <AIProcessingWorkflow
          isProcessing={loading}
          documentName="Industrial Catalog Batch CSV"
        />
      )}

      {/* CSV Drag & Drop Zone */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-lg hover:border-slate-700 hover:shadow-indigo-500/5 transition-all space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-2xl p-6 bg-slate-950/60 transition-all text-center w-full group">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="w-7 h-7 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-200">Upload Product CSV File</span>
              <span className="text-[10px] text-slate-400">Must include a column named 'Product_Description' or 'description'</span>
            </div>
          </div>

        </div>

        {/* Progress & Metrics Bar */}
        {progress && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Total Processed</span>
              <span className="text-lg font-bold text-white">{progress.processed} / {progress.total}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="text-emerald-400 text-[10px] uppercase font-mono block">Auto Approved</span>
              <span className="text-lg font-bold text-emerald-300">{progress.autoApproved}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="text-amber-400 text-[10px] uppercase font-mono block">Needs Review</span>
              <span className="text-lg font-bold text-amber-300">{progress.needsReview}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60">
              <span className="text-purple-400 text-[10px] uppercase font-mono block">Graph Anomalies</span>
              <span className="text-lg font-bold text-purple-300">{progress.graphAnomalies}</span>
            </div>
          </div>
        )}
      </div>

      {/* Batch Results Matrix Table */}
      {batchResults.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Tabs & Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-[11px] font-medium transition-colors ${
                    filterStatus === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  All ({batchResults.length})
                </button>
                <button
                  onClick={() => setFilterStatus('auto_approved')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-[11px] font-medium transition-colors ${
                    filterStatus === 'auto_approved' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilterStatus('needs_review')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-[11px] font-medium transition-colors ${
                    filterStatus === 'needs_review' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Flagged
                </button>
                <button
                  onClick={() => setFilterStatus('anomaly')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-md text-[11px] font-medium transition-colors ${
                    filterStatus === 'anomaly' ? 'bg-purple-950 text-purple-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  Anomalies
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 min-h-[44px] sm:min-h-[36px] rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-950 flex items-center justify-center space-x-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

          </div>

          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Pressure</th>
                  <th className="py-2.5 px-3">Spec</th>
                  <th className="py-2.5 px-3">Conf</th>
                  <th className="py-2.5 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredResults.map((item) => {
                  const data = item.structuredData;
                  const isApproved = item.status === 'auto_approved' || item.status === 'human_verified';
                  const hasGraphAnomaly = item.knowledgeGraph.status === 'anomaly_flagged';

                  return (
                    <tr key={item.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : hasGraphAnomaly
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}>
                          {item.status === 'human_verified' && 'VERIFIED'}
                          {item.status === 'auto_approved' && 'APPROVED'}
                          {item.status === 'needs_review' && (hasGraphAnomaly ? 'ANOMALY' : 'FLAGGED')}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-white max-w-xs truncate">
                        {data.name}
                      </td>

                      <td className="py-2.5 px-3 text-slate-300">{data.category}</td>
                      <td className="py-2.5 px-3 text-slate-300">{data.material}</td>
                      <td className="py-2.5 px-3 text-slate-300">{data.size}</td>
                      <td className="py-2.5 px-3 text-slate-300">{data.pressure}</td>
                      <td className="py-2.5 px-3 text-slate-300">{data.spec}</td>

                      <td className="py-2.5 px-3">
                        <span className={`font-bold ${
                          item.validation.overallConfidence >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {item.validation.overallConfidence}%
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="px-2 py-1.5 min-h-[36px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans flex items-center space-x-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-cyan-400" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (Shown on mobile) */}
          <div className="md:hidden space-y-3">
            {filteredResults.map((item) => {
              const data = item.structuredData;
              const isApproved = item.status === 'auto_approved' || item.status === 'human_verified';
              const hasGraphAnomaly = item.knowledgeGraph.status === 'anomaly_flagged';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                      isApproved
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : hasGraphAnomaly
                        ? 'bg-purple-950 text-purple-300 border-purple-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {item.status === 'human_verified' && 'VERIFIED'}
                      {item.status === 'auto_approved' && 'APPROVED'}
                      {item.status === 'needs_review' && (hasGraphAnomaly ? 'ANOMALY' : 'FLAGGED')}
                    </span>

                    <span className={`font-bold text-xs ${
                      item.validation.overallConfidence >= 80 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {item.validation.overallConfidence}% Conf
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm break-words font-sans">{data.name}</h3>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <div><span className="text-slate-500">Cat:</span> {data.category}</div>
                    <div><span className="text-slate-500">Mat:</span> {data.material}</div>
                    <div><span className="text-slate-500">Size:</span> {data.size}</div>
                    <div><span className="text-slate-500">Spec:</span> {data.spec}</div>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => handleOpenReview(item)}
                      className="px-3 py-2 min-h-[44px] w-full rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Review & Edit Record</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Human-in-the-Loop Review Modal for Batch Row */}
      {reviewingItem && reviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Human-In-The-Loop Row Review</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{reviewingItem.structuredData.name}</h3>
              </div>

              <button
                onClick={() => setReviewingItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explainable Confidence Card */}
            <ConfidenceExplanationCard result={reviewingItem} />

            {/* Source Raw Text */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase block mb-1">Source Text:</span>
              <p className="text-slate-300 font-mono leading-relaxed">{reviewingItem.rawInputText}</p>
            </div>

            {/* RAG Grounding References */}
            <div className="space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase block font-semibold">RAG Grounding References:</span>
              {(!reviewingItem.retrievedRAGContext || reviewingItem.retrievedRAGContext.length === 0) ? (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 font-semibold text-xs text-teal-300 font-mono">
                    <Database className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Catalog Benchmark Lookup</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    No similar products were found in the indexed catalog. The extracted information is shown below, but it has not yet been grounded against an existing catalog entry.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {reviewingItem.retrievedRAGContext.map((rag, rIdx) => (
                    <div key={rIdx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block">{rag.name}</span>
                        <span className="text-slate-400 text-[10px]">{rag.category} | {rag.material} | {rag.size} | {rag.spec}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                        rag.similarityScore >= 70
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}>
                        {rag.similarityScore}% {rag.similarityScore >= 70 ? 'SIMILARITY' : 'LOW CONFIDENCE MATCH'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(reviewForm) as Array<keyof StructuredProductData>).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-semibold text-slate-400">{key}</label>
                  <input
                    type="text"
                    value={reviewForm[key]}
                    onChange={(e) => setReviewForm({ ...reviewForm, [key]: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setReviewingItem(null)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveReview}
                className="px-4 py-2 rounded-xl text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-950 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Edits & Approve Row</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
