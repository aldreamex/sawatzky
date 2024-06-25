import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';

export const deleteGeneralJournal = createAsyncThunk<
    void,
    number | string,
    ThunkConfig<string>
>(
  'generalJournal/delete',
  async (id, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.delete<Document>(`/api/v1/general_journal/${id}`);
      if (response.status !== 204) {
        throw new Error('Ошибка удаления платежного документа');
      }
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
