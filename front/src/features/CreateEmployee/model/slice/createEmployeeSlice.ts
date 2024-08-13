import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Employee } from 'entities/Employee';
import { SawatzkyEmployee } from 'entities/SawatzkyEmployee';
import { CreateEmployeeSchema } from '../type/createEmployee';

const initialState: CreateEmployeeSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  changePasswordData: {
    new_password: '',
    old_password: '',
  },
  sawatzkyFormData: {
    status: true,
    user: {
      fio: '',
      phoneNumber: '',
    },
  },
  formData: {
    status: false,
    user: {
      fio: '',
      phoneNumber: '',
    },
  },
  user: {
    fio: '',
    phoneNumber: '',
  },
};

export const createEmployeeSlice = createSlice({
  name: 'createEmployee',
  initialState,
  reducers: {

    openCreateModal: (state) => {
      state.isOpen = true;
      state.sawatzkyFormData.status = true;
    },
    openEditModal: (state, action: PayloadAction<Employee>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.employeeId = +action.payload.id;
      state.formData.legalEntity = action.payload.legalEntity.id;
      state.formData.role = action.payload.role;
      state.formData.status = action.payload.status;
      state.formData.user.fio = action.payload.user.fio ?? '';
      state.formData.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.user.fio = action.payload.user.fio ?? '';
      state.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.user.username = action.payload.user.username ?? '';
    },
    openViewModal: (state, action: PayloadAction<Employee>) => {
      state.isOpen = true;
      state.isView = true;
      state.employeeId = +action.payload.id;
      state.formData.legalEntity = action.payload.legalEntity.id;
      state.formData.role = action.payload.role;
      state.formData.status = action.payload.status;
      state.formData.user.fio = action.payload.user.fio ?? '';
      state.formData.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.user.fio = action.payload.user.fio ?? '';
      state.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.user.username = action.payload.user.username ?? '';
    },

    openEditSawazkyModal: (state, action: PayloadAction<SawatzkyEmployee>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.employeeId = +action.payload.id;
      state.sawatzkyFormData.role = action.payload.role;
      state.sawatzkyFormData.role = action.payload.role;
      state.sawatzkyFormData.status = action.payload.status;
      state.sawatzkyFormData.user.fio = action.payload.user.fio ?? '';
      state.sawatzkyFormData.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.sawatzkyFormData.position = action.payload.position;
      state.sawatzkyFormData.workObject = action.payload.workObject.id;
      state.sawatzkyFormData.workObjectGroup = action.payload.workObjectGroup.id;
      state.sawatzkyFormData.workingObjects = action.payload.workingObjects;
      state.user.fio = action.payload.user.fio ?? '';
      state.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      state.user.username = action.payload.user.username ?? '';
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.error = undefined;
      state.isLoading = false;
      state.isEdit = false;
      state.sawatzkyFormData = {
        user: {
          fio: '',
          phoneNumber: '',
        },
      };
      state.formData = {
        user: {
          fio: '',
          phoneNumber: '',
        },
      };
      state.user = {
        fio: '',
        phoneNumber: '',
      };
    },
    // Sawatzky form actions
    setWorkObjectGroup: (state, action: PayloadAction<number>) => {
      state.sawatzkyFormData.workObjectGroup = action.payload;
      state.sawatzkyFormData.workObject = undefined;
      state.sawatzkyFormData.workingObjects = undefined;
    },
    setWorkObject: (state, action: PayloadAction<number>) => {
      state.sawatzkyFormData.workObject = action.payload;
      state.sawatzkyFormData.workingObjects = undefined;
    },
    setPosition: (state, action: PayloadAction<string>) => {
      state.sawatzkyFormData.position = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.sawatzkyFormData.role = action.payload;
      state.formData.role = action.payload;
    },
    setWorkingObjects: (state, action: PayloadAction<number[]>) => {
      state.sawatzkyFormData.workingObjects = action.payload;
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.sawatzkyFormData.status = action.payload;
      state.formData.status = action.payload;
    },

    // form user actions
    setFio: (state, action: PayloadAction<string>) => {
      state.user.fio = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.user.phoneNumber = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.user.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.user.password = action.payload;
    },
    setNewPassword: (state, action: PayloadAction<string>) => {
      state.changePasswordData.new_password = action.payload;
    },
    setOldPassword: (state, action: PayloadAction<string>) => {
      state.changePasswordData.old_password = action.payload;
    },
    // employee actions
    setLegalEntity: (state, action: PayloadAction<number>) => {
      state.formData.legalEntity = action.payload;
    },
  },
});

export const { actions: createEmployeeActions } = createEmployeeSlice;
export const { reducer: createEmployeeReducer } = createEmployeeSlice;
