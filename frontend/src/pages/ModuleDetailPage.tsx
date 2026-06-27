import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft, 
  BookOpen, 
  ExternalLink, 
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data fetching based on id
  const moduleData = {
    id: id || '3',
    title: id === '1' 
      ? 'ATR 101: Studio Vision & Design Ethos'
      : id === '2'
      ? 'ATR 102: Environmental & Botanical Ethics'
      : id === '4'
      ? 'ATR 104: Site Modeling & Render Workflows'
      : 'ATR 103: Topography, Soil & Hardscapes',
    description: 'Detailed technical standards governing subsoil evaluations, slope stability guidelines, retaining wall calculations, and local materials classifications.',
    resources: [
      { id: 'r1', title: 'Subsoil Grading & Slope Stability Guidelines', type: 'PDF Document', size: '2.4 MB', duration: '30 mins read' },
      { id: 'r2', title: 'Retaining Wall Height Calculations and Standards', type: 'Technical Spec Sheet', size: '1.1 MB', duration: '15 mins read' },
      { id: 'r3', title: 'ATR Regional Natural Stones Directory', type: 'Image Gallery & Catalog', size: '12.0 MB', duration: '20 mins read' },
      { id: 'r4', title: 'Erosion Management and Earthwork Methods', type: 'Video Tutorial', size: '45 mins', duration: '45 mins watch' }
    ],
    quiz: {
      id: 'q1',
      title: 'Topography & Hardscapes Assessment',
      description: 'Test your understanding of slope ratios, retaining wall structural boundaries, and local stones usage rules.',
      questionsCount: 10,
      passingScorePercent: 80
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/modules" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Link>
        </Button>
      </div>

      <div className="border-b border-border pb-4">
        <span className="text-xs uppercase font-semibold text-primary tracking-wider">Module 0{moduleData.id}</span>
        <h1 className="text-3xl font-display font-bold tracking-tight mt-1">{moduleData.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">{moduleData.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Resources */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Learning Resources
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {moduleData.resources.map((res) => (
              <Card key={res.id} className="group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {res.title}
                    </h4>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{res.type}</span>
                      <span>•</span>
                      <span>{res.size}</span>
                      <span>•</span>
                      <span>{res.duration}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:bg-accent">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Quiz Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-display font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Module Quiz
          </h3>

          <Card className="bg-accent/20 border-accent/80">
            <CardHeader>
              <CardTitle className="text-lg">{moduleData.quiz.title}</CardTitle>
              <CardDescription>{moduleData.quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs border-y border-border py-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Total Questions
                  </span>
                  <span className="font-semibold">{moduleData.quiz.questionsCount} Questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Passing Threshold
                  </span>
                  <span className="font-semibold">{moduleData.quiz.passingScorePercent}% Score</span>
                </div>
              </div>

              <Button className="w-full justify-between" asChild>
                <Link to={`/quizzes/${moduleData.quiz.id}`}>
                  Begin Assessment Quiz <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
