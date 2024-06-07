import { EntityState } from '@reduxjs/toolkit';
import { Application } from 'entities/Application';
import { LegalEntity } from 'entities/LegalEntity';

export interface Report {
  id: number;
  priority: string;
  description: string;
  status: boolean;
  createdAt: string;
  legalEntityBik: string;
  legalEntityInn: string;
  settlementAccount: string;
  correspondentAccount: string;
  bank: string;
  legalEntity: Pick<LegalEntity, 'name'>;
  foundedApllications: Application[];
}

export interface Creator {
  creator_fio: string;
}

export interface ReportItem {
  name: any;
  id: number;
  periodStart: string;
  periodEnd: string;
  creator: Creator;
}

export interface ReportsSchema extends EntityState<ReportItem> {
  isLoading?: boolean;
  error?: string;
  reportsList?: ReportItem[];
}
