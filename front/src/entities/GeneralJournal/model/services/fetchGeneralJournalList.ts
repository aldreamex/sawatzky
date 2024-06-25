import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { AxiosRequestConfig } from 'axios';
import { userActions } from 'entities/User';
import { GeneralJournal } from '../type/generalJournal';

export const fetchGeneralJournalList = createAsyncThunk<
    GeneralJournal[],
    AxiosRequestConfig<any> | undefined,
    ThunkConfig<string>
>(
  'GeneralJournam/fetchGeneralJournalList',
  async (params, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.get<GeneralJournal[]>('/api/v1/general_journal/', params);
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
