import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchApplicationsByLegalEntity } from '../services/fetchApplicationsByLegalEntity';
// import { Employee } from 'entities/Employee';
// import { GeneralJournal } from 'entities/GeneralJournal';
// import { SawatzkyEmployee } from 'entities/SawatzkyEmployee';
import { EditGeneralJournalSchema } from '../type/editGeneralJournal';

const initialState: EditGeneralJournalSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
  formData: {
    paymentDocumentNumber: '',
    receiptDate: '',
    totalAmount: '',
  },
  isCalendarOpen: false,
  selectOptions: [],
  selectedApplications: [],
  fullSelectedApplications: [],
};

export const createGeneralJournalSlice = createSlice({
  name: 'editGeneralJournal',
  initialState,
  reducers: {

    openCreateModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.info = action.payload;
    },
    openEditModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.isEdit = true;
      // state.employeeId = +action.payload.id;
      // state.formData.legalEntity = action.payload.legalEntity.id;
      // state.formData.role = action.payload.role;
      // state.formData.status = action.payload.status;
      // state.formData.user.fio = action.payload.user.fio ?? '';
      // state.formData.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      // state.user.fio = action.payload.user.fio ?? '';
      // state.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      // state.user.username = action.payload.user.username ?? '';
    },
    openViewModal: (state, action: PayloadAction<any>) => {
      state.isOpen = true;
      state.isView = true;
      // state.employeeId = +action.payload.id;
      // state.formData.legalEntity = action.payload.legalEntity.id;
      // state.formData.role = action.payload.role;
      // state.formData.status = action.payload.status;
      // state.formData.user.fio = action.payload.user.fio ?? '';
      // state.formData.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      // state.user.fio = action.payload.user.fio ?? '';
      // state.user.phoneNumber = action.payload.user.phoneNumber ?? '';
      // state.user.username = action.payload.user.username ?? '';
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.error = undefined;
      state.isLoading = false;
      state.isEdit = false;
    },
    // Sawatzky form actions
    setReceiptDate: (state, action: PayloadAction<string>) => {
      state.formData.receiptDate = action.payload;
    },

    // form user actions
    // setPaymentDocumentNumber: (state, action: PayloadAction<string>) => {
    //   state.formData.paymentDocumentNumber = action.payload;
    // },
    // setTotalAmount: (state, action: PayloadAction<string>) => {
    //   state.formData.totalAmount = action.payload;
    // },
    // setLegalEntity: (state, action: PayloadAction<number>) => {
    //   state.formData.legalEntity = action.payload;
    // },
    // setStartWorkDate: (state, action: PayloadAction<string>) => {
    //   state.startWorkDate = action.payload;
    // },
    // setEndWorkDate: (state, action: PayloadAction<string>) => {
    //   state.endWorkDate = action.payload;
    // },
    clearWorkDates: (state) => {
      state.startWorkDate = '';
      state.endWorkDate = '';
    },
    openCalendar: (state) => {
      state.isCalendarOpen = true;
    },
    closeCalendar: (state) => {
      state.isCalendarOpen = false;
    },
    setSelectedApplications: (state, action: PayloadAction<any>) => {
      state.selectedApplications = action.payload;
    },
    setFullSelectedApplications: (state, action: PayloadAction<any>) => {
      state.fullSelectedApplications = action.payload;
    },
    setFullSelectedValueApplications: (state, action: PayloadAction<any>) => {
      const currentIndex = state.fullSelectedApplications.findIndex((item) => item.id === action.payload.app.id);
      if (currentIndex !== -1) {
        state.fullSelectedApplications[currentIndex].value = action.payload.value;
        state.fullSelectedApplications[currentIndex].isDirty = true;
      }
      // current.value = action.payload.value;
      console.log('current', currentIndex, state.fullSelectedApplications);
    },
  },

  extraReducers: (builder) => builder
    .addCase(fetchApplicationsByLegalEntity.pending, (state, action) => {
      state.isLoading = true;
    })
    .addCase(fetchApplicationsByLegalEntity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectOptions = action.payload;
      // GeneralJournalAdapter.setAll(state, action.payload);
    })
    .addCase(fetchApplicationsByLegalEntity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: createGeneralJournalActions } = createGeneralJournalSlice;
export const { reducer: createGeneralJournalReducer } = createGeneralJournalSlice;
