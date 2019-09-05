import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService, Headers} from '../+services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestsInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isUserLoggedIn) {
            if (req.url.includes('plannings')) {
                const duplicateRequest = req.clone({
                    headers: req.headers
                        .set(Headers.accessToken, this.authService.user.accessToken)
                        .set(Headers.tokenType, this.authService.user.tokenType)
                        .set(Headers.expiry, this.authService.user.expiry.toString())
                        .set(Headers.client, this.authService.user.client)
                        .set(Headers.uid, this.authService.user.uid)
                });
                return next.handle(duplicateRequest);
            }
        }
        return next.handle(req);
    }
}
