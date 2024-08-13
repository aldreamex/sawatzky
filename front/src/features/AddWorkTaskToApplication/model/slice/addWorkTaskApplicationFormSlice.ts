import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkTask } from 'entities/WorkTask';
import { AddWorkTaskApplicationFormSchema, ApplicationWorkTaskForPatch, FormStep } from '../type/addWorkTaskApplicationForm';

const initialState: AddWorkTaskApplicationFormSchema = {
  isOpen: false,
  isLoading: false,
  formStep: FormStep.CHOSE,
  formData: {},
  _init: false,
};

interface initialData {
  id: string;
  prevWorkTasks: ApplicationWorkTaskForPatch[];
}

export const addWorkTaskApplicationFormSlice = createSlice({
  name: 'addWorkTaskApplicationForm',
  initialState,
  reducers: {

    initForm: (state, action: PayloadAction<initialData>) => {
      state.formData.applicationId = action.payload.id;
      state.formData.prevWorkTasks = action.payload.prevWorkTasks;
      state._init = true;
    },

    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedItem = undefined;
      state.actualTimeText = '';
      state.formStep = FormStep.CHOSE;
      state.hours = undefined;
      state.minutes = undefined;
      state.formData = {};
    },
    setActualStep: (state) => {
      state.formStep = FormStep.ACTUAL;
    },
    setChoseStep: (state) => {
      state.formStep = FormStep.CHOSE;
    },
    selectItem: (state, action: PayloadAction<WorkTask>) => {
      state.selectedItem = action.payload;
    },
    setActualTimeText: (state, action: PayloadAction<string>) => {
      state.actualTimeText = action.payload;
    },
    setHours: (state, action: PayloadAction<string>) => {
      state.hours = action.payload;
    },
    setMinutes: (state, action: PayloadAction<string>) => {
      state.minutes = action.payload;
    },
  },
  extraReducers: (builder) => builder,

});

export const { actions: addWorkTaskApplicationFormActions } = addWorkTaskApplicationFormSlice;
export const { reducer: addWorkTaskApplicationFormReducer } = addWorkTaskApplicationFormSlice;
