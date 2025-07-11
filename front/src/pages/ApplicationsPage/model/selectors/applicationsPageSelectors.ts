import { createSelector } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers';

export const getAllIsChecked = (state: StateSchema) => state.applicationsPage?.allIsChecked;
export const getCheckedItems = (state: StateSchema) => state.applicationsPage?.checkedItems;
export const getModalIsOpen = (state: StateSchema) => state.applicationsPage?.modalIsOpen;
export const getPageInit = (state: StateSchema) => state.applicationsPage?._init;
export const getApplicationIsLoading = (state: StateSchema) => state.applicationsPage?.isLoading;
export const getApplicationWorkObject = (state: StateSchema) => state.applicationsPage?.workObject;
export const getShowFinishedApplications = (state: StateSchema) => state.applicationsPage?.showFinishedApplicaitons;

export const getApplicationPageStartWorkDate = (state: StateSchema) => state.applicationsPage?.startWorkDate ?? '';
export const getApplicationPageEndWorkDate = (state: StateSchema) => state.applicationsPage?.endWorkDate ?? '';
export const getApplicationStatus = (state: StateSchema) => state.applicationsPage?.status ?? '';
export const getApplicationIsCalendarOpen = (state: StateSchema) => state.applicationsPage?.isCalendarOpen;
export const getApplicationPageCreator = (state: StateSchema) => state.applicationsPage?.creator;
export const getApplicationPageSort = (state: StateSchema) => state.applicationsPage?.sort;

export const getRowItemIsChecked = (id: string) => createSelector(
  [getCheckedItems],
  (checkedItems) => (checkedItems ? checkedItems.includes(id) : false),
);
