import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DateInputSchema } from '../type/dateInput';

const initialState: DateInputSchema = {
  dateFrom: '',
  dateTo: '',
};

export const dateInputSlice = createSlice({
  name: 'dateInput',
  initialState,
  reducers: {
    setDateFrom: (state, action: PayloadAction<string>) => {
      state.dateFrom = action.payload;
    },
    setDateTo: (state, action: PayloadAction<string>) => {
      state.dateTo = action.payload;
    },
  },
});

export const { actions: dateInputActions } = dateInputSlice;
export const { reducer: dateInputReducer } = dateInputSlice;
