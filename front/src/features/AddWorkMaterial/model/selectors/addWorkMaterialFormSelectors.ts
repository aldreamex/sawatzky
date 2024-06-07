import { StateSchema } from 'app/providers';

export const getAddWorkMaterialFormIsOpen = (state: StateSchema) => state.addWorkMaterialForm?.isOpen;
export const getAddWorkMaterialName = (state: StateSchema) => state.addWorkMaterialForm?.formData?.name;
export const getAddWorkMaterialPrice = (state: StateSchema) => state.addWorkMaterialForm?.formData?.price;
export const getAddWorkMaterialCount = (state: StateSchema) => state.addWorkMaterialForm?.formData?.count;
export const getAddWorkMaterialStatus = (state: StateSchema) => state.addWorkMaterialForm?.formData?.status;
export const getAddWorkMaterialFormIsEdit = (state: StateSchema) => state.addWorkMaterialForm?.isEdit;
export const getAddWorkMaterialId = (state: StateSchema) => state.addWorkMaterialForm?.workMaterialId;
export const getAddWorkMaterialForm = (state: StateSchema) => state.addWorkMaterialForm?.formData;
