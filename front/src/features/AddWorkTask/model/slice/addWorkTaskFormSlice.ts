import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkTask } from 'entities/WorkTask';
import { AddWorkTaskFormSchema } from '../type/addWorkTask';
import { createWorkTask } from '../services/createWorkTask';

const initialState: AddWorkTaskFormSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {
    status: false,
  },
};

export const addWorkTaskFormSlice = createSlice({
  name: 'addWorkTaskForm',
  initialState,
  reducers: {

    openModal: (state) => {
      state.isOpen = true;
      state.formData.status = true;
    },
    openEditModal: (state, action: PayloadAction<WorkTask>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.formData.name = action.payload.name ?? '';
      state.formData.price = action.payload.price ?? '';
      const time = action.payload.time ?? '';
      state.formData.hours = Math.floor(time / 60);
      state.formData.minutes = time % 60;
      state.formData.status = action.payload.status;
      state.workTaskId = +action.payload.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.isEdit = false;
      state.formData = {};
    },
    setName: (state, action: PayloadAction<string>) => {
      state.formData = { ...state.formData, name: action.payload };
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.formData = { ...state.formData, price: action.payload };
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.formData = { ...state.formData, time: action.payload };
    },
    setHours: (state, action: PayloadAction<number>) => {
      state.formData = { ...state.formData, hours: action.payload };
    },
    setMinutes: (state, action: PayloadAction<number>) => {
      state.formData = { ...state.formData, minutes: action.payload };
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.formData = { ...state.formData, status: action.payload };
    },

  },
  extraReducers: (builder) => builder
    // Создание услуги
    .addCase(createWorkTask.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(createWorkTask.fulfilled, (state) => {
      state.isLoading = false;
      state.formData = {};
      state.isOpen = false;
    })
    .addCase(createWorkTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: addWorkTaskFormActions } = addWorkTaskFormSlice;
export const { reducer: addWorkTaskFormReducer } = addWorkTaskFormSlice;
