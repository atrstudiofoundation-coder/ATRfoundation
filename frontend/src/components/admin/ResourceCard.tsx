import React from 'react';
import { Video, FileText, Globe, HardDrive, ExternalLink, Trash2, Link as LinkIcon } from 'lucide-react';
import type { AdminResource } from './adminTypes';

interface ResourceCardProps {
  resource: AdminResource;
  onUnlink?: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
  showUnlink?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onUnlink,
  onDelete,
  showUnlink = true,
}) => {
  const getIconAndColor = () => {
    switch (resource.resource_type) {
      case 'video':
        return {
          icon: Video,
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          badge: 'Video Walkthrough'
        };
      case 'pdf':
        return {
          icon: FileText,
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          badge: 'PDF Document'
        };
      case 'drive':
        return {
          icon: HardDrive,
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          badge: 'Google Drive Asset'
        };
      case 'website':
      default:
        return {
          icon: Globe,
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
          badge: 'Web Reference'
        };
    }
  };

  const config = getIconAndColor();
  const Icon = config.icon;

  return (
    <div className="group relative bg-card hover:bg-secondary/30 border border-border/80 hover:border-primary/40 rounded-2xl p-4 transition-all duration-200 shadow-sm flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`p-3 rounded-xl border shrink-0 ${config.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-bold text-foreground truncate">{resource.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${config.bg}`}>
                {config.badge}
              </span>
            </div>
            {resource.description && (
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{resource.description}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {onDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="text-muted-foreground/70 hover:text-destructive p-1.5 rounded-xl hover:bg-destructive/10 transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {showUnlink && onUnlink && (
            <button
              onClick={() => onUnlink(resource.id)}
              className="text-muted-foreground/70 hover:text-destructive p-1.5 rounded-xl hover:bg-destructive/10 transition-colors"
              title="Unlink Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {resource.resource_url && (
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <a
            href={resource.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary hover:underline truncate max-w-[85%]"
          >
            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{resource.resource_url}</span>
            <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
          </a>
        </div>
      )}
    </div>
  );
};
