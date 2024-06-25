import { EntityState } from '@reduxjs/toolkit';
import { LegalEntity } from 'entities/LegalEntity';

export interface Employee {
    id: string;
    paymentDocumentNumber: string;
    legalEntity: number; // LegalEntity;
    receiptDate: string;
    totalAmount: string;
    amountByInvoices: string;
    status: StatusesEnum,

}

export interface GeneralJournal {
    id: string;
    paymentDocumentNumber: string;
    legalEntity: number; // LegalEntity;
    receiptDate: string;
    totalAmount: string;
    amountByInvoices: string;
    status: StatusesEnum,

}
export interface GeneralJournalSchema extends EntityState<GeneralJournal> {
    isLoading?: boolean;
    error?: string
}

export interface EmployeeSchema extends EntityState<Employee> {
    isLoading?: boolean;
    error?: string
}

export enum EmployeeRole {
    DISPATCHER = 'dispatcher',
    PERFORMER = 'performer',
    DISPATCHER_PERFORMER = 'dispatcherPerformer',
    INITIATOR = 'initiator',
    ADMIN = 'admin',
}

export const EmployeeRoleValue: Record<EmployeeRole, string> = {
  [EmployeeRole.DISPATCHER]: 'Диспетчер',
  [EmployeeRole.DISPATCHER_PERFORMER]: 'Диспетчер / Исполнитель',
  [EmployeeRole.PERFORMER]: 'Исполнитель',
  [EmployeeRole.INITIATOR]: 'Инициатор',
  [EmployeeRole.ADMIN]: 'Администратор',
};

export enum StatusesEnum {
    FULLY = 'fully',
    PARTIALLY = 'partially',
    UNPAID = 'unpaid',
}
export const StatusesTranslations: Record<StatusesEnum, string> = {
  [StatusesEnum.FULLY]: 'полностью',
  [StatusesEnum.PARTIALLY]: 'частично',
  [StatusesEnum.UNPAID]: 'неоплаченная',
};
