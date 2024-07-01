import { StateSchema } from 'app/providers';

export const getCreateGeneralJournalError = (state: StateSchema) => state.editGeneralJournal?.error;
export const getCreateGeneralJournalIsLoading = (state: StateSchema) => state.editGeneralJournal?.isLoading;
export const getCreateGeneralJournalIsOpen = (state: StateSchema) => state.editGeneralJournal?.isOpen;

export const getEditGeneralJournalSelectOptions = (state: StateSchema) => state.editGeneralJournal?.selectOptions;
export const getEditGeneralJournalSelectedApplications = (state: StateSchema) => state.editGeneralJournal?.selectedApplications;
export const getCreateGeneralJournalIsEdit = (state: StateSchema) => state.editGeneralJournal?.isEdit;
export const getEditGeneralJournalInfo = (state: StateSchema) => state.editGeneralJournal?.info;
export const getEditGeneralJournalFullSelectedApplications = (state: StateSchema) => state.editGeneralJournal?.fullSelectedApplications;
