import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const isEmployee = user.role === 'employee';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isEmployee 
              ? `Welcome to ATR Design Studio, ${user.name}. Track your onboarding path and design standard qualifications.`
              : `Administrator Portal: Monitoring onboarding compliance and knowledge assessments.`}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-accent/30 border border-accent/80 rounded-full px-4 py-1.5 text-xs text-accent-foreground font-semibold">
          <UserCheck className="w-4 h-4 text-primary" />
          <span>Active Role: <span className="capitalize">{user.role}</span></span>
        </div>
      </div>

      {isEmployee ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed Modules</p>
                  <p className="text-3xl font-display font-bold">2 / 4</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Score</p>
                  <p className="text-3xl font-display font-bold">88%</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <Award className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Time Completed</p>
                  <p className="text-3xl font-display font-bold">6.5 hrs</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assessment Status</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">In Progress</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-950/30 rounded-full text-amber-700 dark:text-amber-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Onboarding Path Progress</CardTitle>
                <CardDescription>Complete all modules and assessments to qualify for design work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">Overall Modules Completion</span>
                    <span className="text-muted-foreground">50% Completed</span>
                  </div>
                  <Progress value={50} />
                </div>

                <div className="divide-y divide-border pt-4">
                  <div className="py-4 flex justify-between items-center first:pt-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <h4 className="font-display font-bold text-base">ATR 101: Studio Vision & Design Ethos</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Historical standards, client communication templates, and portfolio review guides.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/modules">Review</Link>
                    </Button>
                  </div>

                  <div className="py-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <h4 className="font-display font-bold text-base">ATR 102: Environmental & Botanical Ethics</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Biodiversity limits, native plant species catalogues, and water drainage layouts.</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/modules">Review</Link>
                    </Button>
                  </div>

                  <div className="py-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <h4 className="font-display font-bold text-base">ATR 103: Topography, Soil & Hardscapes</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Subsoil grading, slope stability formulas, and local stone material classifications.</p>
                    </div>
                    <Button variant="default" size="sm" asChild>
                      <Link to="/modules">Resume</Link>
                    </Button>
                  </div>

                  <div className="py-4 flex justify-between items-center last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[8px] text-muted-foreground">4</span>
                        <h4 className="font-display font-bold text-base text-muted-foreground">ATR 104: Site Modeling & Render Workflows</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">Revit plugins, Lumion settings, and export parameters for construction documents.</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>Locked</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Tasks</CardTitle>
                <CardDescription>Action items waiting for your attention.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/35 rounded-lg border border-accent space-y-3">
                  <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-semibold uppercase">Pending Quiz</span>
                  <h4 className="font-display font-bold text-sm">ATR 103: Soil Stability & Grading Assessment</h4>
                  <p className="text-xs text-muted-foreground">Requires 80% score to pass. Covers drainage guidelines and standard slope definitions.</p>
                  <Button variant="default" size="sm" className="w-full justify-between" asChild>
                    <Link to="/modules">
                      Take Quiz <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border space-y-3">
                  <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-semibold uppercase">Reading Assignment</span>
                  <h4 className="font-display font-bold text-sm">Read Drainage Standards Doc</h4>
                  <p className="text-xs text-muted-foreground">Review Section 4 of the ATR Environmental Guide prior to testing.</p>
                  <Button variant="outline" size="sm" className="w-full justify-between" asChild>
                    <Link to="/resources">
                      Open Resource <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Onboardees</p>
                  <p className="text-3xl font-display font-bold">12</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <UserCheck className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Onboarding Rate</p>
                  <p className="text-3xl font-display font-bold">75%</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Modules</p>
                  <p className="text-3xl font-display font-bold">4</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quizzes Administered</p>
                  <p className="text-3xl font-display font-bold">34</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <Award className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Employee Onboarding Activity</CardTitle>
                <CardDescription>Real-time notifications of quiz submissions and onboarding updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-border">
                  <div className="py-3 flex justify-between items-center first:pt-0">
                    <div>
                      <h4 className="font-semibold text-sm">Sarah Chen</h4>
                      <p className="text-xs text-muted-foreground">Passed quiz: <span className="font-medium text-foreground">ATR 102 Botanical Ethics</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-primary">90% Score</span>
                      <p className="text-[10px] text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm">Alex Martinez</h4>
                      <p className="text-xs text-muted-foreground">Completed Module: <span className="font-medium text-foreground">ATR 101 Studio Vision</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded font-semibold uppercase">Done</span>
                      <p className="text-[10px] text-muted-foreground">Yesterday</p>
                    </div>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm">Emily Wong</h4>
                      <p className="text-xs text-muted-foreground">Failed quiz: <span className="font-medium text-foreground">ATR 103 Topographical Grading</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-destructive">60% Score</span>
                      <p className="text-[10px] text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Administrative Controls</CardTitle>
                <CardDescription>Shortcut shortcuts for studio coordinators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="default" className="w-full justify-between" asChild>
                  <Link to="/admin">
                    Import New Quiz XML/JSON <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/analytics">
                    View Complete Audit Trail <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
