import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { userActions } from 'entities/User';
import { fetchEmployeeList } from 'entities/Employee';
import { EditEmployeeFormData } from '../type/createEmployee';
import { createEmployeeActions } from '../slice/createEmployeeSlice';

export const editEmployee = createAsyncThunk<
    void,
    EditEmployeeFormData,
    ThunkConfig<string>
>(
  'createEmployee/editEmployee',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.patch<EditEmployeeFormData>(`/api/v1/employee/update/${formData.employeeId}/`, formData);
      if (!response.data) {
        throw new Error('Ошибка создания группы услуг');
      }
      dispatch(fetchEmployeeList());
      dispatch(createEmployeeActions.closeModal());
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.message);
    }
  },
);
