import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { ReportItem } from '../type/report';

export const fetchReportList = createAsyncThunk<
  ReportItem[],
  void,
  ThunkConfig<string>
>(
  'report/fetchReportList',
  async (_, { extra, rejectWithValue, dispatch }) => {
    try {
      // вставить API
      const response = await extra.api.get<ReportItem[]>('/api/v1/reports/');
      if (!response.data) {
        throw new Error('Ошибка получения списка отчётов');
      }
      return response.data;
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
