import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Database,
  GitFork,
  MessageSquare,
  Menu,
  X,
  ShieldCheck,
  Lock,
  Sliders,
  LogOut,
  ChevronDown,
  BookOpen,
  Cpu
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
    <header className="border-b border-white/[0.06] bg-[#070B14]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Slim Navbar Height - 40% reduced */}
        <div className="flex items-center justify-between h-13 py-1">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onGoToLanding}
              className="flex items-center space-x-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#161E2D] border border-white/[0.08] flex items-center justify-center group-hover:border-[#19D3AE]/50 transition-all shadow-sm">
                <Cpu className="w-4 h-4 text-[#19D3AE]" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#19D3AE] transition-colors">
                  Product<span className="text-[#19D3AE]">IQ</span>
                </span>
                <span className="hidden lg:inline-block ml-2 text-[10px] font-mono text-[#A8B3CF]/60 border-l border-white/10 pl-2">
                  AI Product Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#101827] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleTabSelect('single')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'single'
                  ? 'bg-[#161E2D] text-[#19D3AE] border border-[#19D3AE]/30 shadow-sm'
                  : 'text-[#A8B3CF] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Extract</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('rag')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'rag'
                  ? 'bg-[#161E2D] text-[#19D3AE] border border-[#19D3AE]/30 shadow-sm'
                  : 'text-[#A8B3CF] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('askCatalog')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'askCatalog'
                  ? 'bg-[#161E2D] text-[#19D3AE] border border-[#19D3AE]/30 shadow-sm'
                  : 'text-[#A8B3CF] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('knowledgeGraph')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'knowledgeGraph'
                  ? 'bg-[#161E2D] text-[#19D3AE] border border-[#19D3AE]/30 shadow-sm'
                  : 'text-[#A8B3CF] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Knowledge Graph</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect('batch')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'batch'
                  ? 'bg-[#161E2D] text-[#19D3AE] border border-[#19D3AE]/30 shadow-sm'
                  : 'text-[#A8B3CF] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Batch</span>
            </button>
          </nav>

          {/* Right Menu Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Architecture Link Icon Button */}
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#A8B3CF] hover:text-white bg-[#101827] border border-white/[0.06] hover:border-[#19D3AE]/30 transition-all"
              title="Pipeline Architecture & Flow"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#19D3AE]" />
              <span>Architecture</span>
            </button>

            {/* Profile / Admin Menu Dropdown */}
            <div className="relative">
              {userRole === 'admin' ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-[#101827] border border-indigo-500/30 hover:border-indigo-500/50 transition-all text-xs"
                  >
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Profile"
                        className="w-5 h-5 rounded-full object-cover border border-indigo-400"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {userProfile?.name ? userProfile.name.charAt(0) : 'A'}
                      </div>
                    )}
                    <span className="font-semibold text-white hidden sm:inline text-xs">
                      {userProfile?.name || 'Admin'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#A8B3CF]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#161E2D] border border-white/[0.08] rounded-xl p-1.5 shadow-2xl z-50 space-y-1">
                      <div className="px-3 py-2 border-b border-white/[0.06] text-xs">
                        <span className="font-bold text-white block truncate">{userProfile?.name || 'Admin'}</span>
                        <span className="text-[10px] text-[#A8B3CF] font-mono block truncate">{userProfile?.email}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdminSettings();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05] transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenArchitecture();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05] transition-all lg:hidden"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#19D3AE]" />
                        <span>Architecture</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAdminModal('Sign in to unlock admin catalog management.')}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#101827] hover:bg-[#161E2D] text-[#A8B3CF] hover:text-white border border-white/[0.06] transition-all cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-[#19D3AE]" />
                  <span>Admin Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-[#101827] border border-white/[0.06] text-[#A8B3CF] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#19D3AE]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 border-t border-white/[0.06] space-y-1 bg-[#101827] rounded-b-xl px-2">
            <button
              type="button"
              onClick={() => handleTabSelect('single')}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05]"
            >
              <Sparkles className="w-4 h-4 text-[#19D3AE]" />
              <span>Extract (Single)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('rag')}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05]"
            >
              <Database className="w-4 h-4 text-[#19D3AE]" />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('askCatalog')}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05]"
            >
              <MessageSquare className="w-4 h-4 text-[#19D3AE]" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('knowledgeGraph')}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05]"
            >
              <GitFork className="w-4 h-4 text-[#19D3AE]" />
              <span>Knowledge Graph</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('batch')}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-[#A8B3CF] hover:text-white hover:bg-white/[0.05]"
            >
              <Layers className="w-4 h-4 text-[#19D3AE]" />
              <span>Batch Processing</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
