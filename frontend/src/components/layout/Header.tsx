import { Link, useLocation } from 'react-router-dom';
import { FileText, Upload, BarChart3, TrendingUp } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 tracking-tight">CreditSea</span>
              <span className="text-xs text-gray-500">Report Processor</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive('/')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Link>

            <Link
              to="/reports"
              className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive('/reports')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </Link>

            <Link
              to="/dashboard"
              className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive('/dashboard')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </nav>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
