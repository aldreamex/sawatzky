export interface AddWorkMaterialFormData {
    workMaterialGroup?: number;
    name?: string;
    price?: number;
    count?: number;
    status?: boolean;
}

export interface AddWorkMaterialFormSchema {
    formData: AddWorkMaterialFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    workMaterialId?: number;
}

export interface EditWorkMaterialForm {
    formData: AddWorkMaterialFormData;
    workMaterialId?: number;
}
