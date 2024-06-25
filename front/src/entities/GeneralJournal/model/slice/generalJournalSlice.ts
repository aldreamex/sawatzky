import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers';
import { fetchGeneralJournalList } from '../services/fetchGeneralJournalList';
import { GeneralJournalSchema, GeneralJournal } from '../type/generalJournal';

export const GeneralJournalAdapter = createEntityAdapter<GeneralJournal>({
  selectId: (employee) => employee.id,
});

export const getEmployee = GeneralJournalAdapter.getSelectors<StateSchema>(
  (state) => state.generalJournal || GeneralJournalAdapter.getInitialState(),
);
export const getGeneralJournal = GeneralJournalAdapter.getSelectors<StateSchema>(
  (state) => state.generalJournal || GeneralJournalAdapter.getInitialState(),
);

export const generalJournalSlice = createSlice({
  name: 'generalJournal',
  initialState: GeneralJournalAdapter.getInitialState<GeneralJournalSchema>({
    ids: [],
    entities: {},
    isLoading: false,
  }),
  reducers: {
  },

  extraReducers: (builder) => builder
    .addCase(fetchGeneralJournalList.pending, (state, action) => {
      state.isLoading = true;
    })
    .addCase(fetchGeneralJournalList.fulfilled, (state, action) => {
      state.isLoading = false;
      GeneralJournalAdapter.setAll(state, action.payload);
    })
    .addCase(fetchGeneralJournalList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: generalJournalActions } = generalJournalSlice;
export const { reducer: generalJournalReducer } = generalJournalSlice;
