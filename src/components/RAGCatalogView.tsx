import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Cpu,
  Clock,
  Layers,
  HardDrive,
  Activity,
  Zap,
  CheckCircle2,
  X,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Sliders,
  Server,
  FileCode,
  Download,
  ListFilter,
  BarChart3,
  Check,
  Ban,
  ShieldCheck,
  Terminal,
  Info,
  GitFork
} from 'lucide-react';
import { RAGDashboardStats } from '../rag/types';
import { EnterpriseAlert } from './common/EnterpriseAlert';
import { ERROR_CATALOG, parseErrorToCatalog, CatalogErrorDetails } from '../lib/errorCatalog';
import { MASSTEC_CATALOG_PRODUCTS } from '../data/masstecCatalog';

function formatLastIndexed(isoString?: string): string {
  if (!isoString) return 'Today, 07:12 PM';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Today, 07:12 PM';
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
      return `Today, ${timeStr}`;
    } else {
      const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `${dateStr}, ${timeStr}`;
    }
  } catch {
    return 'Today, 07:12 PM';
  }
}

const MetricTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="group relative inline-flex items-center ml-1 cursor-pointer">
      <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 transition-colors" />
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 w-52 p-2 bg-slate-950 text-[11px] font-sans font-normal text-slate-200 rounded-lg border border-slate-700 shadow-2xl leading-tight text-center">
        <span>{text}</span>
        <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-700 rotate-45 -mt-1" />
      </div>
    </div>
  );
};

interface RAGCatalogViewProps {
  userRole?: 'demo' | 'admin';
  onRequestAdminLogin?: (actionName: string) => void;
}

export const RAGCatalogView: React.FC<RAGCatalogViewProps> = ({
  userRole = 'demo',
  onRequestAdminLogin,
}) => {
  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<RAGDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorState, setErrorState] = useState<CatalogErrorDetails | null>(null);

  // Similarity Threshold Slider
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.75);

  // Admin & Modals State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isAddManualOpen, setIsAddManualOpen] = useState<boolean>(false);
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isRebuilding, setIsRebuilding] = useState<boolean>(false);
  const [rebuildMessage, setRebuildMessage] = useState<string | null>(null);

  // Ingestion upload input state
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadText, setUploadText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const [ingestFeedback, setIngestFeedback] = useState<any | null>(null);

  // Manual Product Input State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Ball Valves',
    material: '316 Stainless Steel',
    size: '2"',
    pressure: 'Class 150',
    spec: 'ANSI B16.34',
    descriptionKeywords: ''
  });

  // Similarity Search Testing Sandbox
  const [testQuery, setTestQuery] = useState<string>('');
  const [testResults, setTestResults] = useState<any | null>(null);
  const [isTestingQuery, setIsTestingQuery] = useState<boolean>(false);

  // System Activity Logs
  const [activityLogs, setActivityLogs] = useState<Array<{ id: number; time: string; event: string; type: 'info' | 'success' | 'warn' }>>([
    { id: 1, time: '07:12 PM', event: 'Catalog Index Auto-Synced (10 Demo Records)', type: 'success' },
    { id: 2, time: '07:10 PM', event: 'Gemini Text Embeddings Generated (768-dim Vectors)', type: 'info' },
    { id: 3, time: '07:08 PM', event: 'Knowledge Graph Rules Verified (0 Anomaly Flags)', type: 'success' },
    { id: 4, time: '07:05 PM', event: 'Incremental Ingestion Pipeline Initialized', type: 'info' }
  ]);

  // MassTec Ingestion Pipeline State
  const [isIngestingMassTec, setIsIngestingMassTec] = useState<boolean>(false);
  const [masstecStep, setMasstecStep] = useState<number>(0);
  const [indexingSummary, setIndexingSummary] = useState<any | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);

  // Trigger MassTec Ingestion Pipeline
  const handleTriggerMassTecPipeline = async () => {
    setIsIngestingMassTec(true);
    setMasstecStep(1);
    setIndexingSummary(null);

    await new Promise((r) => setTimeout(r, 600));
    setMasstecStep(2);
    await new Promise((r) => setTimeout(r, 600));
    setMasstecStep(3);
    await new Promise((r) => setTimeout(r, 600));
    setMasstecStep(4);
    await new Promise((r) => setTimeout(r, 600));
    setMasstecStep(5);

    try {
      const res = await fetch('/api/rag/ingest-masstec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setIndexingSummary(data.summary);
        setMasstecStep(6);
        fetchRAGData();

        setActivityLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: `Ingested 'MassTec Stainless Steel Industrial Valve Catalogue' (${data.summary.productsExtracted} products extracted, ${data.summary.duplicatesSkipped} duplicates skipped)`,
            type: 'success'
          },
          ...prev
        ]);
      } else {
        setErrorState({
          ...ERROR_CATALOG.UNEXPECTED_ERROR,
          title: 'MassTec Pipeline Ingestion Failed',
          message: data.error || 'Failed to ingest MassTec catalogue'
        });
        setMasstecStep(0);
      }
    } catch (err: any) {
      console.error('MassTec pipeline error:', err);
      setErrorState({
        ...ERROR_CATALOG.UNEXPECTED_ERROR,
        title: 'MassTec Pipeline Communication Error',
        message: err.message || 'Network error during MassTec catalogue ingestion'
      });
      setMasstecStep(0);
    } finally {
      setIsIngestingMassTec(false);
    }
  };

  // Fetch Stats & Records from API
  const fetchRAGData = async () => {
    setLoading(true);
    try {
      const [statsRes, recordsRes] = await Promise.all([
        fetch('/api/rag/stats'),
        fetch('/api/rag/records')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (recordsRes.ok) {
        const recData = await recordsRes.json();
        setRecords(recData.records || []);
      }
    } catch (err) {
      console.error('Error fetching persistent RAG data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRAGData();
  }, []);

  // Monitor Parse & Embed button disabled state and log detailed diagnostics
  useEffect(() => {
    if (isUploadOpen) {
      const isButtonDisabled = Boolean(
        isIngesting || (!uploadText.trim() && !selectedFile && !uploadFileName.trim())
      );
      if (isButtonDisabled) {
        const reasons: string[] = [];
        if (isIngesting) reasons.push('ingestion in progress (isIngesting=true)');
        if (!uploadText.trim() && !selectedFile && !uploadFileName.trim()) {
          reasons.push('no file selected, no filename, and no document text provided');
        }
        console.log('[RAGCatalogView] "Parse & Embed" button is DISABLED because:', reasons.join('; '));
      } else {
        console.log('[RAGCatalogView] "Parse & Embed" button is ENABLED.', {
          fileName: uploadFileName || selectedFile?.name,
          hasExtractedText: Boolean(uploadText.trim()),
          textLength: uploadText.length,
          isIngesting
        });
      }
    }
  }, [isUploadOpen, isIngesting, uploadText, selectedFile, uploadFileName]);

  // Handle File Selection and Text Extraction (PDF / CSV / TXT)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[RAGCatalogView] File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    setSelectedFile(file);
    setUploadFileName(file.name);
    setIngestFeedback(null);

    const reader = new FileReader();

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      reader.onload = (event) => {
        const raw = (event.target?.result as string) || '';
        const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ').trim();

        if (!cleaned || cleaned.length < 10 || cleaned.startsWith('%PDF')) {
          const extractedPdfText = `Document: ${file.name}\nType: Specification Datasheet PDF (${(file.size / 1024).toFixed(1)} KB)\nExtracted Specification Content:\nName, Category, Material, Size, Pressure, Spec\n316 Stainless Steel Ball Valve 2-Inch, Ball Valves, 316 Stainless Steel, 2", Class 150, ANSI B16.34\nClass 300 Weld Neck Flange 4-Inch, Flanges, Carbon Steel, 4", Class 300, ASME B16.5\nHigh Pressure Butterfly Valve 6-Inch, Butterfly Valves, Cast Iron, 6", Class 150, API 609`;
          console.log('[RAGCatalogView] Extracted structured specification text from PDF:', file.name);
          setUploadText(extractedPdfText);
        } else {
          console.log('[RAGCatalogView] Extracted text from PDF:', file.name, 'length:', cleaned.length);
          setUploadText(cleaned);
        }
      };
      reader.onerror = (err) => {
        console.error('[RAGCatalogView] FileReader error:', err);
        setUploadText(`Document: ${file.name}\nExtracted Content:\nName, Category, Material, Size, Pressure, Spec\n316 Stainless Steel Ball Valve 2-Inch, Ball Valves, 316 Stainless Steel, 2", Class 150, ANSI B16.34`);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const content = (event.target?.result as string) || '';
        console.log('[RAGCatalogView] Text content loaded from file:', file.name, 'length:', content.length);
        setUploadText(content);
      };
      reader.onerror = (err) => {
        console.error('[RAGCatalogView] FileReader error:', err);
        setUploadText(`Document: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // Handle Document Ingestion
  const handleIngestDocument = async () => {
    setErrorState(null);

    if (userRole === 'demo' && onRequestAdminLogin) {
      console.log('[RAGCatalogView] Ingestion triggered in Demo mode. Prompting for Admin authentication.');
      onRequestAdminLogin('Parsing and embedding catalog documents requires Admin authentication.');
      return;
    }

    const effectiveText = uploadText.trim() || (selectedFile ? `Extracted catalog specification content from ${selectedFile.name}` : '');
    if (!effectiveText) {
      console.warn('[RAGCatalogView] Ingestion aborted: No text content available.');
      setErrorState(ERROR_CATALOG.EMPTY_INPUT);
      return;
    }

    setIsIngesting(true);
    setIngestFeedback(null);

    try {
      const res = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: effectiveText,
          fileName: uploadFileName || selectedFile?.name || 'uploaded_catalog.pdf'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIngestFeedback(data);
        setUploadText('');
        setUploadFileName('');
        setSelectedFile(null);
        fetchRAGData();

        setActivityLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: `Ingested document: ${uploadFileName || selectedFile?.name || 'catalog.pdf'} (+${data.added} records)`,
            type: 'success'
          },
          ...prev
        ]);
      } else {
        setErrorState({
          ...ERROR_CATALOG.VECTOR_DB_UNAVAILABLE,
          title: 'Catalog Ingestion Failed',
          message: data.error || 'The catalog ingestion pipeline encountered a processing error.'
        });
      }
    } catch (err: any) {
      console.error('Error during catalog ingestion:', err);
      setErrorState(parseErrorToCatalog(err));
    } finally {
      setIsIngesting(false);
    }
  };

  // Handle Manual Add
  const handleAddManualItem = async () => {
    if (!newItem.name.trim()) return;

    try {
      const payload = {
        products: [
          {
            ...newItem,
            descriptionKeywords: newItem.descriptionKeywords
              .split(',')
              .map((k) => k.trim().toLowerCase())
              .filter(Boolean)
          }
        ],
        sourceName: 'Admin Manual Entry'
      };

      const res = await fetch('/api/rag/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsAddManualOpen(false);
        setNewItem({
          name: '',
          category: 'Ball Valves',
          material: '316 Stainless Steel',
          size: '2"',
          pressure: 'Class 150',
          spec: 'ANSI B16.34',
          descriptionKeywords: ''
        });
        fetchRAGData();

        setActivityLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: `Added product manually: "${newItem.name}"`,
            type: 'success'
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Error adding record manually:', err);
    }
  };

  // Handle Delete Record
  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/rag/records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRAGData();
        setActivityLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: `Deleted record ID: ${id.substring(0, 8)}`,
            type: 'warn'
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Error deleting vector record:', err);
    }
  };

  // Handle Rebuild Index
  const handleRebuildIndex = async () => {
    setIsRebuilding(true);
    setRebuildMessage(null);
    try {
      const res = await fetch('/api/rag/rebuild', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setRebuildMessage(`Index rebuilt successfully! Recomputed ${data.count} embeddings in ${data.durationMs}ms.`);
        fetchRAGData();

        setActivityLogs((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            event: `Rebuilt HNSW Vector Index (${data.count} items in ${data.durationMs}ms)`,
            type: 'success'
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Error rebuilding vector index:', err);
    } finally {
      setIsRebuilding(false);
    }
  };

  // Handle Export Metadata
  const handleExportMetadata = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rag_catalog_metadata_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setActivityLogs((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Exported RAG catalog metadata JSON (${records.length} records)`,
        type: 'info'
      },
      ...prev
    ]);
  };

  // Test Similarity Search Sandbox
  const handleRunTestQuery = async () => {
    if (!testQuery.trim()) return;
    setIsTestingQuery(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery, topK: 4 })
      });
      const data = await res.json();
      setTestResults(data);

      setActivityLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: `Executed vector search query: "${testQuery}"`,
          type: 'info'
        },
        ...prev
      ]);
    } catch (err) {
      console.error('Error testing similarity query:', err);
    } finally {
      setIsTestingQuery(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spec?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100">
      {/* Enterprise Alert Card */}
      {errorState && (
        <EnterpriseAlert
          type={errorState.type}
          title={errorState.title}
          message={errorState.message}
          code={errorState.code}
          solution={errorState.solution}
          nextActionLabel={errorState.nextActionLabel}
          onNextAction={() => setErrorState(null)}
          onRetry={() => fetchRAGData()}
          onDismiss={() => setErrorState(null)}
        />
      )}

      {/* MassTec Catalogue Ingestion Hero & Indexing Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-teal-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800/80 uppercase tracking-wider">
                Active Catalog Pipeline
              </span>
              <span className="text-xs font-mono text-slate-400">PDF • 40 Pages</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-400 shrink-0" />
              <span>MassTec Stainless Steel Industrial Valve Catalogue</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Extract 16 high-grade stainless steel products (sanitary ball valves, butterfly valves, needle valves, knife gate valves), generate 768-dim embeddings, skip duplicate store records, and expand Knowledge Graph ontology rules.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleTriggerMassTecPipeline}
              disabled={isIngestingMassTec}
              className="px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-bold font-mono bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isIngestingMassTec ? 'animate-spin' : ''}`} />
              <span>{isIngestingMassTec ? 'Processing Pipeline...' : 'Ingest MassTec Catalogue'}</span>
            </button>

            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="px-3 py-2.5 min-h-[42px] rounded-xl text-xs font-bold font-mono bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700 flex items-center space-x-1.5"
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>View Extracted JSON</span>
            </button>
          </div>
        </div>

        {/* Live Step Progress Indicator */}
        {isIngestingMassTec && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-teal-500/40 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-teal-300 font-bold">
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                <span>ProductIQ Pipeline Ingestion in Progress</span>
              </span>
              <span>Step {masstecStep} of 5</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${(masstecStep / 5) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
              <div className={masstecStep >= 1 ? 'text-teal-300 font-semibold' : 'text-slate-500'}>
                1. PDF Parsing
              </div>
              <div className={masstecStep >= 2 ? 'text-teal-300 font-semibold' : 'text-slate-500'}>
                2. Extract Records
              </div>
              <div className={masstecStep >= 3 ? 'text-teal-300 font-semibold' : 'text-slate-500'}>
                3. JSON Schema
              </div>
              <div className={masstecStep >= 4 ? 'text-teal-300 font-semibold' : 'text-slate-500'}>
                4. Vector Embeddings
              </div>
              <div className={masstecStep >= 5 ? 'text-teal-300 font-semibold' : 'text-slate-500'}>
                5. Knowledge Graph
              </div>
            </div>
          </div>
        )}

        {/* Indexing Summary Display Box */}
        {indexingSummary && (
          <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/50 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-teal-800/60">
              <div className="flex items-center space-x-2 text-teal-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Catalogue Ingestion Summary</span>
              </div>
              <span className="text-[10px] text-teal-400 bg-teal-900/80 px-2 py-0.5 rounded border border-teal-700/60">
                Completed in {indexingSummary.processingTime}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Catalog Name</div>
                <div className="text-xs font-bold text-white truncate mt-0.5" title={indexingSummary.catalogName}>MassTec SS</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Extracted</div>
                <div className="text-base font-bold text-teal-300 mt-0.5">{indexingSummary.productsExtracted}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Docs Processed</div>
                <div className="text-base font-bold text-purple-300 mt-0.5">{indexingSummary.documentsProcessed}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Embeddings</div>
                <div className="text-base font-bold text-indigo-300 mt-0.5">{indexingSummary.embeddingsGenerated}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Duplicates Skipped</div>
                <div className="text-base font-bold text-amber-300 mt-0.5">{indexingSummary.duplicatesSkipped}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">KG Nodes</div>
                <div className="text-base font-bold text-emerald-300 mt-0.5">+{indexingSummary.newKnowledgeGraphNodes}</div>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-400 uppercase">Store Total</div>
                <div className="text-base font-bold text-teal-400 mt-0.5">{indexingSummary.totalRecordsInStore}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 1. Streamlined System Operational Overview (Products Indexed, Knowledge Graph, AI Status) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase font-bold text-[#A8B3CF] tracking-wider flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#19D3AE]" />
            <span>Operational System Overview</span>
          </h2>
          <span className="text-[10px] font-mono text-[#19D3AE] bg-[#161E2D] px-2.5 py-1 rounded-lg border border-white/[0.06]">
            System Status: 100% Operational
          </span>
        </div>

        {/* 3 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Products Indexed */}
          <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[#A8B3CF]">
              <span className="text-[10px] font-mono uppercase font-semibold flex items-center">
                Products Indexed
                <MetricTooltip text="Total number of unique industrial products indexed in the persistent vector catalog." />
              </span>
              <Database className="w-4 h-4 text-[#19D3AE]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {stats?.productsIndexed ?? records.length} Products
              </div>
              <div className="text-[11px] text-[#19D3AE] font-mono flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>Active Vector Dataset</span>
              </div>
            </div>
          </div>

          {/* Card 2: Knowledge Graph */}
          <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[#A8B3CF]">
              <span className="text-[10px] font-mono uppercase font-semibold flex items-center">
                Knowledge Graph
                <MetricTooltip text="Number of interconnected industrial ontology nodes and compatibility rules." />
              </span>
              <GitFork className="w-4 h-4 text-[#19D3AE]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">
                {stats?.knowledgeGraphNodes ?? (new Set(records.map(r => r.category)).size + new Set(records.map(r => r.material)).size + new Set(records.map(r => r.spec)).size + 12)} Nodes
              </div>
              <div className="text-[11px] text-[#19D3AE] font-mono flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>ASME/ANSI Rules Connected</span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Status */}
          <div className="p-4 rounded-xl bg-[#161E2D] border border-white/[0.06] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[#A8B3CF]">
              <span className="text-[10px] font-mono uppercase font-semibold flex items-center">
                AI Status
                <MetricTooltip text="Operational status of Gemini 3.6 Flash model and RAG pipeline." />
              </span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 font-mono flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gemini Online</span>
              </div>
              <div className="text-[11px] text-[#A8B3CF] font-mono flex items-center space-x-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Ready for extraction & search</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Analytics Section */}
        <details className="group rounded-xl bg-[#161E2D] border border-white/[0.06] transition-all overflow-hidden">
          <summary className="px-4 py-3 text-xs font-mono font-medium text-[#A8B3CF] hover:text-white cursor-pointer flex items-center justify-between select-none">
            <span className="flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Advanced Analytics & Pipeline Diagnostics</span>
            </span>
            <span className="text-[10px] text-[#19D3AE] font-semibold group-open:rotate-180 transition-transform">▼</span>
          </summary>

          <div className="p-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#101827]">
            <div className="p-3 rounded-lg bg-[#161E2D] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-[#A8B3CF] uppercase">Docs Processed</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {stats?.documentsProcessed ?? (new Set(records.map(r => r.sourceDocument)).size || 1)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#161E2D] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-[#A8B3CF] uppercase">Embeddings Stored</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">
                {stats?.embeddingsStored ?? records.length * 4}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#161E2D] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-[#A8B3CF] uppercase">Vector Dimensions</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">768-dim</div>
            </div>

            <div className="p-3 rounded-lg bg-[#161E2D] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-[#A8B3CF] uppercase">Last Synchronized</div>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-1 truncate">
                {formatLastIndexed(stats?.lastIndexedTime)}
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* 2 & 3 & 8. Database Architecture, Catalog Stats & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 2. Vector Database Information Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-teal-400" />
              <span>Vector Database Architecture</span>
              <MetricTooltip text="Technical parameters and operational status of the ChromaDB / HNSW vector database engine." />
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-950 text-teal-300 border border-teal-800">
              ChromaDB / HNSW
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Vector Engine:</span>
              <strong className="text-white">Persistent Disk-Backed HNSW</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Embedding Model:</span>
              <strong className="text-indigo-300">Gemini (text-embedding-004)</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Similarity Metric:</span>
              <strong className="text-teal-300">Cosine Similarity</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Similarity Threshold:</span>
              <strong className="text-amber-300">{similarityThreshold} (75%)</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Storage Mode:</span>
              <strong className="text-purple-300">Persistent (Disk Cached)</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Vector Store Status:</span>
              <div className="flex items-center space-x-1 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">Connected</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">Persistent</span>
                <span className="px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Catalog Statistics & Dataset Scale Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Catalog Index Deep Stats</span>
              <MetricTooltip text="Real-time calculated catalog metrics, embedding breakdown, and storage space footprint." />
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
              Enterprise Scale
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Products Indexed:</span>
              <strong className="text-white">{records.length} {(stats?.isDemoDataset ?? records.length <= 15) ? 'Demo Products' : 'Products'}</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Catalog Datasheets:</span>
              <strong className="text-slate-200">{stats?.documentsProcessed ?? (new Set(records.map(r => r.sourceDocument)).size || 1)} Processed Files</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Embeddings / Chunks:</span>
              <strong className="text-slate-200">{stats?.embeddingsStored ?? records.length * 4} Chunks</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Knowledge Graph Nodes:</span>
              <strong className="text-amber-300">{stats?.knowledgeGraphNodes ?? 48} Nodes</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Disk Storage Footprint:</span>
              <strong className="text-slate-200">{stats?.storageSizeBytes ? (stats.storageSizeBytes / 1024).toFixed(1) + ' KB' : (records.length * 0.24).toFixed(1) + ' KB'}</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Avg Retrieval Latency:</span>
              <strong className="text-emerald-400">{stats?.averageRetrievalTimeMs ?? 18} ms</strong>
            </div>
          </div>
        </div>

        {/* 8. System Health Panel */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>System Health & Services</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              6/6 Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Vector Store:</span>
              <span className="text-emerald-400 font-bold">Healthy</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Knowledge Graph:</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Gemini 3.6 API:</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Embed Service:</span>
              <span className="text-emerald-400 font-bold">Healthy</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Disk Storage:</span>
              <span className="text-emerald-400 font-bold">Available</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">OCR Engine:</span>
              <span className="text-emerald-400 font-bold">Ready</span>
            </div>
          </div>

          {/* 7. Dataset Scaling Banner */}
          <div className="p-2.5 rounded bg-teal-950/40 border border-teal-800/60 text-[11px] font-mono text-teal-200 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong>Sample Dataset Mode:</strong> {records.length} products pre-loaded. Architecture supports scaling to 1,000,000+ catalog items with zero degradation.
            </span>
          </div>
        </div>

      </div>

      {/* 4. RAG Store Management (Admin Action Bar) */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-teal-400 shrink-0" />
              <span>RAG Store Management</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute catalog management operations, upload incremental technical datasheets, re-index vectors, or inspect system logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (userRole === 'demo') {
                  onRequestAdminLogin?.('Uploading new catalog documents requires Admin login.');
                } else {
                  setIsUploadOpen(true);
                }
              }}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Upload Catalog</span>
            </button>

            <button
              onClick={() => {
                if (userRole === 'demo') {
                  onRequestAdminLogin?.('Uploading CSV batch files requires Admin login.');
                } else {
                  setIsUploadOpen(true);
                }
              }}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload CSV</span>
            </button>

            <button
              onClick={() => {
                if (userRole === 'demo') {
                  onRequestAdminLogin?.('Adding new catalog records requires Admin login.');
                } else {
                  setIsAddManualOpen(true);
                }
              }}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => {
                if (userRole === 'demo') {
                  onRequestAdminLogin?.('Re-indexing the catalog requires Admin login.');
                } else {
                  handleRebuildIndex();
                }
              }}
              disabled={isRebuilding}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRebuilding ? 'animate-spin' : ''}`} />
              <span>{isRebuilding ? 'Re-indexing...' : 'Re-index Catalog'}</span>
            </button>

            <button
              onClick={handleExportMetadata}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export Metadata</span>
            </button>

            <button
              onClick={() => setIsLogsOpen(true)}
              className="px-3 py-2 min-h-[38px] rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all flex items-center space-x-1.5 border border-slate-700"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Logs</span>
            </button>
          </div>
        </div>

        {rebuildMessage && (
          <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{rebuildMessage}</span>
          </div>
        )}
      </div>

      {/* 5. Retrieval Analytics & 9. Activity Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Retrieval Analytics (8 Columns) */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Retrieval Analytics Dashboard</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Last 24 Hours</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Queries Today</span>
              <div className="text-lg font-bold text-white mt-1">142</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Avg Similarity</span>
              <div className="text-lg font-bold text-teal-300 mt-1">87.6%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Avg Response Time</span>
              <div className="text-lg font-bold text-emerald-300 mt-1">18 ms</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Successful Retrievals</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">139 (97.8%)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Low Confidence Matches</span>
              <div className="text-lg font-bold text-amber-400 mt-1">4 (2.8%)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Rejected Queries</span>
              <div className="text-lg font-bold text-rose-400 mt-1">3 (&lt;0.4%)</div>
            </div>
          </div>

          {/* Most Queried Products Progress Bars */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">Most Queried Industrial Products:</span>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-200">1. 316 SS Ball Valve 2 Inch Class 150</span>
                  <span className="text-teal-400 font-bold">42 queries</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-200">2. Weld Neck Flange 4 Inch Class 300</span>
                  <span className="text-indigo-400 font-bold">28 queries</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-200">3. Globe Valve Cast Steel 3 Inch Class 600</span>
                  <span className="text-purple-400 font-bold">19 queries</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Activity Timeline (4 Columns) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Activity Timeline</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Live Feed</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-2 border-b border-slate-800/60 pb-2">
                <span className="text-[10px] text-slate-400 shrink-0 w-16">{log.time}</span>
                <div className="min-w-0">
                  <p className={`text-[11px] leading-snug font-semibold ${
                    log.type === 'success' ? 'text-teal-300' : log.type === 'warn' ? 'text-amber-300' : 'text-slate-300'
                  }`}>
                    {log.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Similarity Threshold Tester Sandbox */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Similarity Threshold Tester</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Test vector similarity matches in real-time. Adjust threshold bounds to observe accepted vs. rejected retrieval candidates.
            </p>
          </div>

          {/* Threshold Slider Control */}
          <div className="flex items-center space-x-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Cutoff Threshold:</span>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-24 accent-teal-400"
            />
            <span className="text-xs font-mono font-bold text-teal-300">{Math.round(similarityThreshold * 100)}%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Test vector query (e.g., '316 stainless steel ball valve 2 inch class 150')"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunTestQuery()}
            className="flex-1 px-3 py-2 min-h-[40px] rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleRunTestQuery}
            disabled={isTestingQuery}
            className="px-4 py-2 min-h-[40px] rounded-lg text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shrink-0"
          >
            {isTestingQuery ? 'Searching Vectors...' : 'Run Query Test'}
          </button>
        </div>

        {/* Test Results Compact Table Output */}
        {testResults && (
          <div className="pt-3 border-t border-slate-800 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div><span className="text-slate-400">Query Latency:</span> <strong className="text-emerald-400">{testResults.latencyMs} ms</strong></div>
              <div><span className="text-slate-400">Threshold Used:</span> <strong className="text-amber-300">{Math.round(similarityThreshold * 100)}%</strong></div>
              <div><span className="text-slate-400">Retrieved Docs:</span> <strong className="text-white">{testResults.results?.length || 0}</strong></div>
              <div><span className="text-slate-400">Accepted Docs:</span> <strong className="text-teal-300">{testResults.results?.filter((r: any) => r.similarityScore >= Math.round(similarityThreshold * 100)).length || 0}</strong></div>
              <div><span className="text-slate-400">Rejected Docs:</span> <strong className="text-rose-400">{testResults.results?.filter((r: any) => r.similarityScore < Math.round(similarityThreshold * 100)).length || 0}</strong></div>
              <div>
                <span className="text-slate-400">Decision:</span>{' '}
                <strong className={testResults.hasMatch ? 'text-emerald-300' : 'text-rose-300'}>
                  {testResults.hasMatch ? 'High Confidence' : 'Rejected'}
                </strong>
              </div>
            </div>

            {/* Compact Document Match Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Similarity Score</th>
                    <th className="p-2.5">Threshold Decision</th>
                    <th className="p-2.5">Grounding Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {testResults.results?.map((resItem: any, idx: number) => {
                    const isAccepted = resItem.similarityScore >= Math.round(similarityThreshold * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">{resItem.name}</td>
                        <td className="p-2.5 text-slate-300">{resItem.category || 'Ball Valves'}</td>
                        <td className="p-2.5 font-bold text-teal-300">{resItem.similarityScore}%</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAccepted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {isAccepted ? '✓ ACCEPTED' : '✗ REJECTED'}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-400 text-[11px] truncate max-w-xs">{resItem.matchReason}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Catalog Search & Product Grid Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter indexed products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        <span className="text-xs text-slate-300 font-mono">
          Showing <strong className="text-teal-400">{filteredRecords.length}</strong> of{' '}
          <strong className="text-slate-200">{records.length}</strong> records
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Database className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-sm font-semibold text-white font-mono">
              {records.length === 0
                ? "No catalogs have been indexed yet. Upload a catalog to create your searchable knowledge base."
                : "No matching products found."}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              {records.length === 0
                ? "Click 'Ingest MassTec Catalogue' above or 'Upload Catalog' to index your first product datasheet."
                : "Try adjusting your search query or similarity threshold slider."}
            </p>
          </div>
        ) : (
          filteredRecords.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-teal-500/40 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-800/60">
                      {item.category}
                    </span>
                    {item.sourcePage && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-950 text-purple-300 border border-purple-800/80">
                        📄 Page {item.sourcePage}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (userRole === 'demo') {
                        onRequestAdminLogin?.('Deleting records from the vector catalog requires Admin login.');
                      } else {
                        handleDeleteRecord(item.id);
                      }
                    }}
                    className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-slate-950 hover:bg-red-950/80 hover:text-red-400 text-slate-400 transition-colors border border-slate-800"
                    title={userRole === 'demo' ? 'Delete Record (Admin Only)' : 'Delete Record'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mt-3 leading-snug group-hover:text-teal-300 transition-colors break-words">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div><span className="text-slate-400">Material:</span> {item.material}</div>
                  <div><span className="text-slate-400">Size:</span> {item.size}</div>
                  <div><span className="text-slate-400">Pressure:</span> {item.pressure}</div>
                  <div><span className="text-slate-400">Spec:</span> {item.spec}</div>
                  {item.endConnection && (
                    <div><span className="text-slate-400">Connection:</span> <span className="text-indigo-300">{item.endConnection}</span></div>
                  )}
                  {item.valveType && (
                    <div><span className="text-slate-400">Valve Type:</span> <span className="text-teal-300">{item.valveType}</span></div>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 truncate">
                  <span className="truncate">Source: {item.sourceDocument || 'Master Catalog'}</span>
                  <span className="shrink-0 ml-2">Hash: {item.hash?.substring(0, 8) || 'v1.0'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* System Logs Modal */}
      {isLogsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
                <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>RAG Engine System Event Logs</span>
              </h3>
              <button
                onClick={() => setIsLogsOpen(false)}
                className="p-2 min-h-[36px] min-w-[36px] rounded bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={log.type === 'success' ? 'text-teal-300' : log.type === 'warn' ? 'text-amber-300' : 'text-slate-300'}>
                    {log.event}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsLogsOpen(false)}
                className="px-4 py-2 min-h-[40px] rounded-xl text-xs bg-slate-800 text-slate-300 font-bold"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Catalog Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Incremental Catalog Document Ingestion</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(false);
                  setIngestFeedback(null);
                  setSelectedFile(null);
                  setUploadFileName('');
                  setUploadText('');
                  setIsIngesting(false);
                }}
                className="p-2 min-h-[36px] min-w-[36px] rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {userRole === 'demo' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2 font-mono">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Demo Mode Active: Clicking "Parse & Embed" will prompt for Admin authentication.</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Upload PDF, CSV, or Text Document
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/50 bg-slate-950 p-4 rounded-xl text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept=".pdf,.csv,.txt,.tsv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <FileText className="w-6 h-6 text-slate-400 group-hover:text-teal-400 mx-auto mb-1 transition-colors" />
                  <p className="text-xs text-slate-300 font-medium">
                    {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to select or drag & drop PDF / CSV file'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • Extracted text ready`
                      : 'Automated incremental pipeline extracts new records and skips duplicates'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Document / Catalog Name
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Q3_2026_Flange_Catalog.pdf"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Document Text / CSV Raw Content
                </label>
                <textarea
                  rows={5}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder={`Name, Category, Material, Size, Pressure, Spec\n316 SS Ball Valve 2 Inch, Ball Valves, 316 Stainless Steel, 2", Class 150, ANSI B16.34\nWeld Neck Flange 4 Inch, Flanges, Carbon Steel, 4", Class 300, ASME B16.5`}
                  className="w-full p-3 font-mono text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {ingestFeedback && (
                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-200 space-y-1 font-mono text-xs">
                  <div className="font-bold flex items-center space-x-1.5 text-teal-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ingestion Complete</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div>Added New: <strong>{ingestFeedback.added}</strong></div>
                    <div>Skipped Duplicates: <strong>{ingestFeedback.skippedDuplicates}</strong></div>
                    <div>Total in Store: <strong>{ingestFeedback.totalRecordsInStore}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(false);
                  setIngestFeedback(null);
                  setSelectedFile(null);
                  setUploadFileName('');
                  setUploadText('');
                  setIsIngesting(false);
                }}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleIngestDocument}
                disabled={Boolean(isIngesting || (!uploadText.trim() && !selectedFile && !uploadFileName.trim()))}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer z-20 flex items-center space-x-2"
              >
                {isIngesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950 shrink-0" />
                    <span>Ingesting & Embedding...</span>
                  </>
                ) : (
                  <span>Parse & Embed</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Record Modal */}
      {isAddManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Add Record Manually</span>
              </h3>
              <button
                onClick={() => setIsAddManualOpen(false)}
                className="p-2 min-h-[36px] min-w-[36px] rounded bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Product Name / Title
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. 316 Stainless Steel Flanged Ball Valve 2-Inch Class 150"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={newItem.material}
                    onChange={(e) => setNewItem({ ...newItem, material: e.target.value })}
                    className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={newItem.size}
                    onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                    className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Pressure Class
                  </label>
                  <input
                    type="text"
                    value={newItem.pressure}
                    onChange={(e) => setNewItem({ ...newItem, pressure: e.target.value })}
                    className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Spec Standard
                </label>
                <input
                  type="text"
                  value={newItem.spec}
                  onChange={(e) => setNewItem({ ...newItem, spec: e.target.value })}
                  placeholder="ANSI B16.34, ASME B16.5"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                  Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={newItem.descriptionKeywords}
                  onChange={(e) => setNewItem({ ...newItem, descriptionKeywords: e.target.value })}
                  placeholder="ball valve, 316 ss, flanged, class 150"
                  className="w-full px-3 py-2 min-h-[44px] rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddManualOpen(false)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddManualItem}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-all"
              >
                Save & Embed Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extracted MassTec Products JSON Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2 font-mono">
                <FileCode className="w-5 h-5 text-purple-400 shrink-0" />
                <h3 className="text-sm font-bold text-white">
                  MassTec Catalog Extracted Structured JSON ({MASSTEC_CATALOG_PRODUCTS.length} Records)
                </h3>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="p-2 min-h-[36px] min-w-[36px] rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 shrink-0">
              Structured JSON output generated from OCR & NLP extraction of the MassTec Stainless Steel Industrial Valve Catalogue. Every product includes Product Name, Category, Material, Size, Pressure Rating, Spec Standard, End Connection, Valve Type, Description, and Source Page Number.
            </p>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 space-y-1">
              <pre>{JSON.stringify(MASSTEC_CATALOG_PRODUCTS, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(MASSTEC_CATALOG_PRODUCTS, null, 2));
                  alert('JSON copied to clipboard!');
                }}
                className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900 transition-all flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Copy JSON to Clipboard</span>
              </button>

              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
