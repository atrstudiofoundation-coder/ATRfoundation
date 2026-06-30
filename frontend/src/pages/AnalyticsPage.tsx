import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { SkeletonCard, EmptyState } from '@/components/ui/States';
import { TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useAnalyticsOverview, useSystemCompliance } from '@/hooks/useAnalytics';

export const AnalyticsPage: React.FC = () => {
  const { analytics, isLoading: isOverviewLoading } = useAnalyticsOverview();
  const { compliance, isLoading: isComplianceLoading } = useSystemCompliance();

  const totalEmployees = analytics?.active_employees ?? compliance?.total_onboardees ?? 0;
  const avgScore = analytics?.average_pass_rate ?? compliance?.average_quiz_score ?? 0;
  const complianceRate = compliance?.overall_compliance_rate ?? analytics?.average_pass_rate ?? 0;
  const cohortList = compliance?.cohort_progress ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-display font-bold tracking-tight">Onboarding Compliance & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Review employee onboarding completion records, overall pass rates, and training performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Average Module Score</span>
              <p className="text-3xl font-display font-bold">
                {isOverviewLoading ? '...' : `${avgScore}%`}
              </p>
            </div>
            <div className="p-3 bg-accent rounded-full text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Total Registered Members</span>
              <p className="text-3xl font-display font-bold">
                {isOverviewLoading ? '...' : totalEmployees}
              </p>
            </div>
            <div className="p-3 bg-accent rounded-full text-primary">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Compliance Rate</span>
              <p className="text-3xl font-display font-bold">
                {isComplianceLoading ? '...' : `${complianceRate}%`}
              </p>
            </div>
            <div className="p-3 bg-accent rounded-full text-primary">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Progress Matrix</CardTitle>
          <CardDescription>Real-time progress overview for active team members.</CardDescription>
        </CardHeader>
        <CardContent>
          {isComplianceLoading ? (
            <SkeletonCard />
          ) : cohortList.length === 0 ? (
            <EmptyState title="No Employee Audit Activity" description="Evaluation records will populate automatically as team members complete module checkpoints." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-3 font-semibold">Employee</th>
                    <th className="py-3 font-semibold">Department</th>
                    <th className="py-3 font-semibold">Path Progress</th>
                    <th className="py-3 font-semibold">Average Quiz Score</th>
                    <th className="py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cohortList.map((emp, idx) => (
                    <tr key={idx} className="hover:bg-accent/10 transition-colors">
                      <td className="py-4 font-semibold text-foreground">{emp.user_name}</td>
                      <td className="py-4 text-muted-foreground">{emp.department}</td>
                      <td className="py-4 text-foreground font-medium">{emp.progress_percent}%</td>
                      <td className="py-4 text-foreground font-medium">{emp.average_score_percent}%</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : emp.status === 'Needs Review'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-500'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
