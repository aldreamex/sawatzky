export interface CreateGeneralJournalSchema {
    formData: CreateGeneralJournalFormData;
    isLoading?: boolean;
    error?: string;
    isOpen?: boolean;
    isEdit?: boolean;
    isView?: boolean;
    calendarIsOpen: boolean,
}

export interface CreateGeneralJournalFormData {
    paymentDocumentNumber: string;
    legalEntity?: number;
    receiptDate: string;
    totalAmount: string;
        startWorkDate: string;
    endWorkDate: string;

}

export interface EditGeneralJournalFormData {
    paymentDocumentNumber: string;
    legalEntity?: number;
    receiptDate: string;
    totalAmount: string;

}
