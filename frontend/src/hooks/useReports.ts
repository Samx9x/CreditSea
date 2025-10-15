import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllReports, getReportById, deleteReport, uploadXMLFile, getReportStats, type GetReportsParams, type UploadParams } from '../services/api';

export const useReports = (params: GetReportsParams = {}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getAllReports(params),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => getReportById(id),
    enabled: !!id,
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStats'] });
    },
  });
};

export const useUploadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadParams) => uploadXMLFile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reportStats'] });
    },
  });
};

export const useReportStats = () => {
  return useQuery({
    queryKey: ['reportStats'],
    queryFn: getReportStats,
  });
};
