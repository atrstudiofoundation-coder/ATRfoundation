import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <h1 className="text-9xl font-display font-bold text-muted/30 select-none">404</h1>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold">Document Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The landscape specifications or page URL you are trying to view does not exist in our studio archives.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};
