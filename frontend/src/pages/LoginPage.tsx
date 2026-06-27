import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Compass, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginAsEmployee, loginAsAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginEmployee = () => {
    loginAsEmployee();
    navigate('/dashboard');
  };

  const handleLoginAdmin = () => {
    loginAsAdmin();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          Welcome to the ATR Foundation onboarding portal. Please authenticate using one of the demo configurations below to enter the portal.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button 
          onClick={handleLoginEmployee}
          variant="default"
          className="w-full flex items-center justify-center gap-3 py-6 text-base font-semibold group rounded-lg"
        >
          <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          <span>Enter as Employee (Sarah)</span>
        </Button>

        <Button 
          onClick={handleLoginAdmin}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 py-6 text-base font-semibold border-2 hover:bg-secondary rounded-lg"
        >
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>Enter as Administrator (Marcus)</span>
        </Button>
      </div>

      <div className="border-t border-border pt-4 mt-2">
        <div className="bg-accent/40 rounded-lg p-3 text-xs text-accent-foreground border border-accent">
          <p className="font-semibold mb-1">Production Tech Stack Note:</p>
          <p>
            The production app integrates with Google OAuth 2.0 and JWT. During local foundation setup, utilize these toggle buttons to test both onboarding user workflows and administrator audit logs.
          </p>
        </div>
      </div>
    </div>
  );
};
