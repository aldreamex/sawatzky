import { EmployeeRole } from 'entities/Employee';

export interface History {
    id: number;
    changer: string;
    role: EmployeeRole;
    whatChange: string;
    changeDate: string;
    application: number;
}
