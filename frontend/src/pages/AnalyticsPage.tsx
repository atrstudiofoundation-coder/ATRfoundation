import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { TrendingUp, Users, CheckCircle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const onboardees = [
    { name: 'Sarah Chen', department: 'Landscape Architecture', progress: '50%', avgScore: '88%', status: 'Active' },
    { name: 'Alex Martinez', department: 'Urban Design & Site Planning', progress: '75%', avgScore: '92%', status: 'Active' },
    { name: 'Emily Wong', department: 'Engineering Support', progress: '25%', avgScore: '70%', status: 'Needs Review' },
    { name: 'David Miller', department: 'Landscape Architecture', progress: '100%', avgScore: '94%', status: 'Qualified' }
  ];

  return (
    <div className="space-y-6">
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
              <p className="text-3xl font-display font-bold">86.4%</p>
            </div>
            <div className="p-3 bg-accent rounded-full text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Total Employees Registered</span>
              <p className="text-3xl font-display font-bold">12</p>
            </div>
            <div className="p-3 bg-accent rounded-full text-primary">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Compliance Accreditation Rate</span>
              <p className="text-3xl font-display font-bold">75.0%</p>
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
          <CardDescription>Real-time progress overview for the active cohort.</CardDescription>
        </CardHeader>
        <CardContent>
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
                {onboardees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-accent/10 transition-colors">
                    <td className="py-4 font-semibold text-foreground">{emp.name}</td>
                    <td className="py-4 text-muted-foreground">{emp.department}</td>
                    <td className="py-4 text-foreground font-medium">{emp.progress}</td>
                    <td className="py-4 text-foreground font-medium">{emp.avgScore}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        emp.status === 'Qualified' 
                          ? 'bg-primary/10 text-primary' 
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
        </CardContent>
      </Card>
    </div>
  );
};
