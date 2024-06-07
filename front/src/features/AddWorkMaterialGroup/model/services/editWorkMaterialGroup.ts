import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchWorkMaterialGroupList } from 'entities/WorkMaterialGroup';
import { addWorkMaterialGroupFormActions } from '../slice/addWorkMaterialGroupFormSlice';
import { EditWorkMaterialGroup } from '../type/addWorkMaterialGroup';

export const editWorkMaterialGroup = createAsyncThunk<
  void,
  EditWorkMaterialGroup,
  ThunkConfig<string>
>(
  'addWorkMaterialGroup/EditWorkMaterialGroup',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditWorkMaterialGroup>(`/api/v1/work_material_groups/update/${formData.workMaterialId}/`, formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchWorkMaterialGroupList());
      dispatch(addWorkMaterialGroupFormActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
