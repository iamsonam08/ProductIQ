import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sliders,
  RefreshCw,
  ArrowRight,
  X,
  HelpCircle,
  FileX,
  WifiOff,
  Cpu,
  Database,
  SearchX
} from 'lucide-react';

export type AlertType = 'info' | 'warning' | 'error' | 'success' | 'validation';

export interface EnterpriseAlertProps {
  type: AlertType;
  title: string;
  message: string;
  code?: string;
  solution?: string | string[];
  nextActionLabel?: string;
  onNextAction?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const EnterpriseAlert: React.FC<EnterpriseAlertProps> = ({
  type,
  title,
  message,
  code,
  solution,
  nextActionLabel,
  onNextAction,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const getThemeConfig = () => {
    switch (type) {
      case 'info':
        return {
          cardBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
          iconBg: 'bg-cyan-500/20 text-cyan-400',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          titleColor: 'text-cyan-200',
          bodyColor: 'text-cyan-100/90',
          borderColor: 'border-cyan-500/20',
          btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold',
          Icon: Info
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
          iconBg: 'bg-amber-500/20 text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          titleColor: 'text-amber-200',
          bodyColor: 'text-amber-100/90',
          borderColor: 'border-amber-500/20',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
          Icon: AlertTriangle
        };
      case 'error':
        return {
          cardBg: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
          iconBg: 'bg-rose-500/20 text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          titleColor: 'text-rose-200',
          bodyColor: 'text-rose-100/90',
          borderColor: 'border-rose-500/20',
          btnBg: 'bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold',
          Icon: AlertCircle
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          titleColor: 'text-emerald-200',
          bodyColor: 'text-emerald-100/90',
          borderColor: 'border-emerald-500/20',
          btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
          Icon: CheckCircle2
        };
      case 'validation':
        return {
          cardBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200',
          iconBg: 'bg-indigo-500/20 text-indigo-400',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          titleColor: 'text-indigo-200',
          bodyColor: 'text-indigo-100/90',
          borderColor: 'border-indigo-500/20',
          btnBg: 'bg-indigo-500 hover:bg-indigo-400 text-white font-bold',
          Icon: Sliders
        };
    }
  };

  const theme = getThemeConfig();
  const IconComponent = theme.Icon;

  const solutionList = Array.isArray(solution) ? solution : solution ? [solution] : [];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md shadow-xl transition-all space-y-3.5 relative ${theme.cardBg} ${className}`}>
      
      {/* Close button if dismissible */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Title Header */}
      <div className="flex items-start space-x-3.5 pr-6">
        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${theme.iconBg}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm sm:text-base font-bold tracking-tight ${theme.titleColor}`}>
              {title}
            </h3>

            {code && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${theme.badgeBg}`}>
                {code}
              </span>
            )}

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${theme.badgeBg}`}>
              {type}
            </span>
          </div>

          <p className={`text-xs leading-relaxed font-normal ${theme.bodyColor}`}>
            {message}
          </p>
        </div>
      </div>

      {/* Suggested Solution Box */}
      {solutionList.length > 0 && (
        <div className={`p-3 sm:p-3.5 rounded-xl bg-slate-950/50 border ${theme.borderColor} space-y-1.5`}>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-300 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Suggested Solution & Action:</span>
          </span>
          <ul className="space-y-1 text-xs text-slate-200 font-normal">
            {solutionList.map((sol, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-teal-400 font-bold">•</span>
                <span>{sol}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons Bar */}
      {(onRetry || (onNextAction && nextActionLabel)) && (
        <div className={`pt-2 border-t ${theme.borderColor} flex flex-wrap items-center justify-end gap-2`}>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}

          {onNextAction && nextActionLabel && (
            <button
              onClick={onNextAction}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center space-x-1.5 ${theme.btnBg}`}
            >
              <span>{nextActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

    </div>
  );
};
