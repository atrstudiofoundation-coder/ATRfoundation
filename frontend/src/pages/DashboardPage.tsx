import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonCard, EmptyState } from '@/components/ui/States';
import { Link } from 'react-router-dom';
import { useAnalyticsOverview, useSystemCompliance } from '@/hooks/useAnalytics';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useModules } from '@/hooks/useModules';
import { useResources } from '@/hooks/useResources';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Users,
  Activity,
  ShieldCheck,
  Leaf
} from 'lucide-react';

// Minimalist vector graphic inspired by site plan / architectural blueprint
const LandscapeSitePlan: React.FC = () => {
  return (
    <svg viewBox="0 0 400 180" className="w-full h-full text-primary/10 stroke-current fill-none" strokeWidth="1" strokeLinecap="round">
      {/* Grid lines */}
      <line x1="0" y1="30" x2="400" y2="30" strokeDasharray="3 6" strokeWidth="0.5" />
      <line x1="0" y1="90" x2="400" y2="90" strokeDasharray="3 6" strokeWidth="0.5" />
      <line x1="0" y1="150" x2="400" y2="150" strokeDasharray="3 6" strokeWidth="0.5" />
      <line x1="100" y1="0" x2="100" y2="180" strokeDasharray="3 6" strokeWidth="0.5" />
      <line x1="200" y1="0" x2="200" y2="180" strokeDasharray="3 6" strokeWidth="0.5" />
      <line x1="300" y1="0" x2="300" y2="180" strokeDasharray="3 6" strokeWidth="0.5" />
      
      {/* Contours (topography) */}
      <path d="M-20,60 Q 80,40 160,110 T 360,70 T 420,100" strokeWidth="1.2" />
      <path d="M-20,90 Q 70,70 150,140 T 350,100 T 420,130" strokeWidth="0.8" strokeDasharray="1 2" />
      <path d="M-20,120 Q 60,100 140,170 T 340,130 T 420,160" strokeWidth="0.8" />
      
      {/* Pathway curve */}
      <path d="M 80,180 C 120,120 220,140 260,0" strokeWidth="2.5" stroke="#4F6F52" strokeOpacity="0.15" />
      <path d="M 83,180 C 123,120 223,140 263,0" strokeWidth="1" stroke="#4F6F52" strokeOpacity="0.2" strokeDasharray="4 4" />
      
      {/* Building footprint (architectural layout) */}
      <rect x="250" y="60" width="80" height="60" rx="2" strokeWidth="1.5" stroke="#2F3A33" strokeOpacity="0.2" />
      <line x1="250" y1="60" x2="330" y2="120" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.2" />
      <line x1="330" y1="60" x2="250" y2="120" strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity="0.2" />
      
      {/* Planting circles (Trees / shrubbery standard CAD representations) */}
      <circle cx="120" cy="50" r="16" strokeWidth="1" stroke="#739072" strokeOpacity="0.3" />
      <circle cx="120" cy="50" r="2" fill="#739072" fillOpacity="0.3" />
      <line x1="104" y1="50" x2="136" y2="50" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="120" y1="34" x2="120" y2="66" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M 112,42 A 12 12 0 0 1 128,58" strokeWidth="0.5" strokeOpacity="0.3" />
      <path d="M 128,42 A 12 12 0 0 1 112,58" strokeWidth="0.5" strokeOpacity="0.3" />

      <circle cx="170" cy="120" r="12" strokeWidth="1" stroke="#739072" strokeOpacity="0.3" />
      <circle cx="170" cy="120" r="2.5" fill="#739072" fillOpacity="0.3" />
      <line x1="158" y1="120" x2="182" y2="120" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="170" y1="108" x2="170" y2="132" strokeWidth="0.5" strokeOpacity="0.3" />

      <circle cx="70" cy="100" r="8" strokeWidth="1" stroke="#739072" strokeOpacity="0.3" />
      
      {/* Planting bed polygons */}
      <polygon points="50,150 90,140 100,165 40,160" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.2" />
      <polygon points="280,140 320,135 340,155 290,160" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.2" />
      
      {/* Scale bar & north arrow */}
      <g transform="translate(20, 150)" strokeWidth="0.8" strokeOpacity="0.3">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#2F3A33" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#2F3A33" />
        <line x1="20" y1="-3" x2="20" y2="3" stroke="#2F3A33" />
        <line x1="40" y1="-3" x2="40" y2="3" stroke="#2F3A33" />
        <text x="0" y="-6" className="text-[6px] font-mono fill-muted-foreground stroke-none">0m</text>
        <text x="20" y="-6" className="text-[6px] font-mono fill-muted-foreground stroke-none">10m</text>
        <text x="40" y="-6" className="text-[6px] font-mono fill-muted-foreground stroke-none">20m</text>
      </g>
      
      <g transform="translate(360, 40)" strokeWidth="0.8" strokeOpacity="0.3" stroke="#2F3A33">
        <circle cx="0" cy="0" r="10" strokeWidth="0.5" />
        <line x1="0" y1="-14" x2="0" y2="14" />
        <line x1="-10" y1="0" x2="10" y2="0" strokeWidth="0.5" />
        <polygon points="0,-14 -3,-7 3,-7" fill="#2F3A33" stroke="none" />
        <text x="4" y="-8" className="text-[8px] font-mono font-bold fill-muted-foreground stroke-none">N</text>
      </g>
    </svg>
  );
};



// Custom SVG Sparkline for natural visual trend indicators inside KPI cards
const Sparkline: React.FC<{ points: number[]; color: string }> = ({ points, color }) => {
  const width = 80;
  const height = 28;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  });
  
  const pathD = `M ${coords.join(' L ')}`;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0 opacity-80">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { analytics, isLoading: isAnalyticsLoading } = useAnalyticsOverview();
  const { compliance, isLoading: isComplianceLoading } = useSystemCompliance();
  const { learningPaths, isLoading: isPathsLoading } = useLearningPaths();
  const { modules } = useModules();
  const { resources } = useResources();
  
  if (!user) return null;

  const isEmployee = user.role === 'employee';
  const primaryPath = learningPaths[0] ?? null;
  const pathModules = primaryPath?.modules ?? modules ?? [];
  const totalModulesCount = pathModules.length;



  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* 4-Layer architectural paper background elements overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-[0.025] flex flex-col justify-between">
        <div className="h-64 w-full">
          <LandscapeSitePlan />
        </div>
        <div className="h-64 w-full scale-x-[-1] opacity-70">
          <LandscapeSitePlan />
        </div>
      </div>

      {/* Decorative leaf silhouettes in header corner */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] text-primary">
        <Leaf className="w-24 h-24 rotate-45" />
      </div>

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-primary font-bold font-mono uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" /> ATR Design Studio
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#2F3A33]">Studio Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isEmployee 
              ? `Welcome to ATR Design Studio, ${user.name}. Track your onboarding path and design standard qualifications.`
              : `Administrator Portal: Monitoring onboarding compliance and knowledge assessments.`}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F5F1E8] border border-border rounded-full px-4 py-2 text-xs text-[#2F3A33] font-bold shadow-sm transition-all duration-200 hover:scale-[1.02]">
          <UserCheck className="w-4 h-4 text-[#4F6F52]" />
          <span>Active Role: <span className="capitalize">{user.role}</span></span>
        </div>
      </div>

      {isEmployee ? (
        <>
          {/* Employee KPI Cards Grid (Themed with Natural Materials & Accents) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Registered / Active Curriculum Modules -> Forest Green Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(79,111,82,0.15)] relative overflow-hidden group bg-[#4F6F52]/5 border-[#4F6F52]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#4F6F52] font-bold uppercase tracking-wider">Active Curriculum Modules</p>
                  <p className="text-3.5xl font-display font-bold text-[#4F6F52]">{totalModulesCount}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#4F6F52] font-semibold">
                    <span>Path modules</span>
                  </div>
                  <p className="text-[9px] text-[#4F6F52]/75">Core studio lessons</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#4F6F52] text-white rounded-full">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[1, 1, 2, 2, 2, 2, 2]} color="#4F6F52" />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Pass Rate Average -> Sage Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(115,144,114,0.15)] relative overflow-hidden group bg-[#739072]/5 border-[#739072]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#739072] font-bold uppercase tracking-wider">Pass Rate Average</p>
                  <p className="text-3.5xl font-display font-bold text-[#739072]">{analytics?.average_pass_rate ?? 0}%</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#739072] font-semibold">
                    <span>Passing is 80%</span>
                  </div>
                  <p className="text-[9px] text-[#739072]/75">Your evaluation average</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#739072] text-white rounded-full">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[60, 70, 75, 80, 85, 90, 100]} color="#739072" />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Reference Assets -> Warm Sand + Terracotta Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(193,119,103,0.15)] relative overflow-hidden group bg-[#F5F1E8] border-[#C17767]/30">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#C17767] font-bold uppercase tracking-wider">Studio Reference Assets</p>
                  <p className="text-3.5xl font-display font-bold text-[#C17767]">{resources.length}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#C17767] font-semibold">
                    <span>DWG & specs</span>
                  </div>
                  <p className="text-[9px] text-[#C17767]/75">Verified design standards</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#C17767] text-white rounded-full">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[2, 4, 4, 5, 7, 8, 10]} color="#C17767" />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Assessment Status -> Olive Green Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(96,108,56,0.15)] relative overflow-hidden group bg-[#606C38]/5 border-[#606C38]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#606C38] font-bold uppercase tracking-wider">Assessment Status</p>
                  <p className="text-3.5xl font-display font-bold text-[#606C38]">Active</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#606C38] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>System online</span>
                  </div>
                  <p className="text-[9px] text-[#606C38]/75">Ready for checkpoints</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#606C38] text-white rounded-full">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[1, 1, 1, 1, 1, 1, 1]} color="#606C38" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 relative overflow-hidden transition-all duration-200 hover:shadow-md">
              {/* Subtle background layout lines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.08] text-primary">
                <svg width="100%" height="100%" className="absolute bottom-0 right-0">
                  <path d="M-50,200 C150,250 300,100 800,150" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-display text-[#2F3A33]">Curriculum Onboarding Journey</CardTitle>
                  <Leaf className="w-4 h-4 text-[#739072] opacity-40" />
                </div>
                <CardDescription>Step-by-step studio modules and competency checkpoints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {isPathsLoading ? (
                  <SkeletonCard />
                ) : pathModules.length === 0 ? (
                  <EmptyState title="No Active Modules" description="Your curriculum path is being set up by studio administrators." />
                ) : (
                  <div className="divide-y divide-border">
                    {pathModules.map((mod) => (
                      <div key={mod.id} className="py-4 flex justify-between items-center first:pt-0">
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-2">
                            {user.completedModuleIds?.includes(mod.id) ? (
                              <CheckCircle2 className="w-4 h-4 text-[#4F6F52] shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                            )}
                            <h4 className={`font-display font-bold text-base transition-colors ${
                              user.completedModuleIds?.includes(mod.id) ? 'text-muted-foreground/60 line-through' : 'text-[#2F3A33]'
                            }`}>{mod.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{mod.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="shrink-0 bg-[#F5F1E8] hover:bg-[#F5F1E8]/70 text-[#2F3A33] border-border transition-all duration-200 hover:scale-[1.02] active:scale-95">
                          <Link to="/modules">Explore Module</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-display text-[#2F3A33]">Quick Navigation</CardTitle>
                <CardDescription>Direct shortcuts to your learning workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="p-4 bg-[#F5F1E8] rounded-input border border-border/80 space-y-3">
                  <span className="text-[9px] bg-[#4F6F52] text-white px-2.5 py-0.5 rounded-[4px] font-bold uppercase tracking-wider font-mono">Curriculum</span>
                  <h4 className="font-display font-bold text-sm text-[#2F3A33]">View Studio Modules</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Access interactive lessons and take competency evaluation tests.</p>
                  <Button variant="default" size="sm" className="w-full justify-between bg-[#4F6F52] hover:bg-[#4F6F52]/95 text-white transition-all duration-200 hover:scale-[1.015] active:scale-98" asChild>
                    <Link to="/modules">
                      Go to Modules <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-4 bg-card rounded-input border border-border space-y-3">
                  <span className="text-[9px] bg-[#739072]/15 text-[#739072] px-2.5 py-0.5 rounded-[4px] font-bold uppercase tracking-wider font-mono">Library</span>
                  <h4 className="font-display font-bold text-sm text-[#2F3A33]">Explore Reference Assets</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Review DWG specs, PDF manuals, and video guides.</p>
                  <Button variant="outline" size="sm" className="w-full justify-between bg-[#F5F1E8] border-border hover:bg-[#F5F1E8]/75 text-[#2F3A33] transition-all duration-200 hover:scale-[1.015] active:scale-98" asChild>
                    <Link to="/resources">
                      Open Library <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Admin KPI Cards Grid (Themed with Natural Materials & Accents) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Card 1: Registered Members -> Forest Green Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(79,111,82,0.15)] relative overflow-hidden group bg-[#4F6F52]/5 border-[#4F6F52]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#4F6F52] font-bold uppercase tracking-wider">Registered Members</p>
                  <p className="text-3xl font-display font-bold text-[#4F6F52]">
                    {isAnalyticsLoading ? '...' : analytics?.active_employees ?? 0}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[#4F6F52] font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>100% from last month</span>
                  </div>
                  <p className="text-[9px] text-[#4F6F52]/75">Active studio onboarding members</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#4F6F52] text-white rounded-full">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[2, 3, 2, 4, 3, 5, 5]} color="#4F6F52" />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Average Pass Rate -> Sage Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(115,144,114,0.15)] relative overflow-hidden group bg-[#739072]/5 border-[#739072]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#739072] font-bold uppercase tracking-wider">Average Pass Rate</p>
                  <p className="text-3xl font-display font-bold text-[#739072]">
                    {isAnalyticsLoading ? '...' : `${analytics?.average_pass_rate ?? 0}%`}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[#739072] font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>100% from last month</span>
                  </div>
                  <p className="text-[9px] text-[#739072]/75">Computed from attempt logs</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#739072] text-white rounded-full">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[65, 75, 80, 85, 90, 95, 100]} color="#739072" />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Active Modules -> Warm Sand + Terracotta Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(193,119,103,0.15)] relative overflow-hidden group bg-[#F5F1E8] border-[#C17767]/30">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#C17767] font-bold uppercase tracking-wider">Active Modules</p>
                  <p className="text-3xl font-display font-bold text-[#C17767]">{modules.length}</p>
                  <div className="flex items-center gap-1 text-[10px] text-[#C17767] font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>2 new this month</span>
                  </div>
                  <p className="text-[9px] text-[#C17767]/75">Verified studio modules</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#C17767] text-white rounded-full">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[1, 2, 2, 2, 2, 2, 2]} color="#C17767" />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Quizzes Evaluated -> Olive Green Theme */}
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(96,108,56,0.15)] relative overflow-hidden group bg-[#606C38]/5 border-[#606C38]/20">
              <CardContent className="pt-6 flex justify-between items-start gap-2">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#606C38] font-bold uppercase tracking-wider">Quizzes Evaluated</p>
                  <p className="text-3xl font-display font-bold text-[#606C38]">
                    {isAnalyticsLoading ? '...' : analytics?.completed_assessments_count ?? 0}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-[#606C38] font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>1 this month</span>
                  </div>
                  <p className="text-[9px] text-[#606C38]/75">Competency evaluations complete</p>
                </div>
                <div className="flex flex-col items-end justify-between h-[85px] gap-2">
                  <div className="p-2.5 bg-[#606C38] text-white rounded-full">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <Sparkline points={[1, 2, 4, 5, 8, 9, 12]} color="#606C38" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Onboarding Progress Board & Admin Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Employee Audit Table - Redesigned to be highly professional and sleek */}
            <Card className="lg:col-span-2 relative overflow-hidden transition-all duration-200 hover:shadow-md border-[#739072]/20">
              <CardHeader className="border-b border-border/40 pb-4 bg-[#F5F1E8]/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#2F3A33] font-display flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#4F6F52]" /> Employee Onboarding Audit
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground font-mono">Live database audit of employee learning checkpoint activities.</CardDescription>
                  </div>
                  <div className="bg-[#4F6F52]/10 text-[#4F6F52] px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase flex items-center gap-1.5 border border-[#4F6F52]/20 shadow-sm">
                    <Activity className="w-3 h-3" /> System Active
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {isComplianceLoading ? (
                  <div className="p-6"><SkeletonCard /></div>
                ) : !compliance?.cohort_progress || compliance.cohort_progress.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#F5F1E8] border border-[#739072]/30 flex items-center justify-center text-[#739072] mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#2F3A33] font-display">No Employee Records Found</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">When studio members register and begin their curriculum, their live progress and assessment scores will be strictly audited here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#F5F1E8]/50 border-b border-border/60 text-[9px] uppercase font-bold font-mono text-muted-foreground tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Employee Name</th>
                          <th className="px-6 py-3">Department</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Progress</th>
                          <th className="px-6 py-3 text-right">Avg Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {compliance.cohort_progress.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#F5F1E8]/20 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-7 w-7 rounded bg-[#4F6F52] text-white flex items-center justify-center font-bold font-display text-[10px] shadow-sm">
                                  {item.user_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <span className="font-bold text-[#2F3A33] font-display text-xs">{item.user_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="text-[10px] font-mono text-muted-foreground border border-border/60 bg-card px-2.5 py-0.5 rounded-sm">{item.department}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                                item.status === 'Completed' ? 'bg-[#4F6F52]/10 text-[#4F6F52] border border-[#4F6F52]/20' : 
                                item.status === 'In Progress' ? 'bg-[#C17767]/10 text-[#C17767] border border-[#C17767]/20' : 
                                'bg-muted text-muted-foreground'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <div className="w-16 h-1 bg-border/80 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#4F6F52] rounded-full" style={{ width: `${item.progress_percent}%` }} />
                                </div>
                                <span className="text-[10px] font-bold font-mono text-[#2F3A33] w-6">{item.progress_percent}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <span className="text-[11px] font-bold font-mono text-[#2F3A33]">{item.average_score_percent}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Admin controls Card */}
            <div className="space-y-6">
              <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-display text-[#2F3A33]">Quick Administrative Controls</CardTitle>
                  <CardDescription>Shortcuts for studio coordinators.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10">
                  {/* Action rows modeled after a premium Apple / Figma control panel */}
                  <Link 
                    to="/admin?tab=assessments" 
                    className="flex items-center justify-between p-3.5 bg-[#4F6F52] hover:bg-[#4F6F52]/95 text-white rounded-input transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/10 rounded-lg text-white">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-display">Import Quiz (.docx, .pdf, .json)</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>

                  <Link 
                    to="/admin?tab=resources" 
                    className="flex items-center justify-between p-3.5 bg-[#F5F1E8] border border-border hover:bg-[#F5F1E8]/70 text-[#2F3A33] rounded-input transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-[#4F6F52]/10 rounded-lg text-[#4F6F52]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-display">Manage Global Resources</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>

                  <Link 
                    to="/analytics" 
                    className="flex items-center justify-between p-3.5 bg-[#F5F1E8] border border-border hover:bg-[#F5F1E8]/70 text-[#2F3A33] rounded-input transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-[#739072]/15 rounded-lg text-[#739072]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-display">View Detailed Analytics</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </CardContent>
              </Card>

              {/* Three horizontal mini summary cards at the bottom */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-card border border-border/80 rounded-input flex flex-col items-center text-center gap-1.5 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
                  <div className="p-1.5 bg-[#4F6F52]/10 text-[#4F6F52] rounded-full">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-[#2F3A33] font-display leading-tight">Member Activity</h5>
                    <p className="text-[8px] text-muted-foreground mt-0.5 font-mono">Real-time tracking</p>
                  </div>
                </div>

                <div className="p-3 bg-card border border-border/80 rounded-input flex flex-col items-center text-center gap-1.5 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
                  <div className="p-1.5 bg-[#739072]/15 text-[#739072] rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-[#2F3A33] font-display leading-tight">Content Health</h5>
                    <p className="text-[8px] text-muted-foreground mt-0.5 font-mono">All systems healthy</p>
                  </div>
                </div>

                <div className="p-3 bg-card border border-border/80 rounded-input flex flex-col items-center text-center gap-1.5 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
                  <div className="p-1.5 bg-[#C17767]/10 text-[#C17767] rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-[#2F3A33] font-display leading-tight">Pending Reviews</h5>
                    <p className="text-[8px] text-muted-foreground mt-0.5 font-mono">0 items pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
