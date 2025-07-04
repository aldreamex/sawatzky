import { StateSchema } from 'app/providers';

export const getAddWorkTaskApplicationFormIsOpen = (state: StateSchema) => state.addWorkTaskApplicationForm?.isOpen;
export const getAddWorkTaskApplicationFormSelectedItem = (state: StateSchema) => state.addWorkTaskApplicationForm?.selectedItem;
export const getAddWorkTaskApplicationFormStep = (state: StateSchema) => state.addWorkTaskApplicationForm?.formStep;
export const getAddWorkTaskApplicationFormActualTime = (state: StateSchema) => state.addWorkTaskApplicationForm?.selectedItem?.actualTime;
export const getAddWorkTaskApplicationFormActualTimeText = (state: StateSchema) => state.addWorkTaskApplicationForm?.actualTimeText;
export const getAddWorkTaskApplicationFormInit = (state: StateSchema) => state.addWorkTaskApplicationForm?._init;
export const getAddWorkTaskApplicationFormData = (state: StateSchema) => state.addWorkTaskApplicationForm?.formData;
export const getAddWorkTaskApplicationFormDataHours = (state: StateSchema) => state.addWorkTaskApplicationForm?.hours;
export const getAddWorkTaskApplicationFormDataMinutes = (state: StateSchema) => state.addWorkTaskApplicationForm?.minutes;
