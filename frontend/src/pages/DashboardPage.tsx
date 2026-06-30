import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
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
  AlertCircle
} from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Studio Executive Dashboard</h1>
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
          {/* Employee Live Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Curriculum Modules</p>
                  <p className="text-3xl font-display font-bold">{totalModulesCount}</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pass Rate Average</p>
                  <p className="text-3xl font-display font-bold">{analytics?.average_pass_rate ?? 0}%</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <Award className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Studio Reference Assets</p>
                  <p className="text-3xl font-display font-bold">{resources.length}</p>
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
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-500">Live & Active</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-full text-emerald-700 dark:text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Curriculum Onboarding Journey</CardTitle>
                <CardDescription>Step-by-step studio modules and competency checkpoints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isPathsLoading ? (
                  <SkeletonCard />
                ) : pathModules.length === 0 ? (
                  <EmptyState title="No Active Modules" description="Your curriculum path is being set up by studio administrators." />
                ) : (
                  <div className="divide-y divide-border">
                    {pathModules.map((mod, idx) => (
                      <div key={mod.id} className="py-4 flex justify-between items-center first:pt-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <h4 className="font-display font-bold text-base">{mod.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{mod.description}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/modules">Explore Module</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
                <CardDescription>Direct shortcuts to your learning workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/35 rounded-lg border border-accent space-y-3">
                  <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-semibold uppercase">Curriculum</span>
                  <h4 className="font-display font-bold text-sm">View Studio Modules</h4>
                  <p className="text-xs text-muted-foreground">Access interactive lessons and take competency evaluation tests.</p>
                  <Button variant="default" size="sm" className="w-full justify-between" asChild>
                    <Link to="/modules">
                      Go to Modules <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border space-y-3">
                  <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-semibold uppercase">Library</span>
                  <h4 className="font-display font-bold text-sm">Explore Reference Assets</h4>
                  <p className="text-xs text-muted-foreground">Review DWG specs, PDF manuals, and video guides.</p>
                  <Button variant="outline" size="sm" className="w-full justify-between" asChild>
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
          {/* Admin Live Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Registered Members</p>
                  <p className="text-3xl font-display font-bold">{isAnalyticsLoading ? '...' : analytics?.active_employees ?? 0}</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <UserCheck className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Pass Rate</p>
                  <p className="text-3xl font-display font-bold">{isAnalyticsLoading ? '...' : `${analytics?.average_pass_rate ?? 0}%`}</p>
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
                  <p className="text-3xl font-display font-bold">{modules.length}</p>
                </div>
                <div className="p-3 bg-accent rounded-full text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quizzes Evaluated</p>
                  <p className="text-3xl font-display font-bold">{isAnalyticsLoading ? '...' : analytics?.completed_assessments_count ?? 0}</p>
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
                <CardTitle>Employee Onboarding Audit & Progress</CardTitle>
                <CardDescription>Live database audit of employee learning checkpoint activities.</CardDescription>
              </CardHeader>
              <CardContent>
                {isComplianceLoading ? (
                  <SkeletonCard />
                ) : !compliance?.cohort_progress || compliance.cohort_progress.length === 0 ? (
                  <EmptyState title="No Employee Activity Logs" description="Evaluation attempts will populate here automatically as team members complete checkpoints." />
                ) : (
                  <div className="divide-y divide-border">
                    {compliance.cohort_progress.map((item, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center first:pt-0">
                        <div>
                          <h4 className="font-semibold text-sm">{item.user_name}</h4>
                          <p className="text-xs text-muted-foreground">Department: <span className="font-medium text-foreground">{item.department}</span></p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${
                            item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {item.status} ({item.average_score_percent}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Administrative Controls</CardTitle>
                <CardDescription>Shortcuts for studio coordinators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="default" className="w-full justify-between" asChild>
                  <Link to="/admin?tab=assessments">
                    Import Quiz (.docx, .pdf, .json) <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link to="/admin?tab=resources">
                    Manage Global Resources <ArrowRight className="w-4 h-4" />
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
