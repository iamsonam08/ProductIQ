import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Database,
  GitFork,
  BookOpen,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Lock,
  Sliders,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'landing' | 'single' | 'batch' | 'rag' | 'knowledgeGraph' | 'askCatalog';
  setActiveTab: (tab: 'single' | 'batch' | 'rag' | 'knowledgeGraph' | 'askCatalog') => void;
  onOpenArchitecture: () => void;
  onOpenAdminSettings: () => void;
  onGoToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenArchitecture,
  onOpenAdminSettings,
  onGoToLanding,
}) => {
  const { userProfile, userRole, openAdminModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleTabSelect = (tab: 'single' | 'batch' | 'rag' | 'knowledgeGraph' | 'askCatalog') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div
              onClick={onGoToLanding}
              className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/15 flex items-center justify-center hover:border-teal-500/40 transition-all cursor-pointer"
              title="Return to Landing Page"
            >
              <Cpu className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span
                  onClick={onGoToLanding}
                  className="font-semibold text-lg tracking-tight text-white cursor-pointer"
                >
                  Product<span className="text-teal-400">IQ</span>
                </span>
                
                {userRole === 'admin' ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span>ADMIN</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAdminModal('Admin Login enables full catalog write & rebuild permissions.')}
                    className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition-all flex items-center space-x-1"
                    title="Click to authenticate as Admin"
                  >
                    <span>🚀 DEMO USER</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-normal">
                Commerce-Ready Product Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => handleTabSelect('single')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'single'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Single Extractor</span>
            </button>

            <button
              onClick={() => handleTabSelect('batch')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Batch Processing</span>
            </button>

            <button
              onClick={() => handleTabSelect('askCatalog')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'askCatalog'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>Ask Catalog</span>
            </button>

            <button
              onClick={() => handleTabSelect('rag')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'rag'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>RAG Store</span>
            </button>

            <button
              onClick={() => handleTabSelect('knowledgeGraph')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'knowledgeGraph'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-teal-400" />
              <span>Knowledge Graph</span>
            </button>
          </nav>

          {/* Right Action & User Profile Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            <button
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all hover:border-teal-500/30"
            >
              <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Pipeline Architecture</span>
            </button>

            {/* User Profile / Auth State Badge */}
            <div className="relative">
              {userRole === 'admin' ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-850 border border-indigo-500/40 transition-all"
                  >
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover border border-indigo-400"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
                      </div>
                    )}
                    <div className="text-left hidden sm:block">
                      <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                        {userProfile?.name || 'Admin'}
                      </span>
                      <span className="text-[10px] text-indigo-300 font-mono block leading-tight">
                        Admin
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                      <div className="px-3 py-2 border-b border-slate-800 text-xs">
                        <span className="font-bold text-white block truncate">{userProfile?.name || 'Admin'}</span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">{userProfile?.email}</span>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdminSettings();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Admin Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-950/50 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        <span>Sign Out / Switch Demo</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAdminModal('Sign in to unlock admin catalog management and system settings.')}
                  className="flex items-center space-x-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-950"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 active:bg-white/20 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-teal-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1 bg-slate-950/95 backdrop-blur-2xl rounded-b-2xl shadow-2xl px-2">
            <button
              onClick={() => handleTabSelect('single')}
              className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                activeTab === 'single'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Single Extractor</span>
            </button>

            <button
              onClick={() => handleTabSelect('batch')}
              className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Batch Processing</span>
            </button>

            <button
              onClick={() => handleTabSelect('askCatalog')}
              className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                activeTab === 'askCatalog'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Ask Catalog</span>
            </button>

            <button
              onClick={() => handleTabSelect('rag')}
              className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                activeTab === 'rag'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4 text-teal-400 shrink-0" />
              <span>RAG Store</span>
            </button>

            <button
              onClick={() => handleTabSelect('knowledgeGraph')}
              className={`w-full flex items-center space-x-3 px-4 py-3 min-h-[44px] rounded-xl text-xs font-medium transition-all ${
                activeTab === 'knowledgeGraph'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <GitFork className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Knowledge Graph</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
