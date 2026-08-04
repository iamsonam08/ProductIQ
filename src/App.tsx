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
import { Cpu } from 'lucide-react';
import { ProductIntelligenceResult } from './types';

function MainAppContent() {
  const {
    userRole,
    isAdminModalOpen,
    openAdminModal,
    closeAdminModal,
    pendingNotice,
    loginAsDemo,
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
    <div className="min-h-screen bg-[#070B14] text-white font-sans selection:bg-[#19D3AE]/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Subtle Glass Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#19D3AE]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Top Demo Banner */}
      <DemoBanner
        userRole={userRole === 'admin' ? 'admin' : 'demo'}
        onOpenAdminLogin={() => openAdminModal('Switching to Admin Mode enables full catalog write operations.')}
        onSwitchToDemo={loginAsDemo}
      />

      {/* Top Header Navigation */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          onOpenArchitecture={() => setIsArchOpen(true)}
          onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
          onGoToLanding={() => setActiveTab('landing')}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex-1">
          {activeTab === 'single' && (
            <SingleProductView
              onAskAboutProduct={(_prod) => setActiveTab('askCatalog')}
            />
          )}
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

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#070B14] py-4 text-xs text-[#A8B3CF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-[#19D3AE]" />
            <span
              onClick={() => setActiveTab('landing')}
              className="font-bold text-white cursor-pointer hover:text-[#19D3AE] transition-colors"
            >
              ProductIQ
            </span>
            <span className="text-[#A8B3CF]/40">•</span>
            <span className="text-[#A8B3CF]/80">AI Product Intelligence Platform</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              type="button"
              onClick={() => setIsArchOpen(true)}
              className="text-[#19D3AE] hover:underline cursor-pointer"
            >
              Pipeline Architecture
            </button>
            <span className="text-[#A8B3CF]/40">•</span>
            <span className="text-[#A8B3CF]/60 font-mono">Gemini 3.6 Engine</span>
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
