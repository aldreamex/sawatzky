import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CreateGeneralJournalSchema } from '../type/createGeneralJournal';

const initialState: CreateGeneralJournalSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  calendarIsOpen: false,
  formData: {
    paymentDocumentNumber: '',
    receiptDate: '',
    totalAmount: '',
    startWorkDate: '',
    endWorkDate: '',
  },
};

export const createGeneralJournalSlice = createSlice({
  name: 'createGeneralJournal',
  initialState,
  reducers: {

    openCreateModal: (state) => {
      state.isOpen = true;
    },
    openViewModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.isView = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.error = undefined;
      state.isLoading = false;
      state.isEdit = false;
      state.formData.paymentDocumentNumber = '';
      state.formData.legalEntity = undefined;
      state.formData.receiptDate = '';
      state.formData.totalAmount = '';
    },
    closeEditModal: (state) => {
      state.error = undefined;
      state.isLoading = false;
      state.isEdit = false;
    },
    setReceiptDate: (state, action: PayloadAction<string>) => {
      state.formData.receiptDate = action.payload;
    },
    setPaymentDocumentNumber: (state, action: PayloadAction<string>) => {
      state.formData.paymentDocumentNumber = action.payload;
    },
    setTotalAmount: (state, action: PayloadAction<string>) => {
      state.formData.totalAmount = action.payload;
    },
    setLegalEntity: (state, action: PayloadAction<number>) => {
      state.formData.legalEntity = action.payload;
    },
    closeCalendar: (state) => {
      state.calendarIsOpen = false;
    },
    clearWorkDates: (state) => {
      state.formData.startWorkDate = '';
      state.formData.endWorkDate = '';
    },
    openCalendar: (state) => {
      state.calendarIsOpen = true;
    },
    setStartWorkDate: (state, action: PayloadAction<string>) => {
      state.formData.startWorkDate = action.payload;
    },
    setEndWorkDate: (state, action: PayloadAction<string>) => {
      state.formData.endWorkDate = action.payload;
    },
  },
});

export const { actions: createGeneralJournalActions } = createGeneralJournalSlice;
export const { reducer: createGeneralJournalReducer } = createGeneralJournalSlice;
