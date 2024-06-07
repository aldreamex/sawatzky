import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkTaskGroupList } from 'entities/WorkTaskGroup';
import { EditWorkTaksGroup } from '../type/addWorkTaskGroup';
import { addWorkTaskGroupFormActions } from '../slice/addWorkTaskGroupFormSlice';

export const editWorkTaskGroup = createAsyncThunk<
  void,
  EditWorkTaksGroup,
  ThunkConfig<string>
>(
  'addWorkTaskGroup/EditWorkTaksGroup',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkTaksGroup>(`/api/v1/work_task_groups/update/${data.workTaskGroupId}/`, data.formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkTaskGroupList());
      dispatch(addWorkTaskGroupFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
