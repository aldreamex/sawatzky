import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchGeneralJournalList } from 'entities/GeneralJournal/model/services/fetchGeneralJournalList';
import { CreateGeneralJournalFormData } from '../type/editGeneralJournal';
import { createGeneralJournalActions } from '../slice/editGeneralJournalSlice';

export const createGeneralJournal = createAsyncThunk<
    void,
    CreateGeneralJournalFormData,
    ThunkConfig<string>
>(
  'createGeneralJournal/createGeneralJournal',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.post<CreateGeneralJournalFormData>('/api/v1/general_journal/create/', formData);
      if (!response.data) {
        throw new Error('Ошибка создания платежного документы');
      }
      dispatch(fetchGeneralJournalList());
      dispatch(createGeneralJournalActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
