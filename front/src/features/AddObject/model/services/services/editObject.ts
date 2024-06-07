import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkObjectGroupList } from 'entities/WorkObjectGroup';
import { EditWorkObject } from '../../type/addObject';
import { addWorkObjectFormActions } from '../../slice/addObjectSlice';

export const editWorkObject = createAsyncThunk<
  void,
  EditWorkObject,
  ThunkConfig<string>
>(
  'addWorkObject/editWorkObject',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkObject>(`/api/v1/work_objects/update/${data.workObjectId}/`, data.formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkObjectGroupList());
      dispatch(addWorkObjectFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
