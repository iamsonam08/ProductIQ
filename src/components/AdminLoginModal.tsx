import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  X,
  Sparkles,
  AlertCircle,
  Mail,
  Key,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  getFriendlyAuthErrorMessage,
  syncUserProfile,
} from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingActionNotice?: string | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  pendingActionNotice,
}) => {
  const { loginAsHackathonAdmin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('admin@productiq.ai');
  const [password, setPassword] = useState('admin123');
  const [displayName, setDisplayName] = useState('Admin User');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user, 'admin');
        onClose();
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/popup-blocked') {
        try {
          console.log('Popup blocked. Retrying with redirect...');
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('Redirect sign in error:', redirectErr);
        }
      }
      setError(getFriendlyAuthErrorMessage(err?.code || 'auth/failed'));
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (mode === 'signin') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(userCredential.user, 'admin');
        onClose();
      } else if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(userCredential.user, 'admin');
        setSuccessMsg('Account created successfully! Signed in as Admin.');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg(`Password reset link sent to ${email}. Check your inbox.`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(getFriendlyAuthErrorMessage(err.code || 'auth/failed'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-slate-100 shadow-2xl overflow-hidden">
        
        {/* Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>
              {mode === 'signin' && 'Admin Sign In'}
              {mode === 'signup' && 'Create Admin Account'}
              {mode === 'reset' && 'Reset Admin Password'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Firebase Auth
            </span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Authentication protects administrative catalog write, rebuild, and system settings operations.
          </p>
        </div>

        {/* Restricted Action Notice */}
        {pendingActionNotice && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1 font-mono">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Admin Action Restricted</span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-normal">
              {pendingActionNotice}
            </p>
          </div>
        )}

        {/* 1-Click Instant Judge Access for Hackathon Demo */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/60 via-indigo-950/60 to-slate-900 border border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>For Hackathon Judges</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">1-Click Bypass</span>
          </div>
          <p className="text-[11px] text-slate-300 font-normal">
            Instantly grant complete Admin write permissions without entering passwords.
          </p>
          <button
            type="button"
            onClick={() => {
              loginAsHackathonAdmin();
              onClose();
            }}
            className="w-full py-2.5 px-4 min-h-[44px] rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Instant Admin Sign In (Judge Mode)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase shrink-0">
            Or Firebase Auth
          </span>
        </div>

        {/* Google Sign-In Button */}
        {mode !== 'reset' && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Display Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                placeholder="admin@productiq.ai"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[10px] text-teal-400 hover:underline font-mono"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 min-h-[44px] rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Remember Me Checkbox */}
          {mode === 'signin' && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer">
                Remember me on this browser
              </label>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-col space-y-2 font-mono">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  loginAsHackathonAdmin();
                  onClose();
                }}
                className="mt-1 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bypass with Instant Admin (Judge Mode)</span>
              </button>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 min-h-[44px] rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-900/40 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Sign In as Admin'}
                  {mode === 'signup' && 'Register Admin'}
                  {mode === 'reset' && 'Send Password Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle between Sign In / Sign Up / Reset */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
          {mode === 'signin' && (
            <>
              <span>Need an admin account?</span>
              <button
                onClick={() => setMode('signup')}
                className="text-teal-400 font-bold hover:underline"
              >
                Register Here
              </button>
            </>
          )}

          {(mode === 'signup' || mode === 'reset') && (
            <>
              <span>Already registered?</span>
              <button
                onClick={() => setMode('signin')}
                className="text-teal-400 font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
