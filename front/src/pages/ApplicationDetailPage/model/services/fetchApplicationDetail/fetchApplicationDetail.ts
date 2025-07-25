import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { Application } from 'entities/Application';
import { applicationDetailActions } from '../../slice/applicationDetailSlice';

export const fetchApplicationDetail = createAsyncThunk<
    Application,
    string,
    ThunkConfig<string>
>(
  'applicationDetailPage/fetchApplicationDetail',
  async (applicationId, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.get<Application>(`/api/v1/applications/${applicationId}`);
      if (!response.data) {
        throw new Error('Ошибка сохранения запроса!');
      }
      dispatch(applicationDetailActions.setIsInit());
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.response.message);
    }
  },
);
