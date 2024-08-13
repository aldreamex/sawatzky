import { EntityState } from '@reduxjs/toolkit';
import { WorkObject } from 'entities/WorkObject';

export interface WorkObjectGroup {
    find(arg0: (item: any) => boolean): unknown;
    id: number;
    workObjects?: WorkObject[];
    name: string;
    code: string;
}

export interface WorkObjectGroupSchema extends EntityState<WorkObjectGroup> {

    error?: string;
    isLoading?: boolean;
}
