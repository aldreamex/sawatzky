import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchLegalEntityList } from 'entities/LegalEntity';
import { CreateLegalEntityFormData, EditLegalEntityFormData } from '../type/createLegalEntity';
import { createLegalEntityActions } from '../slice/createLegalEntitySlice';

export const editLegalEntity = createAsyncThunk<
    void,
    EditLegalEntityFormData,
    ThunkConfig<string>
>(
  'createLegalEntity/editLegalEntity',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<CreateLegalEntityFormData>(`/api/v1/entities/update/${data.legalEntityId}/`, data.formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(createLegalEntityActions.closeModal());
      dispatch(fetchLegalEntityList(data.formData?.sawatzky));
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
