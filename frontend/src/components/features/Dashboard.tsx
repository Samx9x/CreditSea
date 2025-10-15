import { useReportStats } from '../../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Spinner from '../ui/Spinner';
import { FileText, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useReportStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading statistics</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Avg Credit Score',
      value: Math.round(stats.avgCreditScore),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Outstanding',
      value: formatCurrency(stats.totalOutstandingBalance),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Avg Accounts',
      value: Math.round(stats.avgTotalAccounts),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Overview of all credit reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Score Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Minimum</span>
                  <span className="font-medium">{stats.minCreditScore}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average</span>
                  <span className="font-medium">{Math.round(stats.avgCreditScore)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Maximum</span>
                  <span className="font-medium">{stats.maxCreditScore}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Avg Total Accounts</span>
                  <span className="font-medium">{Math.round(stats.avgTotalAccounts)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Active Accounts</span>
                  <span className="font-medium">{Math.round(stats.avgActiveAccounts)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
