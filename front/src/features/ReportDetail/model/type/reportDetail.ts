import { Report } from 'entities/Report';

export interface ReportDetailSchema {
  isLoading?: boolean;
  error?: string;
  isInit: boolean;
  isOpen: boolean;
  report: Partial<Report>;
}
