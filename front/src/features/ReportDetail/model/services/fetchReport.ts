import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { Report } from 'entities/Report';
import { userActions } from 'entities/User';

export const fetchReport = createAsyncThunk<
  Report,
  number | string,
  ThunkConfig<string>
>(
  'report/fetchReport',
  async (reportId, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.get<Report>(`/api/v1/reports/${reportId}`);
      if (!response.data) {
        throw new Error('Ошибка получения отчёта');
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
