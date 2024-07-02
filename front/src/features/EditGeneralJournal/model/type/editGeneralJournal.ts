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

export interface EditGeneralJournalSchema {
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    isView?: boolean;
    info?: any
    selectOptions?: any
    selectedApplications?: any[]
    fullSelectedApplications: any[]
}

interface Application {
    id: number | string;
    totalPayment: number | string;
}

export interface addApplicationToGeneralJournalFormData {
    generalJounalId: number | string;
    application: Application[]
}
