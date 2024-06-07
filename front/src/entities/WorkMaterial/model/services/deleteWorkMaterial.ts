import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkMaterialListByGroupId } from 'pages/DirectoryWorkMaterialGroupDetailPage';
import { WorkMaterial } from '../type/workMaterial';

interface InputData {
  materialId: number | string,
  workMaterialGroup: number | string,
}

export const deleteWorkMaterial = createAsyncThunk<
    void,
    InputData,
    ThunkConfig<string>
>(
  'workMaterial/deleteWorkMaterial',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.delete<WorkMaterial>(`/api/v1/work_materials/${data.materialId}`);
      if (response.status !== 204) {
        throw new Error('Ошибка удаления материала');
      }
      dispatch(fetchWorkMaterialListByGroupId(`${data.workMaterialGroup}`));
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
