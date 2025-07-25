import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { ApplicationStatus } from 'entities/Application';
import { USER_LOCALSTORAGE_DATA } from 'shared/const/localStorage';
import { userActions } from 'entities/User';
import { fetchApplicationsList, applicationsPageActions } from 'pages/ApplicationsPage';
import { createApplicationActions } from '../../slice/createApplicationSlice';
import { CreateApplicationData, CreateApplicationFormType } from '../../type/createApplication';

export const saveApplication = createAsyncThunk<
    CreateApplicationData,
    CreateApplicationFormType,
    ThunkConfig<string>
>(
  'createApplication/saveApplication',
  async (formData, { extra, rejectWithValue, dispatch }) => {
    const creatorId = localStorage.getItem(USER_LOCALSTORAGE_DATA);

    if (!creatorId) {
      throw new Error('Ошибка аунтификации пользователя!');
    }

    const creator = formData.client !== undefined ? formData.client : JSON.parse(creatorId).employee.id;

    const applicationData: CreateApplicationData = {
      title: formData.title ?? '',
      description: formData.description ?? '',
      startWorkDate: formData.startWorkDate ?? '',
      endWorkDate: formData.endWorkDate ?? '',
      status: ApplicationStatus.NEW,
      creator,
      subject: formData.subject ?? '',
    };

    try {
      const response = await extra.api.post<CreateApplicationData>('/api/v1/applications/create/', applicationData);
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
