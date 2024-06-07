export interface AddWorkTaskFormData {
    workTaskGroup?: number;
    name?: string;
    price?: number;
    time?: any;
    hours?: number;
    minutes?: number;
    status?: boolean;
}

export interface AddWorkTaskFormSchema {
    formData: AddWorkTaskFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    workTaskId?: number;
}

export interface EditWorkTask {
    formData: AddWorkTaskFormData;
    workTaskId?: number;
}
