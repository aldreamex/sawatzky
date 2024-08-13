import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkTaskGroupItem } from 'entities/WorkTaskGroup';
import { AddWorkTaskGroupFormSchema, addWorkTaskGroupFormData } from '../type/addWorkTaskGroup';
import { createWorkTaskGroup } from '../services/createWorkTaskGroup';

const initialState: AddWorkTaskGroupFormSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {
    name: '',
  },
};

export const addWorkTaskGroupFormSlice = createSlice({
  name: 'addWorkTaskGroupForm',
  initialState,
  reducers: {

    openModal: (state) => {
      state.isOpen = true;
    },
    openEditModal: (state, action: PayloadAction<WorkTaskGroupItem>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.formData.name = action.payload.name ?? '';
      state.workTaskGroupId = action.payload.id ?? '';
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    setFormData: (state, action: PayloadAction<addWorkTaskGroupFormData>) => {
      state.formData = action.payload;
    },

  },
  extraReducers: (builder) => builder
    // Получение списка групп услуг
    .addCase(createWorkTaskGroup.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(createWorkTaskGroup.fulfilled, (state) => {
      state.isLoading = false;
      state.formData = {
        name: '',
      };
      state.isOpen = false;
    })
    .addCase(createWorkTaskGroup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: addWorkTaskGroupFormActions } = addWorkTaskGroupFormSlice;
export const { reducer: addWorkTaskGroupFormReducer } = addWorkTaskGroupFormSlice;
