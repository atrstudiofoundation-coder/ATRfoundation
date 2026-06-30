import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border/60 rounded-card shadow-universal p-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.jpg" alt="ATR Studio Logo" className="h-16 w-16 rounded-[14px] object-cover mb-4 shadow-sm border border-border/80" />
          <h2 className="text-2xl font-display font-bold tracking-tight text-center text-foreground">
            ATR DESIGN STUDIO
          </h2>
          <p className="text-xs text-muted-foreground text-center mt-1 uppercase tracking-wider font-mono">
            Foundation Onboarding
          </p>
        </div>
        {children}
      </div>
      <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-6 text-center">
        Authorized Access Only. Internal Employees & Stakeholders.
      </div>
    </div>
  );
};
