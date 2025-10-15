import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports, useDeleteReport } from '../../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { FileText, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getCreditScoreColor, getCreditScoreBadge } from '../../lib/utils';

export default function ReportList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useReports({ page, limit });
  const { mutate: deleteReport, isPending: isDeleting } = useDeleteReport();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading reports: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const reports = data?.data || [];
  const pagination = data?.pagination;

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Upload your first credit report to get started
          </p>
          <Link to="/">
            <Button>Upload Report</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Credit Reports</h1>
        <Badge variant="info">
          {pagination?.total || 0} Total Reports
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {report.basicDetails.fullName || 'Unknown'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Credit Score</p>
                  <p className={`text-2xl font-bold ${getCreditScoreColor(report.basicDetails.creditScore)}`}>
                    {report.basicDetails.creditScore || 'N/A'}
                  </p>
                  <Badge variant={report.basicDetails.creditScore && report.basicDetails.creditScore >= 700 ? 'success' : 'warning'} className="mt-1">
                    {getCreditScoreBadge(report.basicDetails.creditScore)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Accounts</p>
                    <p className="font-medium">{report.reportSummary.totalAccounts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Balance</p>
                    <p className="font-medium">{formatCurrency(report.reportSummary.currentBalance)}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>PAN: {report.basicDetails.pan || 'N/A'}</p>
                  <p>Uploaded: {formatDate(report.uploadedAt)}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Link to={`/reports/${report._id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this report?')) {
                        deleteReport(report._id);
                      }
                    }}
                    isLoading={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
