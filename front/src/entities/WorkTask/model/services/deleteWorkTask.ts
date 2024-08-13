import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkTaskListByGroupId } from 'pages/DirectoryWorkTaskGroupDetailPage';
import { WorkTask } from '../type/workTask';

interface InputData {
  taskId: number | string,
  workTaskGroup: number | string,
}

export const deleteWorkTask = createAsyncThunk<
    void,
    InputData,
    ThunkConfig<string>
>(
  'workTask/deleteWorkTask',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.delete<WorkTask>(`/api/v1/work_tasks/${data.taskId}`);
      if (response.status !== 204) {
        throw new Error('Ошибка удаления услуги');
      }
      dispatch(fetchWorkTaskListByGroupId(`${data.workTaskGroup}`));
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
