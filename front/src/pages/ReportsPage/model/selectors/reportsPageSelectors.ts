import { StateSchema } from 'app/providers';

export const getReportsPageError = (state: StateSchema) => state.reportsPage?.error ?? '';
export const getReportsPageIsLoading = (state: StateSchema) => state.reportsPage?.isLoading;

export const getReportPageIsCalendarOpen = (state: StateSchema) => state.reportsPage?.isCalendarOpen;
export const getReportPageStartWorkDate = (state: StateSchema) => state.reportsPage?.startWorkDate ?? '';
export const getReportPageEndWorkDate = (state: StateSchema) => state.reportsPage?.endWorkDate ?? '';
