import { StateSchema } from 'app/providers';

// sawatzky
// export const getCreateGeneralJournalSawatzkyFormData = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData;
// export const getCreateGeneralJournalSawatzkyFormWorkObjectGroup = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.workObjectGroup;
// export const getCreateGeneralJournalSawatzkyFormWorkObject = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.workObject;
// export const getCreateGeneralJournalSawatzkyFormWorkingObjects = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.workingObjects;
// export const getCreateGeneralJournalSawatzkyFormPosition = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.position;
// export const getCreateGeneralJournalSawatzkyFormRole = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.role;
// export const getCreateGeneralJournalSawatzkyFormStatus = (state: StateSchema) => state.editGeneralJournal?.sawatzkyFormData.status;

export const getCreateGeneralJournalError = (state: StateSchema) => state.editGeneralJournal?.error;
export const getCreateGeneralJournalIsLoading = (state: StateSchema) => state.editGeneralJournal?.isLoading;
export const getCreateGeneralJournalIsOpen = (state: StateSchema) => state.editGeneralJournal?.isOpen;

// general journal
export const getCreateGeneralJournalFormLegalEntity = (state: StateSchema) => state.editGeneralJournal?.formData.legalEntity;
export const getCreateGeneralJournalFormData = (state: StateSchema) => state.editGeneralJournal?.formData;
export const getCreateGeneralJournalIsEdit = (state: StateSchema) => state.editGeneralJournal?.isEdit;
export const getCreateGeneralJournalIsView = (state: StateSchema) => state.editGeneralJournal?.isView;
export const getCreateGeneralJournalId = (state: StateSchema) => state.editGeneralJournal?.employeeId;
// new
export const getCreateGeneralJournalUserFormReceiptDate = (state: StateSchema) => state.editGeneralJournal?.formData?.receiptDate;

// // user
// export const getCreateGeneralJournalUserFormFio = (state: StateSchema) => state.editGeneralJournal?.user?.fio;
// export const getCreateGeneralJournalUserFormUsername = (state: StateSchema) => state.editGeneralJournal?.user?.username;
// export const getCreateGeneralJournalUserFormPassword = (state: StateSchema) => state.editGeneralJournal?.user?.password;
// export const getCreateGeneralJournalUserFormPhoneNumber = (state: StateSchema) => state.editGeneralJournal?.user?.phoneNumber;
// export const getCreateGeneralJournalUser = (state: StateSchema) => state.editGeneralJournal?.user;

export const getNew = (state: StateSchema) => state.editGeneralJournal;

// export const getAddReportFormCalendarIsOpen = (state: StateSchema) => state.addReportForm?.calendarIsOpen;

export const getCreateGeneralJournalTotalAmount = (state: StateSchema) => state.editGeneralJournal?.formData.totalAmount;
export const getCreateGeneralJournalPaymentDocumentNumber = (state: StateSchema) => state.editGeneralJournal?.formData.paymentDocumentNumber;

export const getEditGeneralJournalInfo = (state: StateSchema) => state.editGeneralJournal?.info;

export const getEditGeneralJournalSelectOptions = (state: StateSchema) => state.editGeneralJournal?.selectOptions;
export const getEditGeneralJournalSelectedApplications = (state: StateSchema) => state.editGeneralJournal?.selectedApplications;
export const getEditGeneralJournalFullSelectedApplications = (state: StateSchema) => state.editGeneralJournal?.fullSelectedApplications;
