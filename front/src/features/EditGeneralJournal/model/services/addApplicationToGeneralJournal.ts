import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { fetchGeneralJournalList } from 'entities/GeneralJournal';
import { userActions } from 'entities/User';
import { createGeneralJournalActions } from '../slice/editGeneralJournalSlice';
import { addApplicationToGeneralJournalFormData } from '../type/editGeneralJournal';

export const addApplicationToGeneralJournal = createAsyncThunk<
    void,
    addApplicationToGeneralJournalFormData,
    ThunkConfig<string>
>(
  'addApplicationToGeneralJournal/addApplicationToGeneralJournal',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      if (!formData.generalJounalId) {
        throw new Error('Не найдено ID запроса');
      }

      const response = await extra.api.patch<any>(
        `/api/v1/general_journal/update_applications/${formData.generalJounalId}/`,
        {
          application: formData.application,
        },
      );
      if (!response.data) {
        throw new Error('Ошибка добавления услуги');
      }

      dispatch(createGeneralJournalActions.closeModal());
      dispatch(fetchGeneralJournalList());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
