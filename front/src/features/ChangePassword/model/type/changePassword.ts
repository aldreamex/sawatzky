export interface ChangePasswordFormData {
  period?: string;
  workObjectsGroup?: number;
  oldPassword?: number;
  newPassword?: number;
  repeatPassword?: number;
}

export interface ChangePasswordSchema {
  formData: ChangePasswordFormData;
  isLoading?: boolean;
  error?: string;
  isOpen?: boolean;
}
