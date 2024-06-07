import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { Statistic } from '../type/statistics';

export const fetchStatistic = createAsyncThunk<
  Statistic[],
  string,
  ThunkConfig<string>
>(
  'Statistic/fetchStatistic',
  async (id, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.get<Statistic[]>(`/api/v1/applications/legal_entity/${id}`);
      if (!response.data) {
        throw new Error('Ошибка получения списка');
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
