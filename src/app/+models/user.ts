import {Professional} from './professional';

export interface User {
    email: string;
    password: string;
    accessToken: string;
    tokenType: string;
    client: string;
    expiry: number;
    uid: string;
    professional?: Professional; // Change to persona
}
