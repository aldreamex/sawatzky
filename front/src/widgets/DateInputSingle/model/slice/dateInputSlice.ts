import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DateInputSchema } from '../type/dateInput';

const initialState: DateInputSchema = {
  date: '',
};

export const dateInputSlice = createSlice({
  name: 'dateInput',
  initialState,
  reducers: {
    setDateFrom: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
  },
});

export const { actions: dateInputActions } = dateInputSlice;
export const { reducer: dateInputReducer } = dateInputSlice;
