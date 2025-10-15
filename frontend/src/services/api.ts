import axios, { AxiosError } from 'axios';
import type { CreditReport, PaginatedResponse, ApiResponse, ReportStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
);

export interface UploadParams {
  file: File;
  onProgress?: (progress: number) => void;
}

export const uploadXMLFile = async ({ file, onProgress }: UploadParams): Promise<CreditReport> => {
  const formData = new FormData();
  formData.append('xmlFile', file);

  const response = await api.post<ApiResponse<CreditReport>>('/reports/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Upload failed');
  }

  return response.data.data;
};

export interface GetReportsParams {
  page?: number;
  limit?: number;
  sortBy?: 'uploadedAt' | 'creditScore' | 'reportDate';
  sortOrder?: 'asc' | 'desc';
  minScore?: number;
  maxScore?: number;
  pan?: string;
}

export const getAllReports = async (params: GetReportsParams = {}): Promise<PaginatedResponse<CreditReport[]>> => {
  const response = await api.get<PaginatedResponse<CreditReport[]>>('/reports', { params });
  return response.data;
};

export const getReportById = async (id: string): Promise<CreditReport> => {
  const response = await api.get<ApiResponse<CreditReport>>(`/reports/${id}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch report');
  }

  return response.data.data;
};

export const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/reports/${id}`);
};

export const getReportStats = async (): Promise<ReportStats> => {
  const response = await api.get<ApiResponse<ReportStats>>('/reports/stats');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch stats');
  }

  return response.data.data;
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`);
  return response.data;
};

export default api;
