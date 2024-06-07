import { StateSchema } from 'app/providers';

export const getReportDetail = (state: StateSchema) => state.reportDetail?.report;
export const getReportDetailIsInit = (state: StateSchema) => state.reportDetail?.isInit;
export const getReportDetailIsLoading = (state: StateSchema) => state.reportDetail?.isLoading;
export const getReportDetailIsOpen = (state: StateSchema) => state.reportDetail?.isOpen;

export const getReportDetailReportId = (state: StateSchema) => state.reportDetail?.report.id;

export const getReportDetailApplication = (state: StateSchema) => state.reportDetail?.report.foundedApllications;
