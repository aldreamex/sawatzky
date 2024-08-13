import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers';
import { ReportItem, ReportsSchema } from '../type/report';
import { fetchReportList } from '../services/fetchReportList';

export const reportAdapter = createEntityAdapter<ReportItem>({
  selectId: (report) => report.id,
});

export const getReport = reportAdapter.getSelectors<StateSchema>(
  (state) => state.report || reportAdapter.getInitialState(),
);

export const reportsSlice = createSlice({
  name: 'reports',
  initialState: reportAdapter.getInitialState<ReportsSchema>({
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
  }),
  reducers: {
    setReportsList: (state, action: PayloadAction<ReportItem[]>) => {
      reportAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => builder
    .addCase(fetchReportList.pending, (state) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(fetchReportList.fulfilled, (state, action: PayloadAction<ReportItem[]>) => {
      state.isLoading = false;
      reportAdapter.setAll(state, action.payload);
    })
    .addCase(fetchReportList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: reportsActions } = reportsSlice;
export const { reducer: reportsReducer } = reportsSlice;
