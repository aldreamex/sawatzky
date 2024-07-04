import { StateSchema } from 'app/providers';

export const getDateFrom = (state: StateSchema) => state.dateInput?.dateFrom;
export const getDateTo = (state: StateSchema) => state.dateInput?.dateTo;
