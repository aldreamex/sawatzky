import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ApplicationInfo } from 'pages/ApplicationDetailPage';
import { CreateApplicationSchema } from '../type/createApplication';
import { saveApplication } from '../serivces/saveApplication/saveApplication';

const initialState: CreateApplicationSchema = {
  isLoading: false,
  data: undefined,
  form: {},
  error: undefined,
  calendarIsOpen: false,
  isOpen: false,
  isEdit: false,
};

export const createApplicationSlice = createSlice({
  name: 'createApplication',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.form.title = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.form.subject = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.form.description = action.payload;
    },
    setStartWorkDate: (state, action: PayloadAction<string>) => {
      state.form.startWorkDate = action.payload;
    },
    setEndWorkDate: (state, action: PayloadAction<string>) => {
      state.form.endWorkDate = action.payload;
    },
    clearWorkDates: (state) => {
      state.form.startWorkDate = '';
      state.form.endWorkDate = '';
    },
    clearForm: (state) => {
      state.form = {};
    },
    openCalendar: (state) => {
      state.calendarIsOpen = true;
    },
    closeCalendar: (state) => {
      state.calendarIsOpen = false;
    },
    closeForm: (state) => {
      state.isOpen = false;
      state.form = {};
      state.isEdit = false;
    },
    openForm: (state) => {
      state.isOpen = true;
    },
    openEditForm: (state, action: PayloadAction<ApplicationInfo>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.form.description = action.payload.description;
      state.form.title = action.payload.title;
      state.form.subject = action.payload.subject;
      state.form.startWorkDate = action.payload.startWorkDate;
      state.form.endWorkDate = action.payload.endWorkDate;
      state.applicationId = action.payload.id;
    },
  },
  extraReducers: (builder) => builder
    // Аунтификация пользователя
    .addCase(saveApplication.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(saveApplication.fulfilled, (state, action) => {
      state.isLoading = false;
      state.form = {};
    })
    .addCase(saveApplication.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: createApplicationActions } = createApplicationSlice;
export const { reducer: createApplicationReducer } = createApplicationSlice;
