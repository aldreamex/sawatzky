import { StateSchema } from 'app/providers';

export const getAddWorkTaskGroupFormIsOpen = (state: StateSchema) => state.addWorkTaskGroupForm?.isOpen;
export const getAddWorkTaskGroupFormData = (state: StateSchema) => state.addWorkTaskGroupForm?.formData;
export const getWorkTaskGroupFormName = (state: StateSchema) => state.addWorkTaskGroupForm?.formData?.name;
export const getWorkTaskGroupFormIsLoading = (state: StateSchema) => state.addWorkTaskGroupForm?.isLoading;
export const getWorkTaskGroupFormError = (state: StateSchema) => state.addWorkTaskGroupForm?.error;
export const getWorkTaskGroupFormIsEdit = (state: StateSchema) => state.addWorkTaskGroupForm?.isEdit;
export const getWorkTaskGroupFormId = (state: StateSchema) => state.addWorkTaskGroupForm?.workTaskGroupId;
