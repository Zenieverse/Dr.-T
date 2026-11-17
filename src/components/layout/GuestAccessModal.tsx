import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { CheckCircle2, Cloud, LogIn, LogOut, ShieldCheck, UserCheck, X } from 'lucide-react';
import { signInWithGoogle, signOutUser } from '../../services/firebase';

interface GuestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: User | null;
  onContinueAsGuest: () => void;
}

export const GuestAccessModal: React.FC<GuestAccessModalProps> = ({
  isOpen,
  onClose,
  authUser,
  onContinueAsGuest,
}) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setStatusMessage(null);
    const user = await signInWithGoogle();
    setLoadingGoogle(false);
    if (user) {
      onClose();
    } else {
      setStatusMessage(
        'Google Sign-In popup was dismissed or blocked by the browser. You can continue using all Dr. T features immediately as a Guest.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    onContinueAsGuest();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-access-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Dr. T Access &amp; Session</span>
            </div>
            <h2 id="guest-access-title" className="text-lg font-black text-slate-900 font-display">
              {authUser ? 'Signed In Account' : 'No Login Required'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close access dialog"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {authUser ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{authUser.displayName || authUser.email || 'Authenticated User'}</span>
              </div>
              {authUser.email && (
                <p className="text-emerald-800 font-mono text-[11px]">{authUser.email}</p>
              )}
              <p className="text-emerald-700 pt-1">
                Cloud Firestore sync is active for your personal workspace.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch to Guest Mode</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Every Dr. T module — including Clinical AI Consultations, Population Health, Future Health, MicroBiz PayFlow, Build With AI, Lantern Keeper, and Three Hats — is unlocked without credentials.
            </p>

            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5 text-teal-950">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Full Guest Access Enabled</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Your session data persists locally in this browser and through the Dr. T API server. No username, password, or OAuth sign-in is required.
              </p>
            </div>

            {statusMessage && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                {statusMessage}
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onContinueAsGuest();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Continue as Guest</span>
              </button>

              <button
                type="button"
                disabled={loadingGoogle}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingGoogle ? (
                  <Cloud className="w-4 h-4 animate-pulse text-sky-600" />
                ) : (
                  <LogIn className="w-4 h-4 text-slate-600" />
                )}
                <span>{loadingGoogle ? 'Opening Google Sign-In...' : 'Sign in with Google (Optional Cloud Sync)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
