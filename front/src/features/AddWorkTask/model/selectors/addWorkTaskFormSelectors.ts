import { StateSchema } from 'app/providers';

export const getAddWorkTaskFormIsOpen = (state: StateSchema) => state.addWorkTaskForm?.isOpen;
export const getAddWorkTaskName = (state: StateSchema) => state.addWorkTaskForm?.formData?.name;
export const getAddWorkTaskPrice = (state: StateSchema) => state.addWorkTaskForm?.formData?.price;
export const getAddWorkTaskTime = (state: StateSchema) => state.addWorkTaskForm?.formData?.time;
export const getAddWorkTaskHours = (state: StateSchema) => state.addWorkTaskForm?.formData?.hours;
export const getAddWorkTaskMinutes = (state: StateSchema) => state.addWorkTaskForm?.formData?.minutes;
export const getAddWorkTaskStatus = (state: StateSchema) => state.addWorkTaskForm?.formData?.status;
export const getAddWorkTaskIsEdit = (state: StateSchema) => state.addWorkTaskForm?.isEdit;
export const getAddWorkTaskForm = (state: StateSchema) => state.addWorkTaskForm?.formData;
export const getAddWorkTaskFormId = (state: StateSchema) => state.addWorkTaskForm?.workTaskId;
