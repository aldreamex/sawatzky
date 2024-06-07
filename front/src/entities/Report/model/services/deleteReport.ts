import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { ReportItem } from '../type/report';
import { fetchReportList } from './fetchReportList';

export const deleteReport = createAsyncThunk<
  void,
  number | string,
  ThunkConfig<string>
>(
  'report/deleteReport',
  async (reportId, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.delete<ReportItem>(`/api/v1/reports/${reportId}`);
      if (response.status !== 204) {
        throw new Error('Ошибка удаления отчёта');
      }
      dispatch(fetchReportList());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
