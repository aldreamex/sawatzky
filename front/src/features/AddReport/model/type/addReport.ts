export interface AddReportFormType {
  startWorkDate?: string;
  endWorkDate?: string;
  workObjectsGroup?: number;
  workObject?: number;
  legalEntity?: number;
  employee?: number;
  status?: string;
}

export interface AddReportData {
  periodStart: string;
  periodEnd: string;
  legalEntity: number | string;
  workObjectsGroup?: number | string;
  workObject?: number | string;
  application_status?: string;
}

export interface AddReportSchema {
  formData: AddReportFormType;
  isLoading?: boolean;
  error?: string;
  isOpen?: boolean;
  calendarIsOpen?: boolean;
}
