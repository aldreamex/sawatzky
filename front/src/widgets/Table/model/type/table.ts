import { EntityState } from '@reduxjs/toolkit';
import { ReactElement } from 'react';

export type TableHeaderType = {
    [key: string]: string | ReactElement;
};

export type TableItemType = Record<keyof TableHeaderType, any>;

export interface TableType {
    header?: TableHeaderType;
    items?: TableItemType[] | ReactElement[];
    selectedItems?: TableItemType[];
    selectedAll?: boolean;
}

export enum TableItemsMod {
    LINK = 'link',
    NORMAL = 'normal',
    NO_CONTROL = 'noControl',
    CLICK = 'click',
    RESET = 'reset'
}

export interface TableSchema extends EntityState<TableType> {

    tables?: TableType;

    isLoading?: boolean;
    error?: string;
    _init?: boolean;
}
