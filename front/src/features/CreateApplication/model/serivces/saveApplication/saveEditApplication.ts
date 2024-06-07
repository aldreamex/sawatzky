import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { ApplicationStatus } from 'entities/Application';
import { USER_LOCALSTORAGE_DATA } from 'shared/const/localStorage';
import { userActions } from 'entities/User';
import { fetchApplicationsList, applicationsPageActions } from 'pages/ApplicationsPage';
import { createApplicationActions } from '../../slice/createApplicationSlice';
import { CreateApplicationData, EditApplicationData } from '../../type/createApplication';

export const saveEditApplication = createAsyncThunk<
CreateApplicationData,
    EditApplicationData,
    ThunkConfig<string>
>(
  'createApplication/saveEditApplication',
  async (data, { extra, rejectWithValue, dispatch }) => {
    const creatorId = localStorage.getItem(USER_LOCALSTORAGE_DATA);

    if (!creatorId) {
      throw new Error('Ошибка аунтификации пользователя!');
    }

    const applicationData: CreateApplicationData = {
      title: data.formData.title ?? '',
      description: data.formData.description ?? '',
      startWorkDate: data.formData.startWorkDate ?? '',
      endWorkDate: data.formData.endWorkDate ?? '',
      status: ApplicationStatus.NEW,
      creator: JSON.parse(creatorId).employee.id,
      subject: data.formData.subject ?? '',
    };

    try {
      const response = await extra.api.patch<CreateApplicationData>(`/api/v1/applications/update/${data.applicationId}/`, applicationData);
      if (!response.data) {
        throw new Error('Ошибка сохранения запроса!');
      }

      dispatch(createApplicationActions.clearForm());
      dispatch(applicationsPageActions.closeModal());
      dispatch(fetchApplicationsList());
      return response.data;
    } catch (e: any) {
      if (e.response.status === 401) {
        dispatch(userActions.logout());
      }
      return rejectWithValue(e.response.data);
    }
  },
);
