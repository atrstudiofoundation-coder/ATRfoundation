import React from 'react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  isDestructive = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="bg-card border border-border/85 rounded-card shadow-universal max-w-md w-full p-6 relative z-10 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-display font-bold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          {message}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={isDestructive ? 'destructive' : 'default'} 
            size="sm" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
