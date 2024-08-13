import { EmployeeRole } from 'entities/Employee';

export interface UserFormData {
    fio: string;
    phoneNumber: string;
    username?: string;
    password?: string;
}

export interface ChangePasswordData {
    new_password: string;
    old_password: string;
}

export interface CreateSawatzkyEmployeeFormData {
    user: UserFormData;
    workObjectGroup?: number;
    workObject?: number;
    position?: string;
    role?: string;
    status?: boolean;
    workingObjects?: number[];
}

export interface CreateEmployeeFormData {
    user: UserFormData;
    legalEntity?: number;
    role?: string;
    status?: boolean;
}

export interface EditEmployeeFormData {
    user: Pick<UserFormData, 'fio' | 'phoneNumber'>
    legalEntity?: number;
    role?: string;
    status?: boolean;
    employeeId: number;
    changePasswordData?: ChangePasswordData;
}

export interface EditSawatzkyEmployeeFormData {
    user: Pick<UserFormData, 'fio' | 'phoneNumber'>
    workObjectGroup?: number;
    workObject?: number;
    position?: string;
    role?: string;
    status?: boolean;
    workingObjects?: number[];
    employeeId: number;
    changePasswordData?: ChangePasswordData;
}

export interface CreateEmployeeSchema {
    sawatzkyFormData: CreateSawatzkyEmployeeFormData;
    formData: CreateEmployeeFormData;
    user: UserFormData;
    changePasswordData: ChangePasswordData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    isView?: boolean;
    employeeId?: number;
}

export interface EmployeeRoleOption {
    value: EmployeeRole;
    text: string;
}
