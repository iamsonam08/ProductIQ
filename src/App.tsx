import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { LandingPage } from './components/LandingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { SingleProductView } from './components/SingleProductView';
import { BatchProcessingView } from './components/BatchProcessingView';
import { AskCatalogView } from './components/AskCatalogView';
import { RAGCatalogView } from './components/RAGCatalogView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Cpu, Database, GitFork, Zap } from 'lucide-react';
import { ProductIntelligenceResult } from './types';

function MainAppContent() {
  const {
    userRole,
    isAdminModalOpen,
    openAdminModal,
    closeAdminModal,
    pendingNotice,
    loginAsDemo,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'landing' | 'single' | 'batch' | 'askCatalog' | 'rag' | 'knowledgeGraph'>('single');
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState<boolean>(false);
  const [processedBatchItems, setProcessedBatchItems] = useState<ProductIntelligenceResult[]>([]);

  // If user is on landing page, render LandingPage component
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onStartDemo={() => {
            loginAsDemo();
            setActiveTab('single');
          }}
          onOpenAdminAuth={() => {
            openAdminModal('Signing in grants administrative privileges over vector stores & catalogs.');
          }}
        />
        <AdminLoginModal
          isOpen={isAdminModalOpen}
          onClose={closeAdminModal}
          pendingActionNotice={pendingNotice}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Subtle Glass Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Top Demo Banner */}
      <DemoBanner
        userRole={userRole === 'admin' ? 'admin' : 'demo'}
        onOpenAdminLogin={() => openAdminModal('Switching to Admin Mode enables full catalog write operations.')}
        onSwitchToDemo={loginAsDemo}
      />

      {/* Top Header Navigation */}
      <div className="relative z-10">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          onOpenArchitecture={() => setIsArchOpen(true)}
          onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
          onGoToLanding={() => setActiveTab('landing')}
        />

        {/* Compact Dashboard Header */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg space-y-3 relative overflow-hidden">
            
            {/* Subtle top edge accent line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-teal-500/0 via-teal-400/40 to-teal-500/0" />

            {/* Heading & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
                <span>Next-Gen Product Intelligence Pipeline</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                Transform fragmented industrial product information into structured, validated, and commerce-ready intelligence using AI, RAG, document intelligence, and knowledge graph validation.
              </p>
            </div>

            {/* Three Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <Database className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>RAG Store</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Active</span>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <GitFork className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Knowledge Graph</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-indigo-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Connected</span>
                </div>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Gemini 3.6 Flash</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
          {activeTab === 'single' && <SingleProductView />}
          {activeTab === 'batch' && (
            <BatchProcessingView
              batchResults={processedBatchItems}
              onBatchResultsChange={(items) => setProcessedBatchItems(items)}
            />
          )}
          {activeTab === 'askCatalog' && (
            <AskCatalogView processedBatchItems={processedBatchItems} />
          )}
          {activeTab === 'rag' && (
            <RAGCatalogView
              userRole={userRole === 'admin' ? 'admin' : 'demo'}
              onRequestAdminLogin={(notice) => openAdminModal(notice)}
            />
          )}
          {activeTab === 'knowledgeGraph' && (
            <KnowledgeGraphView
              userRole={userRole === 'admin' ? 'admin' : 'demo'}
              onRequestAdminLogin={(notice) => openAdminModal(notice)}
            />
          )}
        </main>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={closeAdminModal}
        pendingActionNotice={pendingNotice}
      />

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
      />

      {/* Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* Glassmorphism Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/[0.02] backdrop-blur-lg py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span
              onClick={() => setActiveTab('landing')}
              className="font-semibold text-slate-200 cursor-pointer hover:text-white"
            >
              ProductIQ
            </span>
            <span className="text-slate-600">•</span>
            <span>Commerce-Ready Product Intelligence Platform</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-normal">
            <button
              onClick={() => setIsArchOpen(true)}
              className="text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              Pipeline Architecture
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono">Firebase Auth & Gemini 3.6 Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
