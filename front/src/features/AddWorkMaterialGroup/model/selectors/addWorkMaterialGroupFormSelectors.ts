import { StateSchema } from 'app/providers';

export const getAddWorkMaterialGroupFormIsOpen = (state: StateSchema) => state.addWorkMaterialGroupForm?.isOpen;
export const getAddWorkMaterialGroupFormData = (state: StateSchema) => state.addWorkMaterialGroupForm?.formData;
export const getAddWorkMaterialGroupFormName = (state: StateSchema) => state.addWorkMaterialGroupForm?.formData?.name;
export const getAddWorkMaterialGroupFormIsLoading = (state: StateSchema) => state.addWorkMaterialGroupForm?.isLoading;
export const getAddWorkMaterialGroupFormError = (state: StateSchema) => state.addWorkMaterialGroupForm?.error;
export const getAddWorkMaterialGroupFormIsEdit = (state: StateSchema) => state.addWorkMaterialGroupForm?.isEdit;
export const getAddWorkMaterialGroupFormId = (state: StateSchema) => state.addWorkMaterialGroupForm?.workMaterialId;
