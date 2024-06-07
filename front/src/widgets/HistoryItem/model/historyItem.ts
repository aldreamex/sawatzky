import { Document } from 'entities/Document';

export interface HistoryItemType {
  id: string;
  name: string;
  role?: string;
  date?: string;
  time?: string;
  docList?: Document[];
  action?: string;
  comment?: string;
}
