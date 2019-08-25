import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Service} from '../+models/service';
import {Observable, of} from 'rxjs';
import {ServicesService} from '../+services/services.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryServicesResolver implements Resolve<Service[]> {

    constructor(private servicesService: ServicesService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Service[]> | Promise<Service[]> | Service[] {
        let categoryId = 0;
        if (route.paramMap.get('category_id')) {
            categoryId = Number(route.paramMap.get('category_id'));
        }
        return of(this.servicesService.getSelectedServices(categoryId));
    }
}
