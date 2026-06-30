import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonCard, EmptyState } from '@/components/ui/States';
import { useResources } from '@/hooks/useResources';
import { 
  Search, 
  Video, 
  FileText, 
  HardDrive, 
  Globe, 
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { resources, isLoading } = useResources();

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIconAndColor = (type: string) => {
    switch (type) {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Studio Resources Library</h1>
          <p className="text-muted-foreground mt-1">
            Access central blueprints, reference guides, DWGs, and video walkthroughs across studio projects.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search resources library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="pdf">PDF Documents</TabsTrigger>
            <TabsTrigger value="drive">Google Drive</TabsTrigger>
            <TabsTrigger value="website">Web References</TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground hidden md:inline font-mono">
            {filteredResources.length} items available
          </span>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-4">
                {filteredResources.length === 0 ? (
                  <EmptyState
                    title="No Matching Resources Found"
                    description="No studio resources match your search criteria. Check back later or add new global resources in the Admin Hub."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map(res => {
                      const config = getIconAndColor(res.resource_type);
                      const Icon = config.icon;
                      return (
                        <Card key={res.id} className="hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col justify-between">
                          <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className={`p-3 rounded-xl border shrink-0 ${config.bg}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${config.bg}`}>
                                  {config.badge}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-bold text-sm leading-snug text-foreground">{res.title}</h3>
                                {res.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{res.description}</p>
                                )}
                              </div>
                            </div>

                            {res.resource_url && (
                              <div className="pt-3 border-t border-border/60">
                                <a
                                  href={res.resource_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline w-full justify-between"
                                >
                                  <span className="truncate max-w-[220px] flex items-center gap-1">
                                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{res.resource_url}</span>
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {['video', 'pdf', 'drive', 'website'].map(type => (
                <TabsContent key={type} value={type} className="space-y-4">
                  {filteredResources.filter(r => r.resource_type === type).length === 0 ? (
                    <EmptyState
                      title={`No ${type.toUpperCase()} Resources`}
                      description={`No active studio resources under this category.`}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResources.filter(r => r.resource_type === type).map(res => {
                        const config = getIconAndColor(res.resource_type);
                        const Icon = config.icon;
                        return (
                          <Card key={res.id} className="hover:border-primary/50 transition-all duration-200 shadow-sm flex flex-col justify-between">
                            <CardContent className="p-5 space-y-4 flex flex-col justify-between h-full">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className={`p-3 rounded-xl border shrink-0 ${config.bg}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${config.bg}`}>
                                    {config.badge}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <h3 className="font-bold text-sm leading-snug text-foreground">{res.title}</h3>
                                  {res.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{res.description}</p>
                                  )}
                                </div>
                              </div>

                              {res.resource_url && (
                                <div className="pt-3 border-t border-border/60">
                                  <a
                                    href={res.resource_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline w-full justify-between"
                                  >
                                    <span className="truncate max-w-[220px] flex items-center gap-1">
                                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{res.resource_url}</span>
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                  </a>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              ))}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};
