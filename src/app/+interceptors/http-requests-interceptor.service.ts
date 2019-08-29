import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {AuthService, Headers} from '../+services/auth.service';
import {mergeMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestsInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('plannings')) {
            return from(this.authService.getLoggedInUser()).pipe(mergeMap((loggedInUser) => {
                const duplicateRequest = req.clone({
                    headers: req.headers
                        .set(Headers.accessToken, loggedInUser.accessToken)
                        .set(Headers.tokenType, loggedInUser.tokenType)
                        .set(Headers.expiry, loggedInUser.expiry.toString())
                        .set(Headers.client, loggedInUser.client)
                        .set(Headers.uid, loggedInUser.uid)
                });
                return next.handle(duplicateRequest);
            }));
        }
        return next.handle(req);
    }
}
