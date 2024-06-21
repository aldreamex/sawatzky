import { EntityState } from '@reduxjs/toolkit';
import { Application, ApplicationStatus } from 'entities/Application';

export interface ApplicationsPageSchema extends EntityState<Application> {
    isLoading?: boolean;
    error?: string;
    modalIsOpen?: boolean;
    showFinishedApplicaitons?: boolean;

    checkedItems?: string[];
    allIsChecked?: boolean;

    workObject?: number;

    _init: boolean;

    // filter
    startWorkDate?: string;
    endWorkDate?: string;
    status?: ApplicationStatus
    isCalendarOpen: boolean
    creator?: string
}
