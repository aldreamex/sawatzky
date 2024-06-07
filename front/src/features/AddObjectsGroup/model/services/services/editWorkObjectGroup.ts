import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkObjectGroupList } from 'entities/WorkObjectGroup';
import { EditWorkObjectGroup } from '../../type/addWorkObjectGroup';
import { addWorkObjectGroupFormActions } from '../../slice/addWorkObjectGroupSlice';

export const editWorkObjectGroup = createAsyncThunk<
  void,
  EditWorkObjectGroup,
  ThunkConfig<string>
>(
  'addWorkObjectGroup/editWorkObjectGroup',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkObjectGroup>(`/api/v1/work_objects_groups/update/${data.workObjectGroupId}/`, data.formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkObjectGroupList());
      dispatch(addWorkObjectGroupFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
