import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Compass, Award, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { GoogleLogin } from '@react-oauth/google';

export const LandingPage: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashFadeOut, setSplashFadeOut] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

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
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-300 select-none ${
          splashFadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Subtle Architectural Grid Pattern (approx 2% opacity) */}
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 flex flex-col relative">
      {/* Background grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm font-display shadow-sm">
              ATR
            </div>
            <div>
              <span className="text-sm font-bold font-display uppercase tracking-wider block">ATR DESIGN STUDIO</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block -mt-1">Foundation</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-button text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Real Google Sign In Navbar Access */}
            <div className="relative inline-block overflow-hidden rounded-button hover:scale-[1.02] active:scale-95 transition-all duration-200">
              <button
                disabled={isLoggingIn}
                className="px-4 py-1.5 bg-secondary hover:bg-secondary/90 text-foreground text-xs font-semibold rounded-button border border-border/80 flex items-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn && (
                  <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <span>Sign In</span>
              </button>
              {!isLoggingIn && (
                <div 
                  className="absolute inset-0 opacity-[0.01] z-10 cursor-pointer [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:scale-[3]"
                  onClick={handleGoogleClick}
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        setIsLoggingIn(true);
                        try {
                          await loginWithGoogle(credentialResponse.credential, navigate);
                        } catch (err: any) {
                          setToast({
                            message: getFriendlyErrorMessage(err?.message || ''),
                            type: 'error'
                          });
                          setIsLoggingIn(false);
                        }
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
      <section className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-6 space-y-6 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Core Curriculum Onboarding
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-foreground leading-[1.1]">
            ATR Foundation
          </h2>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground/90 font-display leading-snug">
            Every great landscape begins with a strong foundation.
          </h3>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
            Learn the design principles, workflows, and studio standards behind every ATR Design Studio project.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Real Google Sign In Hero Access */}
            <div className="relative inline-block overflow-hidden rounded-button hover:scale-[1.02] active:scale-95 transition-all duration-200">
              <button
                disabled={isLoggingIn}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs sm:text-sm font-semibold rounded-button shadow-universal flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn && (
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <span>Begin Foundation</span>
              </button>
              {!isLoggingIn && (
                <div 
                  className="absolute inset-0 opacity-[0.01] z-10 cursor-pointer [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:scale-[3]"
                  onClick={handleGoogleClick}
                >
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (credentialResponse.credential) {
                        setIsLoggingIn(true);
                        try {
                          await loginWithGoogle(credentialResponse.credential, navigate);
                        } catch (err: any) {
                          setToast({
                            message: getFriendlyErrorMessage(err?.message || ''),
                            type: 'error'
                          });
                          setIsLoggingIn(false);
                        }
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
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-foreground text-xs sm:text-sm font-semibold rounded-button border border-border/80 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>Explore the Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ARCHITECTURAL SVG ILLUSTRATION */}
        <div className="lg:col-span-6 flex justify-center items-center relative w-full aspect-square max-w-[480px] lg:max-w-none mx-auto select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute inset-0 bg-secondary/35 dark:bg-card/40 rounded-card border border-border/40 -z-10 shadow-universal" />
          
          <svg className="w-full h-full p-6 text-foreground/40 dark:text-foreground/20" viewBox="0 0 400 400" fill="none">
            {/* Blueprint Grid Lines */}
            <line x1="50" y1="50" x2="350" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="50" y1="200" x2="350" y2="200" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="350" x2="350" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="200" y1="50" x2="200" y2="350" stroke="currentColor" strokeWidth="0.5" />
            <line x1="350" y1="50" x2="350" y2="350" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

            {/* Contour Lines (Topography curves) */}
            <path d="M 50,300 Q 150,280 200,240 T 350,150" stroke="currentColor" strokeWidth="1" strokeDasharray="6 2" />
            <path d="M 50,270 Q 130,240 180,210 T 350,120" stroke="currentColor" strokeWidth="0.75" />
            <path d="M 50,330 Q 170,310 220,270 T 350,180" stroke="currentColor" strokeWidth="0.75" />

            {/* Architectural Layout Guide Circles */}
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="5" fill="var(--primary)" />

            {/* Axis / Geometry Guidelines */}
            <line x1="200" y1="200" x2="290" y2="110" stroke="var(--primary)" strokeWidth="1.5" />
            <circle cx="290" cy="110" r="3" fill="var(--primary)" />
            <line x1="200" y1="200" x2="110" y2="290" stroke="currentColor" strokeWidth="1" />

            {/* Stylized Geometrical Trees (Landscape Design symbols) */}
            {/* Tree 1: Forest Green Center Accent */}
            <g transform="translate(140, 120)">
              <circle cx="0" cy="0" r="24" stroke="var(--primary)" strokeWidth="1.5" fill="var(--primary)" fillOpacity="0.05" />
              <circle cx="0" cy="0" r="18" stroke="var(--primary)" strokeWidth="0.75" strokeDasharray="2 2" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="var(--primary)" strokeWidth="0.75" />
              <line x1="0" y1="-24" x2="0" y2="24" stroke="var(--primary)" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="3" fill="var(--primary)" />
            </g>

            {/* Tree 2: Secondary Accent */}
            <g transform="translate(280, 260)">
              <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="1.25" fill="currentColor" fillOpacity="0.02" />
              <line x1="-14" y1="-14" x2="14" y2="14" stroke="currentColor" strokeWidth="0.75" />
              <line x1="14" y1="-14" x2="-14" y2="14" stroke="currentColor" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="2" fill="currentColor" />
            </g>

            {/* Tree 3: Small Accent */}
            <g transform="translate(100, 220)">
              <circle cx="0" cy="0" r="14" stroke="var(--accent)" strokeWidth="1" fill="var(--accent)" fillOpacity="0.05" />
              <line x1="-14" y1="0" x2="14" y2="0" stroke="var(--accent)" strokeWidth="0.5" />
              <line x1="0" y1="-14" x2="0" y2="14" stroke="var(--accent)" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="2" fill="var(--accent)" />
            </g>

            {/* Landscape Pathways */}
            <path d="M 280,50 L 280,180 L 350,250" stroke="currentColor" strokeWidth="1" />
            <path d="M 285,50 L 285,178 L 350,243" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
          </svg>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section id="features-section" className="bg-secondary/30 border-y border-border/40 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-left space-y-2 mb-12">
            <span className="text-xs uppercase tracking-widest text-primary font-bold font-mono">Curriculum Values</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground">Designed for Professional Excellence</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Transition smoothly from onboarding theory directly into landscape design execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card border border-border/70 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 rounded-input flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">Learn the Standards</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Master the principles, workflows, and expectations used across every ATR project.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border/70 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
              <div className="h-10 w-10 bg-primary/10 rounded-input flex items-center justify-center text-primary">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">Validate Your Skills</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Complete competency checks that reinforce understanding before joining live work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border/70 rounded-card p-6 shadow-sm space-y-4 hover:-translate-y-[2px] hover:border-primary/45 hover:shadow-universal transition-all duration-300">
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
      <footer className="border-t border-border/40 bg-background py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-left">
            <span className="font-bold text-foreground">ATR Design Studio</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Built by ATR Design Studio</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Pune, India</span>
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
    </div>
  );
};
