import { EntityState } from '@reduxjs/toolkit';
import { Comment } from 'entities/Comment';
import { Document } from 'entities/Document';
import { Employee } from 'entities/Employee';
import { History } from 'entities/History';
import { ApplicationPerformer } from 'entities/Performer';
import { WorkMaterial } from 'entities/WorkMaterial';
import { WorkTask } from 'entities/WorkTask';

export enum ApplicationStatus {
    NEW = 'new',
    PROCESSED = 'processed',
    COORDINATION = 'coordination',
    PAYMENT_COORDINATION = 'paymentCoordination',
    IN_WORK = 'inWork',
    FINISHED = 'finished',
    WAITING_FINISH = 'waitingFinish'
}

export interface ApplicationWorkTask {
    workTask: WorkTask;
    actualTime: number;
}

export interface ApplicationWorkMaterial {
    workMaterial: WorkMaterial;
    actualCount: number;
}

export interface Application {
    id: string;
    title: string;
    subject: string;
    description: string;
    status: ApplicationStatus;
    step: number;
    creator?: Employee;
    performers?: ApplicationPerformer[];
    workTasks?: ApplicationWorkTask[];
    workMaterials?: ApplicationWorkMaterial[];
    documents?: Document[];
    other?: Document[];
    paymentSlips: Document[];
    acts: Document[];
    confirmations?: Document[];
    comments?: Comment[];
    sawatzkyComments?: Comment[];
    logs: History[];

    prepayment: boolean;

    createdAt: string;
    updatedAt?: string;
    startWorkDate?: string;
    endWorkDate?: string;
}

export interface ApplicationSchema extends EntityState<Application> {
    isLoading: boolean;
    error?: string;
}

export const ApplicationStatusMessage = {
  [ApplicationStatus.NEW]: 'Запрос создан',
  [ApplicationStatus.COORDINATION]: 'На согласовании у заказчика',
  [ApplicationStatus.PAYMENT_COORDINATION]: 'Ожидается оплата',
  [ApplicationStatus.IN_WORK]: 'Отправлено исполнителю',
  [ApplicationStatus.PROCESSED]: 'Обрабатывается',
  [ApplicationStatus.WAITING_FINISH]: 'Ожидает подтверждения завершения',
  [ApplicationStatus.FINISHED]: 'Запрос выполнен',
};
