import { createSelector } from '@reduxjs/toolkit';
import { ApplicationInfo } from '../type/applicationDetail';
import { getApplicationDetail } from '../slice/applicationDetailSlice';
import { getApplicationCreator } from './getApplicationDetailCreator';

export const getApplicationDetailInfo = createSelector(
  getApplicationDetail.selectById,
  (application): ApplicationInfo | undefined => {
    const prepayment = application?.creator?.legalEntity.prepayment;
    const data: any = application && {
      id: application?.id,
      title: application?.title,
      subject: application?.subject,
      description: application?.description,
      status: application?.status,
      creator: application?.creator,
      createdAt: application?.createdAt,
      startWorkDate: application?.startWorkDate,
      endWorkDate: application?.endWorkDate,
      step: application?.step,
      logs: application?.logs,
      prepayment,
    };
    return data;
  },
);

export const getApplicationStep = createSelector(getApplicationDetail.selectById, (application) => application?.step);
export const getApplicationStatus = createSelector(getApplicationDetail.selectById, (application) => application?.status);
export const getApplicationComments = createSelector(getApplicationDetail.selectById, (application) => application?.comments);
export const getApplicationSawatzkyComments = createSelector(getApplicationDetail.selectById, (application) => application?.sawatzkyComments);
export const getApplicationLogs = createSelector(getApplicationDetail.selectById, (application) => application?.logs);
export const getApplicationPrepayment = createSelector(getApplicationCreator, (creator) => creator?.legalEntity.prepayment);
