import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {environment} from '../../environments/environment';
import {ErrorHandlerService} from './error-handler.service';
import {catchError, retry} from 'rxjs/operators';
import {User} from '../+models/user';
import * as moment from 'moment';
import {EMPTY} from 'rxjs';
import {log} from 'util';

const API_URL = environment.apiUrl;
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    observe: 'response' as 'body'
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private storage: Storage) {
    }

    login(data: { email: string, password: string }) {
        return this.http.post(`${API_URL}/personas/sign_in`, data, httpOptions)
            .pipe(retry(3), catchError(ErrorHandlerService.handleError))
            .subscribe(result => {
                const res = result as HttpResponse<any>;
                const user = {
                    email: data.email,
                    password: data.password,
                    accessToken: res.headers.get(Headers.accessToken),
                    tokenType: res.headers.get(Headers.tokenType),
                    client: res.headers.get(Headers.client),
                    expiry: Number(res.headers.get(Headers.expiry)),
                    uid: res.headers.get(Headers.uid)
                } as User;
                this.storage.set('LOGGED-IN-USER', user).then(() => {
                    console.log('####### Loggin done');
                });
            });
    }

    async getLoggedInUser(): Promise<User> {
        return await this.storage.get('LOGGED-IN-USER').then(data => {
            if (data) {
                const user = data as User;
                const expiryDate = new Date(moment.duration(user.expiry, 'seconds').asMilliseconds());
                if (moment(expiryDate).isBefore(moment(new Date()))) {
                    data = this.login({email: user.email, password: user.password});
                }
            }
            return data;
        }).catch(error => {
            console.log(error);
        });
    }

    loggedIn(): Promise<boolean> {
        return this.storage.get('LOGGED-IN-USER').then(d => {
            return d !== null;
        });
    }
}

export enum Headers {
    accessToken = 'access-token',
    tokenType = 'token-type',
    client = 'client',
    expiry = 'expiry',
    uid = 'uid'
}
