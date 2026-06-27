import React from 'react';
import { Video, FileText, Globe, HardDrive, ExternalLink, Trash2, Link as LinkIcon } from 'lucide-react';
import type { AdminResource } from './adminTypes';

interface ResourceCardProps {
  resource: AdminResource;
  onUnlink?: (resourceId: string) => void;
  showUnlink?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onUnlink,
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
    <div className="group relative bg-card hover:bg-secondary/40 border border-border/70 rounded-xl p-3.5 transition-all duration-200 shadow-sm flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className={`p-2.5 rounded-lg border shrink-0 ${config.bg}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xs font-semibold text-foreground truncate">{resource.title}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${config.bg}`}>
              {config.badge}
            </span>
          </div>
          {resource.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">{resource.description}</p>
          )}
          {resource.resource_url && (
            <a
              href={resource.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline"
            >
              <LinkIcon className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{resource.resource_url}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          )}
        </div>
      </div>

      {showUnlink && onUnlink && (
        <button
          onClick={() => onUnlink(resource.id)}
          className="text-muted-foreground/60 hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
          title="Unlink Resource"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
