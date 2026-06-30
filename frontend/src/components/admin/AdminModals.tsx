import React, { useState } from 'react';
import { X, FolderGit2, Compass, Layers, Link as LinkIcon, Plus } from 'lucide-react';
import type { ResourceType, LearningPathCreate, ModuleCreate, ResourceCreate, LearningPathUpdate } from '@/types/api';
import type { AdminLearningPath, AdminModule } from './adminTypes';
import { useResources } from '@/hooks/useResources';

interface CreatePathModalProps {
  onClose: () => void;
  onCreate: (newPath: LearningPathCreate) => Promise<void> | void;
}

export const CreatePathModal: React.FC<CreatePathModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreate({ title, description, is_active: true });
      onClose();
    } catch (err) {
      console.error('Failed to create learning path:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Create Learning Path</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Path Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sustainable Hardscape Construction"
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of learning outcomes..."
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card h-24 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
              {isSubmitting ? 'Creating...' : 'Create Path'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditPathModalProps {
  learningPath: AdminLearningPath;
  onClose: () => void;
  onUpdate: (updatedData: LearningPathUpdate) => Promise<void> | void;
}

export const EditPathModal: React.FC<EditPathModalProps> = ({ learningPath, onClose, onUpdate }) => {
  const [title, setTitle] = useState(learningPath.title);
  const [description, setDescription] = useState(learningPath.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onUpdate({ title, description });
      onClose();
    } catch (err) {
      console.error('Failed to update learning path:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Edit Learning Path</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Path Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card h-24 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateModuleModalProps {
  pathId: string;
  onClose: () => void;
  onCreate: (newModule: ModuleCreate) => Promise<void> | void;
}

export const CreateModuleModal: React.FC<CreateModuleModalProps> = ({ pathId, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<string | number>(45);
  const [passingScore, setPassingScore] = useState<string | number>(80);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreate({
        learning_path_id: pathId,
        title,
        description,
        estimated_duration_minutes: Number(duration) || 30,
        passing_percentage: Number(passingScore) || 80,
      });
      onClose();
    } catch (err) {
      console.error('Failed to create module:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Create New Module</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Module Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ATR 104: Water Feature Engineering"
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of module content..."
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card h-20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Duration (mins)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Passing Grade (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
              {isSubmitting ? 'Adding...' : 'Add Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditModuleModalProps {
  module: AdminModule;
  onClose: () => void;
  onUpdate: (updatedModule: AdminModule) => Promise<void> | void;
}

export const EditModuleModal: React.FC<EditModuleModalProps> = ({ module, onClose, onUpdate }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description || '');
  const [duration, setDuration] = useState<string | number>(module.estimated_duration_minutes || 45);
  const [passingScore, setPassingScore] = useState<string | number>(module.passing_percentage || 80);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onUpdate({
        ...module,
        title,
        description,
        estimated_duration_minutes: Number(duration) || 30,
        passing_percentage: Number(passingScore) || 80,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update module:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Edit Module Details</h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Module Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-input bg-card h-20 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Duration (mins)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Passing Grade (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateResourceModalProps {
  targetModuleId?: string | null;
  onClose: () => void;
  onCreate: (newResource: ResourceCreate) => Promise<void> | void;
  onAttachExisting?: (resourceId: string, moduleId: string) => Promise<void> | void;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  targetModuleId,
  onClose,
  onCreate,
  onAttachExisting,
}) => {
  const { resources } = useResources();
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>(targetModuleId && resources.length > 0 ? 'existing' : 'new');
  const [selectedResourceId, setSelectedResourceId] = useState<string>(resources[0]?.id || '');
  
  // New Resource form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('pdf');
  const [resourceUrl, setResourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttachExistingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId || !targetModuleId || !onAttachExisting) return;
    try {
      setIsSubmitting(true);
      await onAttachExisting(selectedResourceId, targetModuleId);
      onClose();
    } catch (err) {
      console.error('Failed to attach existing resource:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreate({
        title,
        description,
        resource_type: resourceType,
        resource_url: resourceUrl || 'https://assets.atr.design/docs/reference.pdf',
      });
      onClose();
    } catch (err) {
      console.error('Failed to create resource:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border/70 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              {targetModuleId ? 'Connect Module Learning Resource' : 'Add Studio Resource'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {targetModuleId && resources.length > 0 && (
          <div className="flex border-b border-border/70 bg-secondary/10 p-1.5 gap-1 mx-6 mt-4 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('existing')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'existing' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-primary" /> Select Existing Asset ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'new' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" /> Create Brand New
            </button>
          </div>
        )}

        {activeTab === 'existing' && targetModuleId ? (
          <form onSubmit={handleAttachExistingSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Choose Studio Resource</label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.resource_type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border/40">
              This will attach the selected global resource directly to Module 1 so employees can view reference assets in their workspace.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
              <button type="submit" disabled={isSubmitting || !selectedResourceId} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
                {isSubmitting ? 'Linking...' : 'Link to Module'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Resource Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AutoCAD Detail Specifications Sheet"
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Resource Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card"
              >
                <option value="pdf">PDF Document</option>
                <option value="video">Video Walkthrough</option>
                <option value="website">Website Link</option>
                <option value="drive">Google Drive Folder / Asset</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">URL / Link</label>
              <input
                type="text"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of asset..."
                className="w-full text-xs p-2.5 rounded-xl border border-input bg-card"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:bg-secondary rounded-xl">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-sm disabled:opacity-40">
                {isSubmitting ? 'Saving...' : 'Save Resource'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
