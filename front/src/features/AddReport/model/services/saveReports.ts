import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { USER_LOCALSTORAGE_DATA } from 'shared/const/localStorage';
import { userActions } from 'entities/User';
import { fetchReportList } from 'entities/Report';
import { addReportActions } from '../slice/addReportSlice';
import { AddReportData, AddReportFormType } from '../type/addReport';

export const saveReport = createAsyncThunk<
  AddReportData,
  AddReportFormType,
  ThunkConfig<string>
>(
  'createReport/saveReport',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    const creatorId = localStorage.getItem(USER_LOCALSTORAGE_DATA);
    if (!creatorId) {
      throw new Error('Ошибка аунтификации пользователя!');
    }
    console.log(formData);
    const reportData: AddReportData = {
      periodStart: formData.startWorkDate ?? '',
      periodEnd: formData.endWorkDate ?? '',
      legalEntity: formData.legalEntity ?? '',
      workObject: formData.workObject ?? '',
      workObjectsGroup: formData.workObjectsGroup ?? '',
      application_status: formData.status ?? '',
    };
    try {
      const response = await extra.api.post<AddReportData>('/api/v1/reports/create/', reportData);
      if (!response.data) {
        throw new Error('Ошибка сохранения запроса!');
      }
      dispatch(addReportActions.clearForm());
      dispatch(addReportActions.closeModal());
      dispatch(fetchReportList());

      return response.data;
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.data);
    }
  },
);
