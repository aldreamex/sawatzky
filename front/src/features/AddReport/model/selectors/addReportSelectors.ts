import { StateSchema } from 'app/providers';

export const getAddReportFormData = (state: StateSchema) => state.addReportForm?.formData;

export const getAddReportFormWorkObjectGroup = (state: StateSchema) => state.addReportForm?.formData.workObjectsGroup;
export const getAddReportFormWorkObject = (state: StateSchema) => state.addReportForm?.formData.workObject;
export const getAddReportFormLegalEntity = (state: StateSchema) => state.addReportForm?.formData.legalEntity;
export const getAddReportFormEmployee = (state: StateSchema) => state.addReportForm?.formData.employee;
export const getAddReportFormStartWorkDate = (state: StateSchema) => state.addReportForm?.formData?.startWorkDate ?? '';
export const getAddReportFormEndWorkDate = (state: StateSchema) => state.addReportForm?.formData?.endWorkDate ?? '';
export const getAddReportFormCalendarIsOpen = (state: StateSchema) => state.addReportForm?.calendarIsOpen;
export const getAddReportFormStatus = (state: StateSchema) => state.addReportForm?.formData?.status;

export const getAddReportFormError = (state: StateSchema) => state.addReportForm?.error;
export const getAddReportFormIsLoading = (state: StateSchema) => state.addReportForm?.isLoading;
export const getAddReportFormIsOpen = (state: StateSchema) => state.addReportForm?.isOpen;
