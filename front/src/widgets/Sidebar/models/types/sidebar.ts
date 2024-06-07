import { DirectoryPath, RoutePath } from 'shared/config/RouteConfig/appRouteConfig';
import { ReactComponent as InfoIcon } from 'shared/assets/icons/info-icon.svg';
import { ReactComponent as ApplicationIcon } from 'shared/assets/icons/application-icon.svg';
import { ReactComponent as ReportIcon } from 'shared/assets/icons/report-icon.svg';
import { ReactComponent as DirectoryIcon } from 'shared/assets/icons/directory-icon.svg';
import { ReactComponent as ArchiveIcon } from 'shared/assets/icons/archive-icon.svg';
import { ReactComponent as DocIcon } from 'shared/assets/icons/doc-icon.svg';
import { EmployeeRole } from 'entities/Employee';

export interface SidebarItemType {
    path: string;
    text: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    authOnly?: boolean;
    sawatzkyOnly?: boolean;
    isHidden?: boolean;
    permittedRoles?: EmployeeRole[];
}

export interface AlertType {
    id: string,
    name: string,
}

export const SidebarItemsList: SidebarItemType[] = [

  {
    path: '/info',
    text: 'Информация',
    Icon: InfoIcon,

    isHidden: true,
    authOnly: true,
    sawatzkyOnly: false,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],
  },
  {
    path: RoutePath.applications,
    text: 'Запросы',
    Icon: ApplicationIcon,

    authOnly: true,
    sawatzkyOnly: false,
    permittedRoles: [],
  },
  {
    path: '/report',
    text: 'Отчеты',
    Icon: ReportIcon,

    authOnly: true,
    sawatzkyOnly: true,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],

  },
  {
    path: DirectoryPath.employee,
    text: 'Справочники',
    Icon: DirectoryIcon,

    authOnly: true,
    sawatzkyOnly: false,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER, EmployeeRole.INITIATOR],

  },
  {
    path: '/archive',
    text: 'Архив',
    Icon: ArchiveIcon,

    isHidden: true,
    authOnly: true,
    sawatzkyOnly: false,
    permittedRoles: [EmployeeRole.ADMIN, EmployeeRole.DISPATCHER, EmployeeRole.DISPATCHER_PERFORMER],

  },
  {
    path: '/documents',
    text: 'Документы',
    Icon: DocIcon,
    authOnly: true,
    isHidden: true,

  },
];
