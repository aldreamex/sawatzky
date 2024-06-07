import { StateSchema } from 'app/providers';

export const getWorkObjectGroupFormData = (state: StateSchema) => state.addWorkObjectForm?.formData;
export const getWorkObjectGroupFormName = (state: StateSchema) => state.addWorkObjectGroupForm?.formData?.name;
export const getWorkObjectGroupFormIsOpen = (state: StateSchema) => state.addWorkObjectGroupForm?.isOpen;
export const getWorkObjectGroupFormIsLoading = (state: StateSchema) => state.addWorkObjectGroupForm?.isLoading;
export const getWorkObjectGroupFormError = (state: StateSchema) => state.addWorkObjectGroupForm?.error;
export const getWorkObjectGroupFormIsEdit = (state: StateSchema) => state.addWorkObjectGroupForm?.isEdit;
export const getWorkObjectGroupFormId = (state: StateSchema) => state.addWorkObjectGroupForm?.workObjectGroupId;
