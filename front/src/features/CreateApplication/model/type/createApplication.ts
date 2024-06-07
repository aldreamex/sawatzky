import { ApplicationStatus } from 'entities/Application';

export interface CreateApplicationFormType {
    title?: string;
    description?: string;
    startWorkDate?: string;
    endWorkDate?: string;
    subject?: string;
}

export interface CreateApplicationData {
    title: string;
    subject: string;
    description: string;
    startWorkDate: string;
    endWorkDate: string;
    status: ApplicationStatus;
    creator: number;
}

export interface CreateApplicationSchema {
    data?: CreateApplicationData;
    form: CreateApplicationFormType;
    isLoading: boolean;
    isOpen: boolean;
    isEdit: boolean;
    error?: string;
    calendarIsOpen?: boolean;
    applicationId?: string;
}

export interface EditApplicationData {
    formData: CreateApplicationFormType;
    applicationId: string;
}
