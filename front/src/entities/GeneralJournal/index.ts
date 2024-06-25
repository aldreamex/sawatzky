export type {
  Employee, EmployeeSchema, GeneralJournal, GeneralJournalSchema,
} from './model/type/generalJournal';
export { EmployeeRole, EmployeeRoleValue } from './model/type/generalJournal';

export {
  generalJournalActions,
  generalJournalReducer,
  getEmployee,
} from './model/slice/generalJournalSlice';
export { deleteGeneralJournal } from './model/services/deleteGeneralJournal';
export { fetchGeneralJournalList } from './model/services/fetchGeneralJournalList';
