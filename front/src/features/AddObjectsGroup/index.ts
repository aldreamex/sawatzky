export {
  addWorkObjectGroupFormActions,
  addWorkObjectGroupFormReducer,
} from './model/slice/addWorkObjectGroupSlice';

export { AddObjectsGroupModal } from './ui/AddObjectsGroupModal/AddObjectsGroupModal';

export type { AddWorkObjectGroupFormSchema, EditWorkObjectGroup } from './model/type/addWorkObjectGroup';

export {
  getWorkObjectGroupFormError,
  getWorkObjectGroupFormIsLoading,
  getWorkObjectGroupFormIsOpen,
  getWorkObjectGroupFormName,
  getWorkObjectGroupFormData,
  getWorkObjectGroupFormIsEdit,
  getWorkObjectGroupFormId,
} from './model/selectors/addWorkObjectGroupSelectors';
