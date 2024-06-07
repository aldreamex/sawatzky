import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Report } from 'entities/Report';
import { ReportDetailSchema } from '../type/reportDetail';
import { fetchReport } from '../services/fetchReport';

// const reportDetailAdapter = createEntityAdapter<Application>({
//   selectId: (report) => report.id,
// });

// export const getReportDetailApplications = reportDetailAdapter.getSelectors<StateSchema>(
//   (state) => state.reportDetail || reportDetailAdapter.getInitialState(),
// );

const initialState: ReportDetailSchema = {
  isLoading: false,
  error: undefined,
  isInit: false,
  isOpen: false,
  report: {},
};

export const reportDetailSlice = createSlice({
  name: 'reportDetail',
  initialState,
  reducers: {
    setIsInit(state) {
      state.isInit = true;
    },
    open(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.report.id = +action.payload;
    },
    close(state) {
      state.isOpen = false;
      state.report = {};
      state.isInit = false;
    },
  },
  extraReducers: (builder) => builder
    .addCase(fetchReport.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(fetchReport.fulfilled, (state, action: PayloadAction<Report>) => {
      state.isLoading = false;
      state.report = action.payload;
    })
    .addCase(fetchReport.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: reportDetailActions } = reportDetailSlice;
export const { reducer: reportDetailReducer } = reportDetailSlice;
