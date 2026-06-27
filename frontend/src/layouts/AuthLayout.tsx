import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl mb-3 shadow-md">
            A
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-center text-foreground">
            ATR DESIGN STUDIO
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Foundation Onboarding & Knowledge Assessment Portal
          </p>
        </div>
        {children}
      </div>
      <div className="text-xs text-muted-foreground mt-6 text-center">
        Authorized Access Only. Internal Employees & Stakeholders.
      </div>
    </div>
  );
};
