import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkMaterialGroupItem } from 'entities/WorkMaterialGroup';
import { AddWorkMaterialGroupFormSchema, AddWorkMaterialGroupFormData } from '../type/addWorkMaterialGroup';
import { createWorkMaterialGroup } from '../services/createWorkMaterialGroup';

const initialState: AddWorkMaterialGroupFormSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {
    name: '',
  },
};

export const addWorkMaterialGroupFormSlice = createSlice({
  name: 'addWorkMaterialGroupForm',
  initialState,
  reducers: {

    openModal: (state) => {
      state.isOpen = true;
    },
    openEditModal: (state, action: PayloadAction<WorkMaterialGroupItem>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.formData.name = action.payload.name ?? '';
      state.workMaterialId = action.payload.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    setFormData: (state, action: PayloadAction<AddWorkMaterialGroupFormData>) => {
      state.formData = action.payload;
    },

  },
  extraReducers: (builder) => builder
    // Получение списка групп услуг
    .addCase(createWorkMaterialGroup.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(createWorkMaterialGroup.fulfilled, (state) => {
      state.isLoading = false;
      state.formData = {
        name: '',
      };
      state.isOpen = false;
    })
    .addCase(createWorkMaterialGroup.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: addWorkMaterialGroupFormActions } = addWorkMaterialGroupFormSlice;
export const { reducer: addWorkMaterialGroupFormReducer } = addWorkMaterialGroupFormSlice;
