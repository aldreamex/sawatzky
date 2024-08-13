import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchApplicationsByLegalEntity } from '../services/fetchApplicationsByLegalEntity';
import { EditGeneralJournalSchema } from '../type/editGeneralJournal';

const initialState: EditGeneralJournalSchema = {
  isOpen: false,
  isLoading: false,
  isEdit: false,
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
