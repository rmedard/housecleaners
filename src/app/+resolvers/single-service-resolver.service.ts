import {Injectable} from '@angular/core';
import {ServicesService} from '../+services/services.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Service} from '../+models/service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SingleServiceResolver implements Resolve<Service> {

    constructor(private servicesService: ServicesService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Service> | Promise<Service> | Service {
        return this.servicesService.getProfessionalsByService(route.paramMap.get('service_id'));
    }
}
