import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Compass, Award, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GoogleLogin } from '@react-oauth/google';

export const LandingPage: React.FC = () => {
  const { loginWithGoogle, loginWithDevMock, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashFadeOut, setSplashFadeOut] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Access Code for New User Verification
  const [showAccessCodeModal, setShowAccessCodeModal] = useState<boolean>(false);
  const [tempCredential, setTempCredential] = useState<string | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState<string>('');
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);
  const [isSubmittingAccessCode, setIsSubmittingAccessCode] = useState<boolean>(false);

  // Splash Screen Timer (1.5 seconds)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    const fadeTimeout = setTimeout(() => {
      setSplashFadeOut(true);
    }, 1300); // Start fade out slightly before 1.5s

    const endTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1600); // Fully complete after 1.6s

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(endTimeout);
    };
  }, [isAuthenticated, navigate]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleGoogleClick = () => {
    setIsLoggingIn(true);
    // Auto reset loading state after 20 seconds as a fallback
    const timer = setTimeout(() => {
      setIsLoggingIn(false);
    }, 20000);
    return () => clearTimeout(timer);
  };

  const handleGoogleSuccess = async (credential: string, accessCode?: string) => {
    setIsLoggingIn(true);
    setAccessCodeError(null);
    if (accessCode) {
      setIsSubmittingAccessCode(true);
    }
    try {
      await loginWithGoogle(credential, navigate, accessCode);
      setShowAccessCodeModal(false);
      setTempCredential(null);
      setAccessCodeInput('');
    } catch (err: any) {
      if (err?.message === 'access_code_required') {
        setTempCredential(credential);
        setShowAccessCodeModal(true);
      } else if (err?.message === 'invalid_access_code') {
        setAccessCodeError('The access code you entered is invalid. Please try again.');
      } else {
        setToast({
          message: getFriendlyErrorMessage(err?.message || ''),
          type: 'error'
        });
      }
    } finally {
      setIsLoggingIn(false);
      setIsSubmittingAccessCode(false);
    }
  };

  const getFriendlyErrorMessage = (errorMsg: string): string => {
    const msg = errorMsg.toLowerCase();
    if (msg.includes('popup_closed') || msg.includes('closed') || msg.includes('dismissed')) {
      return 'The sign-in popup was closed before completing authentication. Please try again.';
    }
    if (msg.includes('credential') || msg.includes('invalid') || msg.includes('signature')) {
      return 'The Google credentials provided were invalid or expired. Please sign in again.';
    }
    if (msg.includes('expired')) {
      return 'Your session has expired. Please authenticate again.';
    }
    if (msg.includes('unauthorized') || msg.includes('access denied') || msg.includes('not active') || msg.includes('role')) {
      return 'Access denied. Only registered ATR Design Studio accounts can access the Foundation portal.';
    }
    return 'We were unable to verify your Google identity. Please contact support.';
  };

  const handleExploreJourney = () => {
    const featureSection = document.getElementById('features-section');
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Splash Screen
  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-300 select-none ${splashFadeOut ? 'opacity-0' : 'opacity-100'
          }`}
      >
        {/* Subtle Architectural Grid Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Minimal Blueprint Border Guide */}
        <div className="absolute inset-4 sm:inset-8 border border-border/20 pointer-events-none rounded-card" />

        <div className="text-center space-y-6 max-w-sm px-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-input bg-primary text-primary-foreground text-xl font-bold font-display shadow-sm">
            ATR
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-wider font-display uppercase">Design Studio</h1>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold font-mono">Foundation</p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground font-mono">Preparing your workspace...</p>
            <div className="w-16 h-[1px] bg-border/40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-[position:35%_bottom] transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url('/background.jpg')`,
        }}
      />


      {/* Architectural blueprint lines on top of background image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* HEADER NAVBAR */}
      <header className="relative z-10 bg-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left menu items */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-white/80">
            <span onClick={handleExploreJourney} className="hover:text-white cursor-pointer transition-colors">Curriculum</span>
            <span onClick={handleExploreJourney} className="hover:text-white cursor-pointer transition-colors">Workspaces</span>
            <span onClick={handleExploreJourney} className="hover:text-white cursor-pointer transition-colors">Studio Guide</span>
          </div>

          {/* Logo Center */}
          <div className="flex items-center gap-3 md:absolute md:left-1/2 md:-translate-x-1/2">
            <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm font-display shadow-universal">
              ATR
            </div>
            <div>
              <span className="text-sm font-bold font-display uppercase tracking-wider block text-white">ATR DESIGN STUDIO</span>
              <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest block -mt-1">Foundation</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-button text-white/80 hover:text-white transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <div className="relative inline-block overflow-hidden rounded-button hover:scale-[1.02] active:scale-95 transition-all duration-200">
              <button
                disabled={isLoggingIn}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-button border border-white/25 backdrop-blur-md flex items-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn && (
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <span>SIGN IN</span>
              </button>
              {!isLoggingIn && (
                <div
                  className="absolute inset-0 opacity-[0.01] z-10 cursor-pointer [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:scale-[3]"
                  onClick={handleGoogleClick}
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        await handleGoogleSuccess(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      setToast({
                        message: 'The sign-in popup was closed before completing authentication. Please try again.',
                        type: 'error'
                      });
                      setIsLoggingIn(false);
                    }}
                    useOneTap={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 bg-black/50 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-card shadow-universal space-y-6 text-left animate-in fade-in slide-in-from-left-4 duration-500 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md text-[10px] font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> CORE CURRICULUM ONBOARDING
          </div>

          <h2 className="text-5xl sm:text-7.5xl font-extrabold font-display tracking-tight text-white leading-[1.05] drop-shadow-sm">
            ATR Foundation
          </h2>

          <h3 className="text-xl sm:text-2xl font-medium text-white/90 font-display leading-snug max-w-xl">
            Every great architectural and landscape masterpiece begins with an unyielding foundation.
          </h3>

          <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
            Enter the digital design studio. Explore core curriculum modules, link dynamic CAD and rendering assets, and validate your structural standards.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Real Google Sign In Hero Access */}
            <div className="relative inline-block overflow-hidden rounded-button hover:scale-[1.02] active:scale-95 transition-all duration-200">
              <button
                disabled={isLoggingIn}
                className="px-8 py-3.5 bg-white hover:bg-white/90 text-black text-xs sm:text-sm font-bold rounded-button shadow-universal flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {isLoggingIn && (
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <span>BEGIN CURRICULUM</span>
              </button>
              {!isLoggingIn && (
                <div
                  className="absolute inset-0 opacity-[0.01] z-10 cursor-pointer [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:scale-[3]"
                  onClick={handleGoogleClick}
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        await handleGoogleSuccess(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      setToast({
                        message: 'The sign-in popup was closed before completing authentication. Please try again.',
                        type: 'error'
                      });
                      setIsLoggingIn(false);
                    }}
                    useOneTap={false}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleExploreJourney}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-button border border-white/20 backdrop-blur-sm flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>EXPLORE THE JOURNEY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {import.meta.env.DEV && (
              <button
                onClick={async () => {
                  try {
                    setIsLoggingIn(true);
                    await loginWithDevMock(navigate);
                  } catch (err: any) {
                    setToast({
                      message: err.message || 'Developer bypass failed',
                      type: 'error'
                    });
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                className="px-6 py-3.5 bg-[#C17767] hover:bg-[#C17767]/90 text-white text-xs sm:text-sm font-bold rounded-button flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md"
              >
                <span>BYPASS LOGIN (DEV)</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Architectural / Landscape Layout Card on the right */}
        {/* Right side is kept completely empty to showcase the beautiful architecture background image */}
        <div className="lg:col-span-5 hidden lg:block" />
      </section>

      {/* FEATURE SECTION */}
      <section id="features-section" className="relative z-10 bg-secondary/35 backdrop-blur-md border-y border-border/40 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-left space-y-2 mb-12 animate-in fade-in duration-500">
            <span className="text-xs uppercase tracking-widest text-primary font-bold font-mono">Curriculum Values</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Designed for Professional Excellence</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Transition smoothly from onboarding theory directly into landscape design execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card/60 backdrop-blur-md border border-border/75 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 rounded-input flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">Learn the Standards</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Master the principles, workflows, and expectations used across every ATR project.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card/60 backdrop-blur-md border border-border/75 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 rounded-input flex items-center justify-center text-primary">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">Validate Your Skills</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Complete competency checks that reinforce understanding before joining live work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card/60 backdrop-blur-md border border-border/75 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 rounded-input flex items-center justify-center text-primary">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">Join Live Projects</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Build confidence and contribute to real projects with a strong foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border/40 bg-background/90 backdrop-blur-md py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-left">
            <span className="font-bold text-foreground">ATR Design Studio</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Built by Mayank Gangrediwar</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Nagpur, India</span>
          </div>
          <div>
            <span>© 2026</span>
          </div>
        </div>
      </footer>

      {/* Elegant, Premium Status Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-card border border-border rounded-card shadow-universal max-w-sm animate-in slide-in-from-bottom-4 duration-300 flex items-start gap-3">
          <div className="h-5 w-5 bg-destructive/10 rounded-input flex items-center justify-center text-destructive shrink-0 mt-0.5">
            <span className="font-bold text-xs font-mono">!</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground font-display">Authentication Status</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
      {/* Premium Access Code Entry Modal */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-card p-6 sm:p-8 max-w-md w-full shadow-universal space-y-6 text-left relative animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-foreground">Restricted Studio Access</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A new user registration was detected. Please enter the valid Studio Access Code to register your account.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tempCredential) {
                  handleGoogleSuccess(tempCredential, accessCodeInput);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Access Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATR-STUDIO-YYYY"
                  value={accessCodeInput}
                  onChange={(e) => {
                    setAccessCodeInput(e.target.value);
                    setAccessCodeError(null);
                  }}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border/80 rounded-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-mono"
                />
                {accessCodeError && (
                  <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in duration-200">{accessCodeError}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAccessCodeModal(false);
                    setTempCredential(null);
                    setAccessCodeInput('');
                    setAccessCodeError(null);
                    setIsLoggingIn(false);
                  }}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-button transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAccessCode || !accessCodeInput.trim()}
                  className="flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-button transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingAccessCode ? (
                    <span className="h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Register Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
