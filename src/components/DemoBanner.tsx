import React from 'react';
import { Rocket, ShieldCheck, Lock, ChevronRight } from 'lucide-react';

interface DemoBannerProps {
  userRole: 'demo' | 'admin';
  onOpenAdminLogin: () => void;
  onSwitchToDemo: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  userRole,
  onOpenAdminLogin,
  onSwitchToDemo,
}) => {
  return (
    <div className="w-full bg-slate-900/90 border-b border-white/10 text-slate-200 text-xs px-4 py-2 font-mono relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left Side Status */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
          {userRole === 'demo' ? (
            <>
              <span className="px-2 py-0.5 rounded-md font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center space-x-1 shrink-0">
                <Rocket className="w-3 h-3 text-teal-400" />
                <span>Demo Mode</span>
              </span>
              <span className="text-slate-300 font-normal truncate">
                Using sample industrial product catalog data.
              </span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center space-x-1 shrink-0">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Admin Mode</span>
              </span>
              <span className="text-slate-300 font-normal truncate">
                Full access enabled for catalog ingestion, graph rules & system administration.
              </span>
            </>
          )}
        </div>

        {/* Right Side Mode Toggle */}
        <div className="flex items-center space-x-3 shrink-0">
          {userRole === 'demo' ? (
            <button
              onClick={onOpenAdminLogin}
              className="px-3 py-1 min-h-[32px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-teal-300 font-semibold hover:border-teal-500/40 transition-all flex items-center space-x-1.5 text-[11px]"
            >
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Admin Login</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={onSwitchToDemo}
              className="px-3 py-1 min-h-[32px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium transition-all text-[11px]"
            >
              Switch to Demo Mode
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
