import { EmployeeRole } from 'entities/Employee';

export interface UserFormData {
    fio: string;
    phoneNumber: string;
    username?: string;
    password?: string;
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
}

export interface EditGeneralJournalSchema {
    formData: CreateGeneralJournalFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    isView?: boolean;
    employeeId?: number;
    isCalendarOpen?: boolean;
    startWorkDate?: string;
    endWorkDate?: string;
    info?: any
    selectOptions?: any
    selectedApplications?: any[]
    fullSelectedApplications: any[]
}

export interface CreateGeneralJournalFormData {
    paymentDocumentNumber: string;
    // legalEntity?: LegalEntity;
    legalEntity?: number;
    receiptDate: string;
    totalAmount: string;

}
interface Application {
    id: number | string;
    totalPayment: number | string;
}

export interface addApplicationToGeneralJournalFormData {
    generalJounalId: number | string;
    application: Application[]
}
