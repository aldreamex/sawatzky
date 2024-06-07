import { EntityState } from '@reduxjs/toolkit';
import { EmployeeRole } from 'entities/Employee';

export interface DirectoryLinkType {
    path: string;
    text: string;
    sawatzkyOnly: boolean;
    permittedRoles?: EmployeeRole[];
}

export interface DirectoryNavigaionSchema extends EntityState<DirectoryLinkType> {

    isLoading?: boolean;
    error?: string;
}
