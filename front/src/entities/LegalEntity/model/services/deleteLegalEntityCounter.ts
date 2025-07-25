import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { deleteLegalEntity } from './deleteLegalEntity';
import { fetchLegalEntityList } from './fetchLegalEntityList';

export const deleteLegalEntityCounter = createAsyncThunk<
  void,
  number | string,
  ThunkConfig<string>
>(
  'legalEntity/deleteLegalEntityCounter',
  async (userId, { extra, rejectWithValue, dispatch }) => {
    try {
      dispatch(deleteLegalEntity(userId))
        .then(() => dispatch(fetchLegalEntityList()))
        .catch(() => {
          throw new Error('Ошибка удаления юрлица');
        });
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
