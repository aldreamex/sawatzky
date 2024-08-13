export interface addWorkTaskGroupFormData {
    name: string;
}

export interface AddWorkTaskGroupFormSchema {
    formData: addWorkTaskGroupFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    workTaskGroupId?: number;
}

export interface EditWorkTaksGroup {
    formData: addWorkTaskGroupFormData;
    workTaskGroupId?: number;
}
