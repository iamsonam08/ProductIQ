import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  MessageSquare,
  Send,
  Database,
  Layers,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  HelpCircle,
  Lock,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ProductIntelligenceResult, CatalogChatResponseType } from '../types';

interface AskCatalogViewProps {
  processedBatchItems?: ProductIntelligenceResult[];
}

const SAMPLE_QUESTIONS = [
  'Show all ball valves',
  'Which products are made of stainless steel?',
  'Show me all valves rated above 300 psi',
  'Which products have low confidence scores?',
  'List all products that need review',
  'Compare Gate Valve and Ball Valve'
];

export const AskCatalogView: React.FC<AskCatalogViewProps> = ({
  processedBatchItems = []
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      responseType: 'normal',
      text: `Your catalog is ready. Ask a question about any indexed product.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      canAnswer: true,
      confidenceScore: 100,
      reasoning: 'Assistant initialized and connected to the indexed product catalog.'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/catalog-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          clientProcessedItems: processedBatchItems
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        responseType: (data.responseType as CatalogChatResponseType) || 'normal',
        text: data.answer || 'I could not generate an answer at this time.',
        reasoning: data.reasoning,
        confidenceScore: data.confidenceScore,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedProducts: data.referencedProducts || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        canAnswer: data.canAnswer ?? true
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Catalog Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        responseType: 'system_error',
        text: `The catalog could not be searched. Please try again.`,
        reasoning: `API communication error: ${err.message || 'Unknown network error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canAnswer: false
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        responseType: 'normal',
        text: `Conversation history cleared. Enter a product specification query to search your grounded catalog.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canAnswer: true,
        confidenceScore: 100,
        reasoning: 'System reset completed.'
      }
    ]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto font-sans">
      
      {/* Top Header Banner */}
      <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Ask Your Catalog — Grounded Industrial Assistant</span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Enterprise-grade technical query engine. Strictly grounded on stored catalog records and batch results with verifiable citations.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {messages.length > 1 && (
              <button
                onClick={handleClearHistory}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all hover:border-red-500/40 hover:text-red-300 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex flex-col h-[600px] overflow-hidden shadow-xl relative">
        
        {/* Chat Stream Header */}
        <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-semibold text-slate-200 tracking-wide uppercase text-[11px] font-mono">
              Industrial Catalog Grounding Session
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>RAG Store</span>
            </span>
            {processedBatchItems.length > 0 && (
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{processedBatchItems.length} Batch Items</span>
              </span>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header Label */}
              <div className="flex items-center space-x-2 mb-1 text-[11px] text-slate-400">
                {msg.sender === 'assistant' ? (
                  <>
                    <div className="w-4 h-4 rounded bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <Bot className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-slate-200">Catalog Assistant</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-slate-300">You</span>
                    <div className="w-4 h-4 rounded bg-white/10 border border-white/15 flex items-center justify-center text-slate-300">
                      <User className="w-3 h-3" />
                    </div>
                  </>
                )}
                <span className="font-mono text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Message Content Container - Max Width 90% on mobile, 82% on sm+ */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed transition-all break-words overflow-hidden ${
                  msg.sender === 'user'
                    ? 'bg-teal-500/20 border border-teal-500/30 text-slate-100 rounded-tr-none'
                    : 'bg-white/10 backdrop-blur-md border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'assistant' ? (
                  <div className="space-y-3">
                    
                    {/* 1. Out-of-Scope Query Card */}
                    {msg.responseType === 'out_of_scope' && (
                      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 space-y-3">
                        <div className="flex items-center space-x-2 font-semibold text-sm text-blue-300">
                          <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>Out-of-Scope Query</span>
                        </div>

                        <p className="text-xs text-blue-100/90 leading-relaxed font-normal">
                          This assistant is grounded exclusively on the industrial product catalog stored in the knowledge base. It cannot answer general knowledge questions or generate information outside the available catalog records.
                        </p>

                        <div className="pt-2 border-t border-blue-500/20 space-y-1.5">
                          <span className="text-[11px] font-semibold text-blue-300 block">
                            Please ask about:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-blue-200/80">
                            <span>• Products</span>
                            <span>• Materials</span>
                            <span>• Pressure ratings</span>
                            <span>• Standards (ANSI, ASME, API)</span>
                            <span>• Sizes</span>
                            <span>• Specifications</span>
                            <span>• Inventory</span>
                            <span>• Technical comparisons</span>
                          </div>
                        </div>

                        {/* Suggested Questions in Out-of-Scope Card */}
                        <div className="pt-2 border-t border-blue-500/20 space-y-2">
                          <span className="text-[11px] font-semibold text-blue-300 block">
                            Suggested Questions:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'Show all valves above 300 psi',
                              'Which products are made of stainless steel?',
                              'List products requiring manual review.',
                              'Compare Gate Valve and Ball Valve.',
                              'Show products following ANSI B16.34.'
                            ].map((sq, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => handleSendMessage(sq)}
                                className="px-2.5 py-2 min-h-[36px] rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-100 text-[11px] transition-all text-left flex items-center space-x-1 max-w-full break-words"
                              >
                                <span>{sq}</span>
                                <ArrowRight className="w-3 h-3 text-blue-400 shrink-0 ml-auto" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. No Matching Products Card */}
                    {msg.responseType === 'no_matches' && (
                      <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2.5">
                        <div className="flex items-center space-x-2 font-semibold text-xs sm:text-sm text-amber-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>No Relevant Products Found</span>
                        </div>
                        <p className="text-xs text-amber-100/90 leading-relaxed font-normal">
                          The provided input could not be matched with sufficient confidence to any catalog records.
                        </p>
                        <div className="pt-2 border-t border-amber-500/20 space-y-1">
                          <span className="text-[11px] font-semibold text-amber-300 block">Suggestions:</span>
                          <ul className="list-disc list-inside text-[11px] text-amber-200/80 space-y-0.5 font-normal">
                            <li>Check spelling</li>
                            <li>Enter more product information</li>
                            <li>Upload a technical specification</li>
                            <li>Try a different search query</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* 3. System Error Card */}
                    {msg.responseType === 'system_error' && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 space-y-1.5">
                        <div className="flex items-center space-x-2 font-semibold text-xs text-red-300">
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>Temporary System Error</span>
                        </div>
                        <p className="text-xs text-red-100/90 leading-relaxed font-normal">
                          {msg.text}
                        </p>
                      </div>
                    )}

                    {/* 4. Ambiguous / Clarification Mode */}
                    {msg.responseType === 'ambiguous' && (
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 space-y-2.5">
                        <div className="flex items-center space-x-2 font-semibold text-xs text-indigo-300">
                          <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>Request Requires Specification</span>
                        </div>
                        <div className="prose prose-invert prose-xs max-w-none text-xs text-indigo-100 break-words overflow-x-auto">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    )}

                    {/* 5. Normal Grounded Answer */}
                    {(msg.responseType === 'normal' || !msg.responseType) && (
                      <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed space-y-2 break-words overflow-x-auto">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}

                    {/* Grounding & Reasoning Badge */}
                    {msg.reasoning && msg.responseType !== 'out_of_scope' && (
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/10 text-[11px] text-slate-300 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-teal-400 uppercase font-semibold">
                          <span className="flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                            <span>Reasoning & Grounding Trace</span>
                          </span>
                          {msg.confidenceScore !== undefined && (
                            <span className="text-emerald-400 font-mono">
                              ✓ {msg.confidenceScore}% Grounded
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300/90 leading-relaxed font-normal break-words">
                          {msg.reasoning}
                        </p>
                      </div>
                    )}

                    {/* Traceable Source Citations */}
                    {msg.referencedProducts && msg.referencedProducts.length > 0 && (
                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                          <span className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Source Citations ({msg.referencedProducts.length})</span>
                          </span>
                          <span>Verified Inventory Records</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.referencedProducts.map((p, idx) => (
                            <div
                              key={p.id || idx}
                              className="p-2 rounded-lg bg-slate-950/60 border border-white/10 space-y-1 hover:border-teal-500/30 transition-all text-[11px]"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-slate-200 truncate">{p.name}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-teal-300 border border-teal-500/20 shrink-0">
                                  {p.sourceType === 'processed_batch' ? 'Batch Record' : 'RAG Catalog'}
                                </span>
                              </div>

                              <div className="text-[10px] text-slate-400 font-mono flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>{p.category || 'N/A'}</span>
                                {p.material && <span>• {p.material}</span>}
                                {p.pressure && <span>• {p.pressure}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Follow-up Questions Chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && msg.responseType !== 'out_of_scope' && (
                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                          Suggested Follow-up Queries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((sf, sfIdx) => (
                            <button
                              key={sfIdx}
                              onClick={() => handleSendMessage(sf)}
                              className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 text-slate-200 text-[11px] transition-all flex items-center space-x-1"
                            >
                              <span>{sf}</span>
                              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <p className="whitespace-pre-wrap font-sans break-words">{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <div className="w-4 h-4 rounded bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-200">Catalog Assistant</span>
              </div>

              <div className="p-3.5 rounded-2xl rounded-tl-none bg-white/10 border border-white/10 text-xs flex items-center space-x-3 text-slate-300">
                <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                <span className="font-mono text-[11px]">Searching product records & verifying grounding logic...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Global Prompt Chips Bar */}
        <div className="px-5 py-2 border-t border-white/10 bg-white/[0.01]">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-teal-400" />
              <span>Sample Prompts:</span>
            </span>
            {SAMPLE_QUESTIONS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-teal-500/40 transition-all shrink-0 whitespace-nowrap"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Input Control Box */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about ball valves, 316 stainless steel, high-pressure ratings, or items needing review..."
              rows={1}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/60 leading-normal resize-none font-sans"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputQuery.trim()}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                loading || !inputQuery.trim()
                  ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 border border-teal-400/40 hover:shadow-lg hover:shadow-teal-500/20'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-teal-950" />
              ) : (
                <>
                  <span>Search</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
