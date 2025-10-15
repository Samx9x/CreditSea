import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.length !== 8) return dateString;

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCreditScoreColor(score: number | null): string {
  if (!score) return 'text-gray-500';
  if (score >= 750) return 'text-green-600';
  if (score >= 650) return 'text-yellow-600';
  return 'text-red-600';
}

export function getCreditScoreBadge(score: number | null): string {
  if (!score) return 'Unknown';
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  if (score >= 600) return 'Poor';
  return 'Very Poor';
}

export function getAccountTypeLabel(code: string): string {
  const accountTypes: Record<string, string> = {
    '10': 'Credit Card',
    '11': 'Credit Card (Retail)',
    '12': 'Credit Card (Business)',
    '13': 'Charge Card',
    '20': 'Housing Loan',
    '31': 'Property Loan',
    '32': 'Loan Against Property',
    '33': 'Land Purchase Loan',
    '34': 'Loan on Rental Property',
    '35': 'Plot Loan',
    '36': 'Construction Loan',
    '37': 'Home Equity Loan',
    '51': 'Home Loan',
    '52': 'Personal Loan',
    '53': 'Property Loan',
    '54': 'Loan Against Shares/Securities',
    '55': 'Vehicle Loan (Two Wheeler)',
    '56': 'Gold Loan',
    '57': 'Educational Loan',
    '58': 'Loan to Professional',
    '59': 'Overdraft',
    '60': 'Consumer Loan',
    '61': 'Leasing',
    '62': 'Overdraft',
    '63': 'Secured Credit Card',
    '64': 'Business Loan - Unsecured',
    '65': 'Business Non-Funded Credit Facility',
    '66': 'Prime Minister Jaan Dhan Yojana',
    '67': 'Mudra Loans',
    '68': 'Microfinance - Business Loan',
    '69': 'Microfinance - Personal Loan',
    '70': 'Microfinance - Housing Loan',
    '71': 'Microfinance - Others',
    '72': 'Pradhan Mantri Awas Yojana',
    '73': 'Kisan Credit Card',
    '74': 'Loan on Bank Deposits',
    '75': 'Fleet Card',
    '76': 'Commercial Vehicle Loan',
    '77': 'Telecom - Wireless',
    '78': 'Insurance',
    '79': 'Peer to Peer Lending',
    '80': 'GECL',
    '81': 'Loan Against Insurance Policies',
    '90': 'Business Loan - General',
    '91': 'Business Loan - Secured',
    '92': 'Business Loan - Priority Sector Small Business',
    '93': 'Business Against Bank Deposits',
    '94': 'Business Loan Against Shares',
  };

  return accountTypes[code] || `Unknown Type (${code})`;
}

export function getPortfolioTypeLabel(code: string): string {
  const types: Record<string, string> = {
    'R': 'Revolving',
    'I': 'Installment',
  };
  return types[code] || code;
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
