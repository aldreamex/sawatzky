export interface WorkTask {
    id: string;
    name: string;
    time: number;
    hours: number;
    minutes: number;
    actualTime?: number;
    price: number;
    status?: boolean;
}
