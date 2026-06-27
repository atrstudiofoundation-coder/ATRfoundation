import React, { useState } from 'react';
import { 
  Video, 
  FileText, 
  Globe, 
  HardDrive, 
  Image as ImageIcon, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import type { EmployeeModule, EmployeeResource } from './employeeTypes';

interface ModuleStepProps {
  module: EmployeeModule;
  onBackToTimeline: () => void;
  onStartCompetencyCheck: () => void;
}

export const ModuleStep: React.FC<ModuleStepProps> = ({
  module,
  onBackToTimeline,
  onStartCompetencyCheck,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'video' | 'resources'>('intro');

  const resources = module.resources || [];

  const renderResourceIcon = (type?: EmployeeResource['resource_type'] | EmployeeResource['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-amber-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'drive': return <HardDrive className="w-4 h-4 text-emerald-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-purple-500" />;
      case 'website':
      default: return <Globe className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      <button
        onClick={onBackToTimeline}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Learning Journey
      </button>

      {/* Module Hero Banner */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
            {module.code || `MOD-${module.display_order || 1}`}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> {module.estimated_duration_minutes || module.duration_minutes || 45} Minutes
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-display text-foreground tracking-tight">{module.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{module.subtitle || module.description}</p>

        {/* Guided Navigation Tabs */}
        <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border/60 max-w-md text-xs font-semibold pt-1">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'intro' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1. Overview
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'video' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            2. Video Session
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'resources' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            3. Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* GUIDED SECTION CONTENT */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {activeTab === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-foreground font-display">Module Introduction</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {module.description}
            </p>

            <div className="p-5 bg-accent/20 border border-accent/40 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Key Onboarding Objectives</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Understand core design directives established by ATR Studio Directors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Review technical documentation and CAD block standards before practical execution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Complete the mandatory Competency Check to verify mastery.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveTab('video')}
                className="px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
              >
                <span>Continue to Video Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-foreground font-display">Video Masterclass & Walkthrough</h3>
            
            {/* Embedded Video Player Simulator */}
            <div className="relative aspect-video bg-charcoal-900 rounded-2xl overflow-hidden border border-border flex items-center justify-center group shadow-md">
              <div className="text-center space-y-3 p-4">
                <div className="h-14 w-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                  <Video className="w-7 h-7 ml-0.5" />
                </div>
                <p className="text-xs text-earth-200 font-mono">Stream Session: {module.title}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveTab('intro')}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className="px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm flex items-center gap-2"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-foreground font-display">Reference Assets & Links</h3>

            {resources.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">No linked reference documents or assets for this module yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((res) => {
                  const targetUrl = res.resource_url || res.url || res.uploaded_file_path || '#';
                  return (
                    <a
                      key={res.id}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-card hover:bg-secondary/40 border border-border/80 rounded-2xl transition-all shadow-sm flex items-start gap-3.5"
                    >
                      <div className="p-3 bg-secondary rounded-xl shrink-0 border border-border/50">
                        {renderResourceIcon(res.resource_type || res.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{res.title}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{res.description || 'Verified studio reference document.'}</p>
                        {res.estimated_read_time && (
                          <span className="text-[10px] text-muted-foreground font-mono mt-2 block opacity-80">
                            Read time: {res.estimated_read_time}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}

            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4" /> Ready for Assessment?
                </h4>
                <p className="text-xs text-muted-foreground">Verify your mastery by taking the module Competency Check.</p>
              </div>

              <button
                onClick={onStartCompetencyCheck}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all transform hover:-translate-y-0.5"
              >
                <span>Begin Competency Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
