import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { addWorkMaterialFormActions } from 'features/AddWorkMaterial';
import { fetchWorkMaterialListByGroupId } from 'pages/DirectoryWorkMaterialGroupDetailPage';
import { EditWorkMaterialForm } from '../type/addWorkMaterial';

export const editWorkMaterial = createAsyncThunk<
  void,
  EditWorkMaterialForm,
  ThunkConfig<string>
>(
  'addWorkMaterial/editWorkMaterial',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkMaterialForm>(`/api/v1/work_materials/update/${formData.workMaterialId}/`, formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkMaterialListByGroupId(`${formData.formData.workMaterialGroup}`));
      dispatch(addWorkMaterialFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
