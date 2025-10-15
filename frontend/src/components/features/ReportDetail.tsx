import { useParams, Link } from 'react-router-dom';
import { useReport } from '../../hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { ArrowLeft, User, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate, getCreditScoreColor, getCreditScoreBadge, getAccountTypeLabel } from '../../lib/utils';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading, error } = useReport(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading report: {error?.message || 'Report not found'}</p>
          <Link to="/reports">
            <Button variant="secondary" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/reports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Badge variant="info">Report #{report.reportNumber}</Badge>
      </div>

      {/* Basic Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.pan || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.dateOfBirth ? formatDate(report.basicDetails.dateOfBirth) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.mobilePhone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium text-gray-900">{report.basicDetails.email || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Documents */}
      {(report.basicDetails.passport || report.basicDetails.voterId || report.basicDetails.drivingLicense ||
        report.basicDetails.rationCard || report.basicDetails.universalId) && (
        <Card>
          <CardHeader>
            <CardTitle>Identity Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.basicDetails.passport && (
                <div>
                  <p className="text-sm text-gray-600">Passport Number</p>
                  <p className="text-lg font-medium text-gray-900">{report.basicDetails.passport}</p>
                </div>
              )}
              {report.basicDetails.voterId && (
                <div>
                  <p className="text-sm text-gray-600">Voter ID</p>
                  <p className="text-lg font-medium text-gray-900">{report.basicDetails.voterId}</p>
                </div>
              )}
              {report.basicDetails.drivingLicense && (
                <div>
                  <p className="text-sm text-gray-600">Driving License</p>
                  <p className="text-lg font-medium text-gray-900">{report.basicDetails.drivingLicense}</p>
                </div>
              )}
              {report.basicDetails.rationCard && (
                <div>
                  <p className="text-sm text-gray-600">Ration Card</p>
                  <p className="text-lg font-medium text-gray-900">{report.basicDetails.rationCard}</p>
                </div>
              )}
              {report.basicDetails.universalId && (
                <div>
                  <p className="text-sm text-gray-600">Aadhaar/Universal ID</p>
                  <p className="text-lg font-medium text-gray-900">{report.basicDetails.universalId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Credit Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8">
            <div>
              <p className={`text-6xl font-bold ${getCreditScoreColor(report.basicDetails.creditScore)}`}>
                {report.basicDetails.creditScore || 'N/A'}
              </p>
              <Badge
                variant={report.basicDetails.creditScore && report.basicDetails.creditScore >= 700 ? 'success' : 'warning'}
                className="mt-2"
              >
                {getCreditScoreBadge(report.basicDetails.creditScore)}
              </Badge>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Accounts</p>
                <p className="text-2xl font-semibold">{report.reportSummary.totalAccounts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-green-600">{report.reportSummary.activeAccounts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
                <p className="text-2xl font-semibold text-gray-600">{report.reportSummary.closedAccounts}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding</p>
              <p className="text-xl font-semibold">{formatCurrency(report.reportSummary.currentBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secured</p>
              <p className="text-xl font-semibold text-blue-600">{formatCurrency(report.reportSummary.securedBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unsecured</p>
              <p className="text-xl font-semibold text-orange-600">{formatCurrency(report.reportSummary.unsecuredBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enquiries (7 days)</p>
              <p className="text-xl font-semibold">{report.reportSummary.enquiriesLast7Days}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Credit Accounts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4">Bank</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Account Number</th>
                  <th className="text-right py-3 px-4">Current Balance</th>
                  <th className="text-right py-3 px-4">Overdue</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.creditAccounts.map((account, index) => (
                  <tr key={index} className="border-b dark:border-gray-800">
                    <td className="py-3 px-4 font-medium">{account.subscriberName}</td>
                    <td className="py-3 px-4">{getAccountTypeLabel(account.accountType)}</td>
                    <td className="py-3 px-4 font-mono text-xs">{account.accountNumber}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(account.currentBalance)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={account.amountOverdue > 0 ? 'text-red-600 font-medium' : ''}>
                        {formatCurrency(account.amountOverdue)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={account.accountStatus.includes('1') ? 'success' : 'default'}>
                        {account.accountStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      {report.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Addresses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.addresses.map((address, index) => (
                <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                  <p className="font-medium">{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  {address.addressLine3 && <p>{address.addressLine3}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
