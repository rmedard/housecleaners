import {NgModule} from '@angular/core';
import {HttpRequestsInterceptorService} from './http-requests-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';


@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestsInterceptorService,
            multi: true
        }
    ]
})
export class InterceptorsModule {
}
