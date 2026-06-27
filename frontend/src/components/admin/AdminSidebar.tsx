import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  FolderGit2, 
  FileCheck2, 
  Settings, 
  Plus, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import type { AdminLearningPath } from './adminTypes';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  learningPaths: AdminLearningPath[];
  selectedPathId: string;
  onSelectPath: (pathId: string) => void;
  onOpenCreatePath: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  learningPaths,
  selectedPathId,
  onSelectPath,
  onOpenCreatePath,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'paths', label: 'Learning Paths', icon: Compass, count: learningPaths.length },
    { id: 'resources', label: 'Resources Library', icon: FolderGit2 },
    { id: 'assessments', label: 'Assessments Hub', icon: FileCheck2 },
    { id: 'settings', label: 'Studio Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-6">
        {/* Workspace Brand Header */}
        <div className="px-3 py-2 bg-secondary/50 rounded-xl border border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm shadow-sm">
              ATR
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">ATR Foundation</h2>
              <p className="text-[10px] text-muted-foreground font-mono">Admin Studio Workspace</p>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></span>
        </div>

        {/* Navigation Tabs */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-2">Navigation</p>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Learning Paths Quick Selector */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Active Workspaces</p>
            <button 
              onClick={onOpenCreatePath}
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-secondary"
              title="Create New Learning Path"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {learningPaths.map((lp) => {
              const isSelected = activeTab === 'paths' && selectedPathId === lp.id;
              return (
                <button
                  key={lp.id}
                  onClick={() => {
                    setActiveTab('paths');
                    onSelectPath(lp.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all text-xs group flex items-center justify-between ${
                    isSelected
                      ? 'bg-accent/60 text-accent-foreground font-semibold border border-accent-foreground/20'
                      : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="truncate block font-medium">{lp.title}</span>
                    <span className="text-[10px] opacity-70 font-mono block">{lp.modules.length} Modules</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-accent-foreground' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="pt-4 border-t border-border/60">
        <div className="p-3 bg-accent/20 rounded-xl border border-accent/40 flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-foreground truncate">Studio Architect</p>
            <p className="text-[10px] text-muted-foreground">Superadmin Privileges</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
