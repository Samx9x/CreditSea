import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useUploadReport } from '../../hooks/useReports';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { CreditReport } from '../../types';

export default function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedReport, setUploadedReport] = useState<CreditReport | null>(null);
  const navigate = useNavigate();
  const { mutate: upload, isPending, isSuccess, isError, error } = useUploadReport();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadProgress(0);
      setUploadedReport(null);
      upload(
        { file, onProgress: setUploadProgress },
        {
          onSuccess: (data) => {
            setUploadedReport(data);
          },
        }
      );
    }
  };

  const handleViewReport = () => {
    if (uploadedReport?._id) {
      navigate(`/reports/${uploadedReport._id}`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="text-2xl text-gray-900">Upload Credit Report</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Upload your XML credit report file to get started</p>
        </CardHeader>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300
              ${isDragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
              ${isPending || isSuccess ? 'pointer-events-none' : 'cursor-pointer'}
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-6">
              {isPending ? (
                <>
                  <Upload className="h-20 w-20 text-blue-600 animate-bounce" />
                  <div className="w-full max-w-md">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-base font-medium text-gray-700">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="h-20 w-20 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">Upload Successful!</p>
                    <p className="text-base text-gray-600 mt-2">
                      Your credit report has been processed successfully
                    </p>
                    {uploadedReport && (
                      <p className="text-base font-semibold text-gray-900 mt-3">
                        {uploadedReport.basicDetails?.fullName || 'Credit Report'}
                      </p>
                    )}
                  </div>
                </>
              ) : isError ? (
                <>
                  <XCircle className="h-20 w-20 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">Upload Failed</p>
                    <p className="text-base text-gray-600 mt-2">
                      {error?.message || 'An error occurred during upload'}
                    </p>
                  </div>
                  <Button variant="primary" size="md">
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  <FileText className="h-20 w-20 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {isDragActive ? 'Drop the file here' : 'Drag & drop XML file'}
                    </p>
                    <p className="text-base text-gray-500 mt-2">
                      or click to browse from your computer
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="px-4 py-2 bg-gray-100 rounded-lg">XML Format Only</span>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg">Max 10MB</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Outside upload box */}
      {isSuccess && uploadedReport && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={handleViewReport} className="text-lg py-6 px-8 shadow-md hover:shadow-lg transition-shadow">
                View Report Details
              </Button>
              <Button variant="secondary" onClick={() => navigate('/reports')} className="text-lg py-6 px-8 shadow-md hover:shadow-lg transition-shadow">
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
