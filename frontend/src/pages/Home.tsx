import { FileText, Zap, BarChart3 } from 'lucide-react';
import FileUpload from '../components/features/FileUpload';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Credit Report Processor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload and analyze XML credit reports from Experian with professional insights
        </p>
      </div>

      {/* Upload Section */}
      <FileUpload />

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">Upload XML</h3>
            <p className="text-gray-600 leading-relaxed">
              Securely upload your Experian credit report XML files with drag & drop support
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">Auto Process</h3>
            <p className="text-gray-600 leading-relaxed">
              Intelligent parsing extracts all key data including personal info and credit accounts
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">View Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Access detailed reports with credit scores, account summaries, and analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
