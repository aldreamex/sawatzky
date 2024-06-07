import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers';
import { Application } from 'entities/Application';
import { SendCommentData } from '../../type/applicationDetail';
import { fetchApplicationDetail } from '../fetchApplicationDetail/fetchApplicationDetail';

export const sendComment = createAsyncThunk<
    void,
    SendCommentData,
    ThunkConfig<string>
>(
  'applicationDetailPage/sendComment',
  async (data, { extra, rejectWithValue, dispatch }) => {
    try {
      const response = await extra.api.post<Application>(`/api/v1/applications/${data.applicationId}/comments/`, data.formData);
      if (!response.data) {
        throw new Error('Ошибка сохранения комментария!');
      }
      dispatch(fetchApplicationDetail(data.applicationId));
    } catch (e: any) {
      return rejectWithValue(e.response.message);
    }
  },
);
