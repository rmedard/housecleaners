import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Service} from '../+models/service';
import {map} from 'rxjs/operators';

const API_URL = environment.apiUrl;
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private _interiorServices: Service[] = [];
    private _exteriorServices: Service[] = [];

    private _selectedServices: Service[] = [];

    constructor(private http: HttpClient) {
    }

    getServices() {
        return this.http.get<Service[]>(`${API_URL}/services`, httpOptions);
    }

    getProfessionalsByService(serviceId: string) {
        return this.http.get<Service>(`${API_URL}/services/${serviceId}`, httpOptions).pipe(map(service => {
            service.professionals.map(prof => {
                if (!prof.picture || prof.picture.length === 0) {
                    prof.picture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
                }
            });
            return service;
        }));
    }

    getSelectedServices(categoryId: number) {
        this.selectedServices = categoryId === 1 ? this.interiorServices : this.exteriorServices;
        return this.selectedServices;
    }

    get interiorServices(): Service[] {
        return this._interiorServices;
    }

    set interiorServices(value: Service[]) {
        this._interiorServices = value;
    }

    get exteriorServices(): Service[] {
        return this._exteriorServices;
    }

    set exteriorServices(value: Service[]) {
        this._exteriorServices = value;
    }


    get selectedServices(): Service[] {
        return this._selectedServices;
    }

    set selectedServices(value: Service[]) {
        this._selectedServices = value;
    }
}
