import { createSlice } from '@reduxjs/toolkit';
import { ChangePasswordSchema } from '../type/changePassword';

const initialState: ChangePasswordSchema = {
  isOpen: false,
  isLoading: false,
  formData: {},
};

export const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.formData = {};
    },
  },
});

export const { actions: changePasswordActions } = changePasswordSlice;
export const { reducer: changePasswordReducer } = changePasswordSlice;
