import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchSawatzkyEmployeeList } from 'entities/SawatzkyEmployee';
import { EditSawatzkyEmployeeFormData } from '../type/createEmployee';
import { createEmployeeActions } from '../slice/createEmployeeSlice';

export const editSawatzkyEmployee = createAsyncThunk<
    void,
    EditSawatzkyEmployeeFormData,
    ThunkConfig<string>
>(
  'createEmployee/editSawatzkyEmployee',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditSawatzkyEmployeeFormData>(`/api/v1/sawatzky_employee/update/${formData.employeeId}/`, formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchSawatzkyEmployeeList());
      dispatch(createEmployeeActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
