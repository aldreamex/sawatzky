import { UserSchema } from 'entities/User';
import { LoginSchema } from 'features/AuthByUsername';
import {
  AnyAction, EnhancedStore, Reducer, ReducersMapObject,
} from '@reduxjs/toolkit';
import { CombinedState } from 'redux';
import { ApplicationSchema } from 'entities/Application';
import { AxiosInstance } from 'axios';
import { ApplicationDetailSchema } from 'pages/ApplicationDetailPage';
import { CreateApplicationSchema } from 'features/CreateApplication';
import { ApplicationsPageSchema } from 'pages/ApplicationsPage';
import { DirectoryNavigaionSchema } from 'widgets/DirectoryNavigaion';
import { WorkTaskGroupSchema } from 'entities/WorkTaskGroup';
import { AddWorkTaskGroupFormSchema } from 'features/AddWorkTaskGroup';
import { AddWorkTaskFormSchema } from 'features/AddWorkTask';
import { DirectoryWorkTaskGroupDetailSchema } from 'pages/DirectoryWorkTaskGroupDetailPage';
import { TableSchema } from 'widgets/Table';
import { AddWorkTaskApplicationFormSchema } from 'features/AddWorkTaskToApplication';
import { WorkMaterialGroupSchema } from 'entities/WorkMaterialGroup';
import { AddWorkMaterialGroupFormSchema } from 'features/AddWorkMaterialGroup';
import { AddWorkMaterialFormSchema } from 'features/AddWorkMaterial/model/type/addWorkMaterial';
import { DirectoryWorkMaterialGroupDetailSchema } from 'pages/DirectoryWorkMaterialGroupDetailPage';
import { AddWorkMaterialApplicationFormSchema } from 'features/AddWorkMaterialToApplication';
import { WorkObjectGroupSchema } from 'entities/WorkObjectGroup';
import { AddWorkObjectGroupFormSchema } from 'features/AddObjectsGroup';
import { LegalEntitySchema } from 'entities/LegalEntity';
import { WorkObjectSchema } from 'entities/WorkObject';
import { AddWorkObjectFormSchema } from 'features/AddObject';
import { AddDocumentFormSchema } from 'features/AddDocument';
import { CreateLegalEntitySchema } from 'features/CreateLegalEntity';
import { SawatzkyEmployeeSchema } from 'entities/SawatzkyEmployee';
import { EmployeeSchema } from 'entities/Employee';
import { CreateEmployeeSchema } from 'features/CreateEmployee';
import { PerformerSchema } from 'entities/Performer';
import { AddPerformerToApplicationFormSchema } from 'features/AddPerformerToApplication';
import { AddReportSchema } from 'features/AddReport/model/type/addReport';
import { NotificationsSchema } from 'features/Notifications';
import { ChangePasswordSchema } from 'features/ChangePassword/model/type/changePassword';
import { ReportsPageSchema } from 'pages/ReportsPage';
import { DateInputSchema } from 'widgets/DateInput';
import { ReportsSchema } from 'entities/Report';
import { ReportDetailSchema } from 'features/ReportDetail/model/type/reportDetail';
import { StatisticSchema } from 'entities/Statistic/model/type/statistics';
import { GeneralJournalSchema } from 'entities/GeneralJournal/model/type/generalJournal';
import { CreateGeneralJournalSchema } from 'features/CreateGeneralJournal';
import { EditGeneralJournalSchema } from 'features/EditGeneralJournal';

export interface StateSchema {
    user: UserSchema;
    notifications: NotificationsSchema;
    // Асинхронные редюсеры
    // pages
    applicationDetail?: ApplicationDetailSchema;
    applicationsPage?: ApplicationsPageSchema;
    directoryWorkTaskGroupDetail?: DirectoryWorkTaskGroupDetailSchema;
    directoryWorkMaterialGroupDetail?: DirectoryWorkMaterialGroupDetailSchema;
    reportsPage?: ReportsPageSchema;
    // entities
    application?: ApplicationSchema;
    workTaskGroup?: WorkTaskGroupSchema;
    workMaterialGroup?: WorkMaterialGroupSchema;
    workObjectGroup?: WorkObjectGroupSchema;
    legalEntity?: LegalEntitySchema;
    workObject?: WorkObjectSchema;
    sawatzkyEmployee?: SawatzkyEmployeeSchema;
    employee?: EmployeeSchema;
    performer?: PerformerSchema;
    report?: ReportsSchema;
    statistic?: StatisticSchema;
    generalJournal?: GeneralJournalSchema;
    // widgets
    table?: TableSchema;
    direcotryNavigation?: DirectoryNavigaionSchema;
    dateInput?: DateInputSchema;
    // features
    loginForm?: LoginSchema;
    createApplication?: CreateApplicationSchema;
    addWorkTaskGroupForm?: AddWorkTaskGroupFormSchema;
    addWorkMaterialGroupForm?: AddWorkMaterialGroupFormSchema;
    addWorkObjectGroupForm?: AddWorkObjectGroupFormSchema;
    addWorkTaskForm?: AddWorkTaskFormSchema;
    addWorkObjectForm?: AddWorkObjectFormSchema;
    addWorkMaterialForm?: AddWorkMaterialFormSchema;
    addWorkTaskApplicationForm?: AddWorkTaskApplicationFormSchema;
    addDocumentForm?: AddDocumentFormSchema;
    addWorkMaterialApplicationForm?: AddWorkMaterialApplicationFormSchema;
    createEmployee?: CreateEmployeeSchema;
    createLegalEntityForm?: CreateLegalEntitySchema;
    addPerformerToApplicationForm?: AddPerformerToApplicationFormSchema;
    addReportForm?: AddReportSchema;
    changePasswordForm?: ChangePasswordSchema;
    reportDetail?: ReportDetailSchema;
    createGeneralJournal?: CreateGeneralJournalSchema;
    editGeneralJournal?: EditGeneralJournalSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance;
}

export interface ThunkConfig<T> {
    rejectValue: T;
    extra: ThunkExtraArg;
    state: StateSchema;
}
