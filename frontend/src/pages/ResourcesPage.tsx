import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Download, 
  FileText, 
  Link2, 
  ExternalLink 
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    { id: '1', title: 'ATR Design Standards Blueprint (V4)', category: 'general', type: 'pdf', size: '5.2 MB', desc: 'Core guidelines detailing the design philosophy, font faces, palette guidelines, and template configurations.' },
    { id: '2', title: 'Dry-Climate Native Plants Directory', category: 'plants', type: 'pdf', size: '14.8 MB', desc: 'Comprehensive list of accepted drought-resistant botanical species, planting intervals, and zone mappings.' },
    { id: '3', title: 'Subsoil Drainage Layout Templates', category: 'engineering', type: 'dwg', size: '8.4 MB', desc: 'Standard CAD details for layout planning, bioswales, and trench grids.' },
    { id: '4', title: 'Lumion Studio Materials Profiles', category: 'modeling', type: 'zip', size: '42.1 MB', desc: 'Pre-configured materials profiles, environmental skies, and camera setups for rendering projects.' },
    { id: '5', title: 'Soil Compaction & Surcharge Standards', category: 'engineering', type: 'pdf', size: '1.8 MB', desc: 'Technical tolerances for soils compaction, clay expansion rates, and load bearing ratios.' },
    { id: '6', title: 'Client Onboarding Brief Templates', category: 'general', type: 'docx', size: '240 KB', desc: 'Intake templates, survey scripts, and initial parameters sheets for landscape assessments.' }
  ];

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'dwg':
      case 'zip': return <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <Link2 className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Standards Library</h1>
          <p className="text-muted-foreground mt-1">
            Access blueprints, spreadsheets, codes, and template files for daily project work.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search standards library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <TabsList>
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="general">General Standards</TabsTrigger>
            <TabsTrigger value="plants">Botanical</TabsTrigger>
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="modeling">3D Modeling</TabsTrigger>
          </TabsList>
          <span className="text-xs text-muted-foreground hidden md:inline">
            Showing {filteredResources.length} files
          </span>
        </div>

        <div className="mt-6">
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map(res => (
                <Card key={res.id} className="hover:border-primary transition-all duration-200">
                  <CardContent className="p-5 flex items-start gap-4 justify-between h-full">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-secondary rounded-lg">
                        {getIcon(res.type)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm leading-tight text-foreground">{res.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{res.desc}</p>
                        <div className="flex gap-2 items-center text-[10px] text-muted-foreground pt-1.5 font-mono">
                          <span className="uppercase bg-secondary px-1.5 py-0.5 rounded font-semibold text-foreground">{res.type}</span>
                          <span>{res.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-accent shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {['general', 'plants', 'engineering', 'modeling'].map(cat => (
            <TabsContent key={cat} value={cat} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.filter(r => r.category === cat).map(res => (
                  <Card key={res.id} className="hover:border-primary transition-all duration-200">
                    <CardContent className="p-5 flex items-start gap-4 justify-between h-full">
                      <div className="flex gap-4 items-start">
                        <div className="p-3 bg-secondary rounded-lg">
                          {getIcon(res.type)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm leading-tight text-foreground">{res.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{res.desc}</p>
                          <div className="flex gap-2 items-center text-[10px] text-muted-foreground pt-1.5 font-mono">
                            <span className="uppercase bg-secondary px-1.5 py-0.5 rounded font-semibold text-foreground">{res.type}</span>
                            <span>{res.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-accent shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
