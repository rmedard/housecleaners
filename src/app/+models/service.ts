import {Professional} from './professional';

export interface Service {
    id: number;
    name: string;
    description: string;
    category_id?: number;
    professionals?: Professional[];
}
