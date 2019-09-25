import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Availability} from '../+models/availability';
import {map} from 'rxjs/operators';
import {Professional} from '../+models/professional';

import {of} from 'rxjs';
import {Planning} from '../+models/planning';
import * as moment from 'moment';

const API_URL = environment.apiUrl;
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class OrderingService {

    constructor(private http: HttpClient) {
    }

    getProfessionalsByAvailability(availability: Availability) {
        if (availability.start_time === availability.end_time) {
            return of([]);
        }
        return this.http.post<Professional[]>(`${API_URL}/professionals/availability`, availability, httpOptions)
            .pipe(map(professionals => {
                professionals.map(prof => {
                    if (!prof.picture || prof.picture.length === 0) {
                        prof.picture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
                    }
                });
                return professionals;
            }));
    }

    getPlannedOrders() {
        return this.http.get<Planning[]>(`${API_URL}/plannings`, httpOptions)
            .pipe(map(plannings => {
                plannings.map(planning => {
                    planning.start_hour = moment(planning.start_hour).format('DD-MM-YYYY');
                    planning.end_hour = moment(planning.end_hour).format('DD-MM-YYYY');
                });
                return plannings;
            }));
    }

    getProfessional(id: number) {
        return this.http.get<Professional>(`${API_URL}/professionals/${id}`);
    }
}
