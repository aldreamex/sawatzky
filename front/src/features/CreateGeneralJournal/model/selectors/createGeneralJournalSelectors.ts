import { StateSchema } from 'app/providers';

export const getCreateGeneralJournalError = (state: StateSchema) => state.createGeneralJournal?.error;
export const getCreateGeneralJournalIsLoading = (state: StateSchema) => state.createGeneralJournal?.isLoading;
export const getCreateGeneralJournalIsOpen = (state: StateSchema) => state.createGeneralJournal?.isOpen;

// general journal
export const getCreateGeneralJournalFormLegalEntity = (state: StateSchema) => state.createGeneralJournal?.formData.legalEntity;
export const getCreateGeneralJournalFormData = (state: StateSchema) => state.createGeneralJournal?.formData;
export const getCreateGeneralJournalIsEdit = (state: StateSchema) => state.createGeneralJournal?.isEdit;
export const getCreateGeneralJournalIsView = (state: StateSchema) => state.createGeneralJournal?.isView;

export const getCreateGeneralJournalUserFormReceiptDate = (state: StateSchema) => state.createGeneralJournal?.formData?.receiptDate;
export const getAddReportFormCalendarIsOpen = (state: StateSchema) => state.addReportForm?.calendarIsOpen;

export const getCreateGeneralJournalTotalAmount = (state: StateSchema) => state.createGeneralJournal?.formData.totalAmount;
export const getCreateGeneralJournalPaymentDocumentNumber = (state: StateSchema) => state.createGeneralJournal?.formData.paymentDocumentNumber;
export const getCreateGeneralJournalCalendarIsOpen = (state: StateSchema) => state.createGeneralJournal?.calendarIsOpen;

export const getCreateGeneralJournalFormStartWorkDate = (state: StateSchema) => state.addReportForm?.formData?.startWorkDate ?? '';
export const getCreateGeneralJournalEndWorkDate = (state: StateSchema) => state.addReportForm?.formData?.endWorkDate ?? '';
