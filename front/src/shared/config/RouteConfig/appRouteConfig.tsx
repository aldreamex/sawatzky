import { EmployeeRole } from 'entities/Employee';
import { ApplicationDetailPage } from 'pages/ApplicationDetailPage';
import { ApplicationsPage } from 'pages/ApplicationsPage';
import { AuthorizationPage } from 'pages/AuthorizaionPage';
import { DirectoryEmployeePage } from 'pages/DirectoryEmployeePage';
import { DirectoryEmployeeSawatzkyPage } from 'pages/DirectoryEmployeeSawatzkyPage';
import { GeneralJournalPage } from 'pages/GeneralJournalPage';
import { DirectoryLegalEntityPage } from 'pages/DirectoryLegalEntityPage';
import { DirectoryLegalEntitySawatzkyPage } from 'pages/DirectoryLegalEntitySawatzkyPage';
import { DirectoryObjectPage } from 'pages/DirectoryObjectPage';
import { DirectoryObjectTreePage } from 'pages/DirectoryObjectTreePage';
import { DirectoryObjectsGroupPage } from 'pages/DirectoryObjectsGroupPage';
import { DirectoryWorkMaterialGroupDetailPage } from 'pages/DirectoryWorkMaterialGroupDetailPage';
import { DirectoryWorkMaterialGroupPage } from 'pages/DirectoryWorkMaterialGroupPage';
import { DirectoryWorkTaskGroupDetailPage } from 'pages/DirectoryWorkTaskGroupDetailPage';
import { DirectoryWorkTaskGroupPage } from 'pages/DirectoryWorkTaskGroupPage';
import { ForbiddenPage } from 'pages/ForbiddenPage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ReportsPage } from 'pages/ReportsPage';
import { StatisticPage } from 'pages/StatisticPage';
import { Navigate, RouteProps } from 'react-router-dom';

export type AppRouteProps = RouteProps & {
  authOnly?: boolean;
  sawatzkyOnly?: boolean;
  permittedRoles?: EmployeeRole[];
}

// global routing

export enum AppRoutes {
  APPLICATIONS = 'applications',
  Application_DETAIL = 'application_detail',
  REPORTS = 'reports',
  STATISTIC = 'statistic',
  AUTHORIZATION = 'authorization',
  HOME = 'home',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  GENERAL_JOURNAL = 'general_journal'
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.APPLICATIONS]: '/application',
  [AppRoutes.AUTHORIZATION]: '/login',
  [AppRoutes.Application_DETAIL]: '/application/',
  [AppRoutes.REPORTS]: '/report',
  [AppRoutes.STATISTIC]: '/statistic/',
  [AppRoutes.HOME]: '/',

  [AppRoutes.GENERAL_JOURNAL]: '/general_journal',

  [AppRoutes.FORBIDDEN]: '/forbidden',
  [AppRoutes.NOT_FOUND]: '/*',
};
//-----------------------------------------------------------------------------------

// Directory routing
export enum DirectoryRoutes {
  OBJECTS = 'objects',
  OBJECT = 'object',
  OBJECT_TREE = 'object_tree',
  LEGAL_ENTITY = 'legal_entity',
  LEGAL_ENTITY_SAWATZKY = 'legal_entity_sawatzky',
  WORK_TASK_GROUP_DETAIL = 'work_task_group_detail',
  WORK_MATERIAL_GROUP_DETAIL = 'work_material_group_detail',
  WORK_TASK_GROUP = 'work_task_group',
  WORK_MATERIAL_GROUP = 'work_material_group',
  EMPLOYEE = 'employee',
  EMPLOYEE_SAWATZKY = 'employee_sawatzky',
  // GENERAL_JOURNAL = 'general_journal'
}

export const DirectoryPath: Record<DirectoryRoutes, string> = {
  [DirectoryRoutes.OBJECTS]: '/directory/objects',
  [DirectoryRoutes.OBJECT]: '/directory/objects/',
  [DirectoryRoutes.OBJECT_TREE]: '/directory/objects-tree',
  [DirectoryRoutes.LEGAL_ENTITY]: '/directory/legal-entity',
  [DirectoryRoutes.LEGAL_ENTITY_SAWATZKY]: '/directory/legal-entity-sawatzky',
  [DirectoryRoutes.WORK_TASK_GROUP]: '/directory/work-task-group',
  [DirectoryRoutes.WORK_MATERIAL_GROUP]: '/directory/work-material-group',
  [DirectoryRoutes.WORK_TASK_GROUP_DETAIL]: '/directory/work-task-group/',
  [DirectoryRoutes.WORK_MATERIAL_GROUP_DETAIL]: '/directory/work-material-group/',
  [DirectoryRoutes.EMPLOYEE]: '/directory/employee',
  [DirectoryRoutes.EMPLOYEE_SAWATZKY]: '/directory/employee-sawatzky',
  // [DirectoryRoutes.GENERAL_JOURNAL]: '/directory/general_journal',

};

//------------------------------------------------------------------------------------

// Routing config

export const routeConfig: Record<AppRoutes | DirectoryRoutes, AppRouteProps> = {
  [AppRoutes.APPLICATIONS]: {
    path: RoutePath.applications,
    element: <ApplicationsPage />,
    authOnly: true,
    sawatzkyOnly: false,
  },
  [AppRoutes.Application_DETAIL]: {
    path: `${RoutePath.application_detail}:id`,
    element: <ApplicationDetailPage />,
    authOnly: true,
    sawatzkyOnly: false,
  },

  [AppRoutes.REPORTS]: {
    path: RoutePath.reports,
    element: <ReportsPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],
  },

  [AppRoutes.STATISTIC]: {
    path: `${RoutePath.statistic}:id`,
    element: <StatisticPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],
  },

  // Directory Routes
  [DirectoryRoutes.OBJECTS]: {
    path: DirectoryPath.objects,
    element: <DirectoryObjectsGroupPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.OBJECT]: {
    path: `${DirectoryPath.object}:id`,
    element: <DirectoryObjectPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.OBJECT_TREE]: {
    path: `${DirectoryPath.object_tree}`,
    element: <DirectoryObjectTreePage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.LEGAL_ENTITY]: {
    path: DirectoryPath.legal_entity,
    element: <DirectoryLegalEntityPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.LEGAL_ENTITY_SAWATZKY]: {
    path: DirectoryPath.legal_entity_sawatzky,
    element: <DirectoryLegalEntitySawatzkyPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.WORK_TASK_GROUP]: {
    path: DirectoryPath.work_task_group,
    element: <DirectoryWorkTaskGroupPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.WORK_MATERIAL_GROUP]: {
    path: DirectoryPath.work_material_group,
    element: <DirectoryWorkMaterialGroupPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.WORK_TASK_GROUP_DETAIL]: {
    path: `${DirectoryPath.work_task_group_detail}:id`,
    element: <DirectoryWorkTaskGroupDetailPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.WORK_MATERIAL_GROUP_DETAIL]: {
    path: `${DirectoryPath.work_material_group_detail}:id`,
    element: <DirectoryWorkMaterialGroupDetailPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN],
  },
  [DirectoryRoutes.EMPLOYEE]: {
    path: `${DirectoryPath.employee}`,
    element: <DirectoryEmployeePage />,
    authOnly: true,
    sawatzkyOnly: false,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER, EmployeeRole.INITIATOR],
  },
  [DirectoryRoutes.EMPLOYEE_SAWATZKY]: {
    path: `${DirectoryPath.employee_sawatzky}`,
    element: <DirectoryEmployeeSawatzkyPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],
  },
  // General journal
  [AppRoutes.GENERAL_JOURNAL]: {
    path: `${RoutePath.general_journal}`,
    element: <GeneralJournalPage />,
    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],
  },

  // No Private pages

  [AppRoutes.AUTHORIZATION]: {
    path: RoutePath.authorization,
    element: <AuthorizationPage />,
    authOnly: false,
    sawatzkyOnly: false,

  },
  [AppRoutes.FORBIDDEN]: {
    path: RoutePath.forbidden,
    element: <ForbiddenPage />,
    authOnly: false,
    sawatzkyOnly: false,
  },
  [AppRoutes.HOME]: {
    path: RoutePath.home,
    element: <Navigate
      to={RoutePath.applications}
      replace // <-- redirect
    />,
    authOnly: false,
    sawatzkyOnly: false,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath.not_found,
    element: <NotFoundPage />,
    authOnly: false,
    sawatzkyOnly: false,
  },
};
