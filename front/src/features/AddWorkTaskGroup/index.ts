export { AddWorkTaskGroupModal } from './ui/AddWorkTaskGroupModal/AddWorkTaskGroupModal';

export {
  addWorkTaskGroupFormActions,
  addWorkTaskGroupFormReducer,
} from './model/slice/addWorkTaskGroupFormSlice';

export { createWorkTaskGroup } from './model/services/createWorkTaskGroup';
export { editWorkTaskGroup } from './model/services/editWorkTaskGroup';

export type {
  AddWorkTaskGroupFormSchema,
  addWorkTaskGroupFormData,
  EditWorkTaksGroup,
} from './model/type/addWorkTaskGroup';

export {
  getAddWorkTaskGroupFormIsOpen,
  getWorkTaskGroupFormName,
  getWorkTaskGroupFormIsLoading,
  getWorkTaskGroupFormError,
  getWorkTaskGroupFormIsEdit,
  getWorkTaskGroupFormId,
} from './model/selectors/addWorkTaskGroupFormSelectors';
