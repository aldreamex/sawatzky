import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LegalEntity } from 'entities/LegalEntity';
import { CreateLegalEntitySchema } from '../type/createLegalEntity';

const initialState: CreateLegalEntitySchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {},
};

export const createLegalEntitySlice = createSlice({
  name: 'createLegalEntity',
  initialState,
  reducers: {

    openModal: (state) => {
      state.isOpen = true;
    },
    openViewModal: (state, action: PayloadAction<LegalEntity>) => {
      state.isOpen = true;
      state.isView = true;
      state.legalEntityId = +action.payload.id;
      state.formData.name = action.payload.name ?? '';
      state.formData.head = action.payload.head ?? '';
      state.formData.legalAddress = action.payload.legalAddress ?? '';
      state.formData.actualAddress = action.payload.actualAddress ?? '';
      state.formData.phone = action.payload.phone ?? '';
      state.formData.mail = action.payload.mail ?? '';
      state.formData.INN = action.payload.INN ?? '';
      state.formData.settlementAccount = action.payload.settlementAccount ?? '';
      state.formData.correspondentAccount = action.payload.correspondentAccount ?? '';
      state.formData.bank = action.payload.bank ?? '';
      state.formData.bik = action.payload.bik ?? '';
      state.formData.prepayment = action.payload.prepayment;
      state.formData.status = action.payload.status;
      state.formData.workObject = action.payload.workObject?.id;
      state.formData.workObjectsGroup = action.payload.workObjectsGroup?.id;
      state.formData.workTaskGroups = action.payload.workTaskGroups?.map((item) => item.id);
      state.formData.workMaterialGroups = action.payload.workMaterialGroups?.map((item) => item.id);
      state.formData.sawatzky = action.payload.sawatzky;
      state.legalEntityId = action.payload.id;
    },
    openEditModal: (state, action: PayloadAction<LegalEntity>) => {
      state.isOpen = true;
      state.isEdit = true;
      state.legalEntityId = +action.payload.id;
      state.formData.name = action.payload.name ?? '';
      state.formData.head = action.payload.head ?? '';
      state.formData.legalAddress = action.payload.legalAddress ?? '';
      state.formData.actualAddress = action.payload.actualAddress ?? '';
      state.formData.phone = action.payload.phone ?? '';
      state.formData.mail = action.payload.mail ?? '';
      state.formData.INN = action.payload.INN ?? '';
      state.formData.settlementAccount = action.payload.settlementAccount ?? '';
      state.formData.correspondentAccount = action.payload.correspondentAccount ?? '';
      state.formData.bank = action.payload.bank ?? '';
      state.formData.bik = action.payload.bik ?? '';
      state.formData.prepayment = action.payload.prepayment;
      state.formData.status = action.payload.status;
      state.formData.workObject = action.payload.workObject?.id;
      state.formData.workObjectsGroup = action.payload.workObjectsGroup?.id;
      state.formData.workTaskGroups = action.payload.workTaskGroups?.map((item) => item.id);
      state.formData.workMaterialGroups = action.payload.workMaterialGroups?.map((item) => item.id);
      state.formData.sawatzky = action.payload.sawatzky;
      state.legalEntityId = action.payload.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.isEdit = false;
      state.formData = {
      };
    },
    setWorkObjectsGroup: (state, action: PayloadAction<number>) => {
      state.formData.workObjectsGroup = action.payload;
      state.formData.workObject = undefined;
    },
    setWorkObject: (state, action: PayloadAction<number>) => {
      state.formData.workObject = action.payload;
    },
    setINN: (state, action: PayloadAction<string>) => {
      state.formData.INN = action.payload;
    },
    setActualAddress: (state, action: PayloadAction<string>) => {
      state.formData.actualAddress = action.payload;
    },
    setBank: (state, action: PayloadAction<string>) => {
      state.formData.bank = action.payload;
    },
    setBik: (state, action: PayloadAction<string>) => {
      state.formData.bik = action.payload;
    },
    setCorrespondentAccount: (state, action: PayloadAction<string>) => {
      state.formData.correspondentAccount = action.payload;
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.formData.status = action.payload;
    },
    setHead: (state, action: PayloadAction<string>) => {
      state.formData.head = action.payload;
    },
    setLegalAddress: (state, action: PayloadAction<string>) => {
      state.formData.legalAddress = action.payload;
    },
    setMail: (state, action: PayloadAction<string>) => {
      state.formData.mail = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.formData.name = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.formData.phone = action.payload;
    },
    setPrepayment: (state, action: PayloadAction<boolean>) => {
      state.formData.prepayment = action.payload;
    },
    setSawatzky: (state, action: PayloadAction<boolean>) => {
      state.formData.sawatzky = action.payload;
    },
    setSettlementAccount: (state, action: PayloadAction<string>) => {
      state.formData.settlementAccount = action.payload;
    },
    setWorkMaterialGroups: (state, action: PayloadAction<number[]>) => {
      state.formData.workMaterialGroups = action.payload;
    },
    setWorkTaskGroups: (state, action: PayloadAction<number[]>) => {
      state.formData.workTaskGroups = action.payload;
    },
  },
});

export const { actions: createLegalEntityActions } = createLegalEntitySlice;
export const { reducer: createLegalEntityReducer } = createLegalEntitySlice;
