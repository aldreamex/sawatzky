export interface AddWorkMaterialGroupFormData {
    name: string;
}

export interface AddWorkMaterialGroupFormSchema {
    formData: AddWorkMaterialGroupFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    workMaterialId?: number;
}

export interface EditWorkMaterialGroup {
    formData: AddWorkMaterialGroupFormData;
    workMaterialId?: number;
}
