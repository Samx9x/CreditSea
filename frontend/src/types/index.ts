export interface BasicDetails {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  fullName?: string;
  mobilePhone: string | null;
  pan: string | null;
  creditScore: number | null;
  dateOfBirth: string | null;
  gender: string | null;
  email: string | null;
  passport: string | null;
  voterId: string | null;
  drivingLicense: string | null;
  rationCard: string | null;
  universalId: string | null;
}

export interface ReportSummary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  currentBalance: number;
  securedBalance: number;
  unsecuredBalance: number;
  enquiriesLast7Days: number;
}

export interface CreditAccount {
  subscriberName: string;
  accountNumber: string;
  portfolioType: string;
  accountType: string;
  accountStatus: string;
  currentBalance: number;
  amountOverdue: number;
  creditLimit: number;
  openDate: string;
  dateReported: string;
  dateClosed: string;
  paymentRating: string;
}

export interface Address {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface CreditReport {
  _id: string;
  basicDetails: BasicDetails;
  reportSummary: ReportSummary;
  creditAccounts: CreditAccount[];
  addresses: Address[];
  reportDate: string;
  reportNumber: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReportStats {
  totalReports: number;
  avgCreditScore: number;
  maxCreditScore: number;
  minCreditScore: number;
  avgTotalAccounts: number;
  avgActiveAccounts: number;
  totalOutstandingBalance: number;
}
