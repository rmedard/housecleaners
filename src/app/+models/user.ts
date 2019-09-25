import {Person} from './person';

export interface User {
    email: string;
    password: string;
    accessToken: string;
    tokenType: string;
    client: string;
    expiry: number;
    uid: string;
    person?: Person;
}
