import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {environment} from '../../environments/environment';
import {ErrorHandlerService} from './error-handler.service';
import {catchError, retry, tap} from 'rxjs/operators';
import {User} from '../+models/user';
import * as moment from 'moment';
import {Professional} from '../+models/professional';
import {Observable} from 'rxjs';

const API_URL = environment.apiUrl;
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    observe: 'response' as 'body'
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    LOGGED_IN = false;

    constructor(private http: HttpClient, private storage: Storage) {
    }

    login(data: { email: string, password: string }) {
        return this.http.post(`${API_URL}/personas/sign_in`, data, httpOptions)
            .pipe(retry(3), catchError(ErrorHandlerService.handleError))
            .pipe(tap(result => {
                const res = result as HttpResponse<any>;
                const user = {
                    email: data.email,
                    password: data.password,
                    accessToken: res.headers.get(Headers.accessToken),
                    tokenType: res.headers.get(Headers.tokenType),
                    client: res.headers.get(Headers.client),
                    expiry: Number(res.headers.get(Headers.expiry)),
                    uid: res.headers.get(Headers.uid),
                    professional: res.body.data as Professional
                } as User;
                this.storage.set('LOGGED-IN-USER', user).then(() => {
                    this.LOGGED_IN = true;
                    console.log('####### Log-in Done!');
                });
            }));
    }

    logout() {
        this.storage.remove('LOGGED-IN-USER').then(() => {
           this.LOGGED_IN = false;
           console.log('User logged out');
        });
    }

    async getLoggedInUser(): Promise<User> {
        return await this.storage.get('LOGGED-IN-USER').then(data => {
            if (data) {
                const user = data as User;
                const expiryDate = new Date(moment.duration(user.expiry, 'seconds').asMilliseconds());
                if (moment(expiryDate).isBefore(moment(new Date()))) {
                    this.login({email: user.email, password: user.password})
                        .subscribe(() => this.storage.get('LOGGED-IN-USER'));
                }
            }
            return data;
        }, error => {
            console.log(error);
            return {};
        }).catch(error => {
            console.log(error);
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
