import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkTaskListByGroupId } from 'pages/DirectoryWorkTaskGroupDetailPage';
import { EditWorkTask } from '../type/addWorkTask';
import { addWorkTaskFormActions } from '../slice/addWorkTaskFormSlice';

export const editWorkTask = createAsyncThunk<
  void,
  EditWorkTask,
  ThunkConfig<string>
>(
  'addWorkTask/editWorkTask',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkTask>(`/api/v1/work_tasks/update/${formData.workTaskId}/`, formData.formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkTaskListByGroupId(`${formData.formData.workTaskGroup}`));
      dispatch(addWorkTaskFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
