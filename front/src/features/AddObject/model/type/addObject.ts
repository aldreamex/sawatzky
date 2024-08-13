export interface FormData {
    name?: string;
    code?: string;
    contractNumber?: string;
    address?: string;
    workObjectGroup?: number;
}

export interface AddWorkObjectFormSchema {
    formData: FormData;
    groupId?: number;
    isOpen?: boolean;
    error?: string;
    isLoading?: boolean;
    isEdit?: boolean;
    workObjectId?: number;
}

export interface EditWorkObject {
    formData: FormData;
    workObjectId?: number;
}
