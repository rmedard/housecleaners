import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ErrorHandlerService} from './error-handler.service';
import {catchError, map, mergeMap, retry, switchMap, tap} from 'rxjs/operators';
import {User} from '../+models/user';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Person} from '../+models/person';
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

    isUserLoggedIn = false;
    user: User;

    constructor(private http: HttpClient, private storage: NativeStorage) {
    }

    login(data: { email: string, password: string }): Observable<any> {
        let user: User;
        return this.http.post(`${API_URL}/personas/sign_in`, data, httpOptions)
            .pipe(retry(3), catchError(ErrorHandlerService.handleError))
            .pipe(map(result => {
                const res = result as HttpResponse<any>;
                user = {
                    email: data.email,
                    password: data.password,
                    accessToken: res.headers.get(Headers.accessToken),
                    tokenType: res.headers.get(Headers.tokenType),
                    client: res.headers.get(Headers.client),
                    expiry: Number(res.headers.get(Headers.expiry)),
                    uid: res.headers.get(Headers.uid),
                    person: res.body.data as Person
                } as User;
                if (!user.person.picture || user.person.picture.length === 0) {
                    user.person.picture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
                }
                this.isUserLoggedIn = true;
                this.user = user;
            })).pipe(mergeMap(() => this.http.post(`${API_URL}/personas/me`, {},
                {headers: new HttpHeaders({'Content-Type': 'application/json'})})
                .pipe(map(d => {
                    user.person = d as Person;
                    this.storage.setItem('LOGGED-IN-USER', user).then(() => {
                        this.user = user;
                    });
                    console.log(user);
                    return user;
                }))));
    }

    logout() {
        this.storage.remove('LOGGED-IN-USER').then(() => {
            this.isUserLoggedIn = false;
            delete this.user;
            console.log('User logged out');
        });
    }

    getUser() {
        return this.storage.getItem('LOGGED-IN-USER').then(
            data => {
                this.user = data;
                this.isUserLoggedIn = this.user != null;
                return this.user;
            },
            error => {
                console.log(error);
                this.user = null;
                this.isUserLoggedIn = false;
                return null;
            }
        );
    }
}

export enum Headers {
    accessToken = 'access-token',
    tokenType = 'token-type',
    client = 'client',
    expiry = 'expiry',
    uid = 'uid'
}
