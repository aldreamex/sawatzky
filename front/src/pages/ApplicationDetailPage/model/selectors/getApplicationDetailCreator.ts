import { createSelector } from '@reduxjs/toolkit';
import { getApplicationDetail } from '../slice/applicationDetailSlice';

export const getApplicationCreator = createSelector(getApplicationDetail.selectById, (detail) => detail?.creator);
export const getApplicationCreatorWorkTaskGroups = createSelector(getApplicationCreator, (creator) => creator?.legalEntity.workTaskGroups);
export const getApplicationCreatorWorkMaterialGroups = createSelector(getApplicationCreator, (creator) => creator?.legalEntity.workMaterialGroups);
