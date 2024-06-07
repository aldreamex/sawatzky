import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReportsPageSchema } from '../type/reportsPage';

const initialState: ReportsPageSchema = {
  isLoading: false,
  error: undefined,
  isCalendarOpen: false,
};

export const reportsPageSlice = createSlice({
  name: 'reportsPage',
  initialState,
  reducers: {
    setStartWorkDate: (state, action: PayloadAction<string>) => {
      state.startWorkDate = action.payload;
    },
    setEndWorkDate: (state, action: PayloadAction<string>) => {
      state.endWorkDate = action.payload;
    },
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
  },
});

export const { actions: reportsPageActions } = reportsPageSlice;
export const { reducer: reportsPageReducer } = reportsPageSlice;
