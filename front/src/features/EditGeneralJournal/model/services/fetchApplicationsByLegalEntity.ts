import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { Application } from 'entities/Application';
import { userActions } from 'entities/User';

export const fetchApplicationsByLegalEntity = createAsyncThunk<
    Application[],
    string,
    ThunkConfig<string>
>(
  'GeneralJournam/fetchApplications',
  async (id, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.get<Application[]>(`/api/v1/general_journal/applications_by_legal_entity/${id}`);
      if (!response.data) {
        throw new Error('Ошибка получения списка групп журналов');
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
