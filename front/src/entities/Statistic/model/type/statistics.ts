import { EntityState } from '@reduxjs/toolkit';
import { WorkObject } from 'entities/WorkObject';

export interface Statistic {
  title: string;
  workObject?: WorkObject;
  startWorkDate: string;
  endWorkDate: string;
  totalSum?: number;
}

export interface StatisticSchema extends EntityState<Statistic> {
  isLoading?: boolean;
  error?: string;
  statistic?: Statistic[];
}
