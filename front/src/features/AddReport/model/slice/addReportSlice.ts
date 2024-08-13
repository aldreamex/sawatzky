import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AddReportSchema } from '../type/addReport';

const initialState: AddReportSchema = {
  isOpen: false,
  isLoading: false,
  formData: {},
  calendarIsOpen: false,
};

export const addReportSlice = createSlice({
  name: 'addReport',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.formData = {};
    },
    setWorkObjectsGroup: (state, action: PayloadAction<number>) => {
      state.formData.workObjectsGroup = action.payload;
      state.formData.workObject = undefined;
    },
    setWorkObject: (state, action: PayloadAction<number>) => {
      state.formData.workObject = action.payload;
    },
    setLegalEntity: (state, action: PayloadAction<number>) => {
      state.formData.legalEntity = action.payload;
    },
    setEmployee: (state, action: PayloadAction<number>) => {
      state.formData.employee = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.formData.status = action.payload;
    },
    setStartWorkDate: (state, action: PayloadAction<string>) => {
      state.formData.startWorkDate = action.payload;
    },
    setEndWorkDate: (state, action: PayloadAction<string>) => {
      state.formData.endWorkDate = action.payload;
    },
    clearWorkDates: (state) => {
      state.formData.startWorkDate = '';
      state.formData.endWorkDate = '';
    },
    openCalendar: (state) => {
      state.calendarIsOpen = true;
    },
    closeCalendar: (state) => {
      state.calendarIsOpen = false;
    },
    clearForm: (state) => {
      state.formData = {};
    },
  },
});

export const { actions: addReportActions } = addReportSlice;
export const { reducer: addReportReducer } = addReportSlice;
