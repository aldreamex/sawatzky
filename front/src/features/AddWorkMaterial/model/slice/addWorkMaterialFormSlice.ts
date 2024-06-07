import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkMaterial } from 'entities/WorkMaterial';
import { AddWorkMaterialFormSchema } from '../type/addWorkMaterial';
import { createWorkMaterial } from '../services/createWorkMaterial';

const initialState: AddWorkMaterialFormSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {
    status: false,
  },
};

export const addWorkMaterialFormSlice = createSlice({
  name: 'addWorkMaterialForm',
  initialState,
  reducers: {

    openModal: (state) => {
      state.isOpen = true;
      state.formData.status = true;
    },
    openEditModal: (state, action: PayloadAction<WorkMaterial>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.formData.name = action.payload.name ?? '';
      state.formData.price = action.payload.price ?? '';
      state.formData.count = action.payload.count ?? '';
      state.formData.status = action.payload.status;
      state.workMaterialId = +action.payload.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.formData = {};
    },
    setName: (state, action: PayloadAction<string>) => {
      state.formData = { ...state.formData, name: action.payload };
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.formData = { ...state.formData, price: action.payload };
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.formData = { ...state.formData, count: action.payload };
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.formData = { ...state.formData, status: action.payload };
    },

  },
  extraReducers: (builder) => builder
    // Создание услуги
    .addCase(createWorkMaterial.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(createWorkMaterial.fulfilled, (state) => {
      state.isLoading = false;
      state.formData = {};
      state.isOpen = false;
    })
    .addCase(createWorkMaterial.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: addWorkMaterialFormActions } = addWorkMaterialFormSlice;
export const { reducer: addWorkMaterialFormReducer } = addWorkMaterialFormSlice;
