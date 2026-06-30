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
  onMarkAsCompleted?: () => void;
}

export const ModuleStep: React.FC<ModuleStepProps> = ({
  module,
  onBackToTimeline,
  onStartCompetencyCheck,
  onMarkAsCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'video' | 'resources'>('intro');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

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
      <div className="bg-card border border-border/60 rounded-card p-6 sm:p-8 shadow-universal space-y-4">
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
        <div className="flex bg-secondary/50 p-1.5 rounded-button border border-border/60 max-w-md text-xs font-semibold pt-1">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex-1 py-2 rounded-[10px] transition-all duration-200 ${
              activeTab === 'intro' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1. Overview
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-2 rounded-[10px] transition-all duration-200 ${
              activeTab === 'video' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            2. Video Session
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-2 rounded-[10px] transition-all duration-200 ${
              activeTab === 'resources' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            3. Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* GUIDED SECTION CONTENT */}
      <div className="bg-card border border-border/60 rounded-card shadow-universal p-6 sm:p-8 space-y-6">
        {activeTab === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-foreground font-display">Module Introduction</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {module.description}
            </p>

            <div className="p-5 bg-secondary/70 border border-border/80 rounded-input space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">Key Onboarding Objectives</h4>
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
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>Continue to Video Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'video' && (() => {
          const videoResources = resources.filter(r => (r.resource_type || r.type) === 'video');
          const activeVideoRes = videoResources[selectedVideoIndex] || videoResources[0];
          const videoUrl = activeVideoRes?.resource_url || activeVideoRes?.url || activeVideoRes?.uploaded_file_path;

          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-display">Video Masterclass & Walkthrough</h3>
                  <p className="text-xs text-muted-foreground">
                    {videoResources.length > 1 ? `Select from ${videoResources.length} masterclass video sessions below.` : 'Streaming session standards walkthrough.'}
                  </p>
                </div>
                {activeVideoRes && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold self-start sm:self-auto">
                    Playing: {activeVideoRes.title}
                  </span>
                )}
              </div>

              {/* Multi-Video Playlist selector bar */}
              {videoResources.length > 1 && (
                <div className="p-3 bg-secondary/40 border border-border/80 rounded-input space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider block">
                    Module Playlist ({videoResources.length} Sessions)
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {videoResources.map((vRes, vIdx) => (
                      <button
                        key={vRes.id || vIdx}
                        onClick={() => setSelectedVideoIndex(vIdx)}
                        className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                          selectedVideoIndex === vIdx
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-card text-foreground hover:bg-secondary border border-border/80'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Part {vIdx + 1}: {vRes.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {videoUrl ? (
                <div className="relative aspect-video bg-black rounded-card overflow-hidden border border-border/60 shadow-universal">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={videoUrl.replace('watch?v=', 'embed/')}
                      title={activeVideoRes?.title || module.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      poster="/logo.jpg"
                    >
                      Your browser does not support video playback.
                    </video>
                  )}
                </div>
              ) : (
                <div className="relative aspect-video bg-secondary rounded-card overflow-hidden border border-border/60 flex items-center justify-center group shadow-universal">
                  <div className="text-center space-y-3 p-4">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-universal group-hover:scale-105 transition-transform duration-200 cursor-pointer">
                      <Video className="w-7 h-7 ml-0.5" />
                    </div>
                    <p className="text-xs text-foreground/80 font-mono">Stream Session: {module.title}</p>
                    <p className="text-[11px] text-muted-foreground">Attach a video resource in Admin Resources to stream here.</p>
                  </div>
                </div>
              )}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveTab('intro')}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-button transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          );
        })()}

        {activeTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-foreground font-display">Reference Assets & Links</h3>

            {resources.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-card bg-card">
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
                      className="group p-4 bg-card hover:bg-secondary/40 border border-border/80 rounded-input transition-all duration-200 shadow-sm flex items-start gap-3.5"
                    >
                      <div className="p-3 bg-secondary rounded-[8px] shrink-0 border border-border/50">
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

            {module.assessment ? (
              <div className="p-6 bg-[#5E8C61]/10 border border-[#5E8C61]/25 rounded-card flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Ready for Assessment?
                  </h4>
                  <p className="text-xs text-muted-foreground">Verify your mastery by taking the module Competency Check.</p>
                </div>

                <button
                  onClick={onStartCompetencyCheck}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                >
                  <span>Begin Competency Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 bg-primary/10 border border-primary/20 rounded-card flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Ready to Complete Module?
                  </h4>
                  <p className="text-xs text-muted-foreground">This is a resource-only training module. Click below to mark it as completed.</p>
                </div>

                <button
                  onClick={onMarkAsCompleted}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-button shadow-universal flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                >
                  <span>Mark Module as Completed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
