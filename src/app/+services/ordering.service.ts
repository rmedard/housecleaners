import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Availability} from '../+models/availability';
import {map} from 'rxjs/operators';
import {Professional} from '../+models/professional';

import {of} from 'rxjs';
import {Planning} from '../+models/planning';
import * as moment from 'moment';
import {AvailableProfessionalDto} from '../+models/dto/available-professional-dto';
import {CreatePlanningDto} from '../+models/dto/create-planning-dto';

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
        return this.http.post<any[]>(`${API_URL}/professionals/availability`, availability, httpOptions)
            .pipe(map(profs => {
                const professionals: Professional[] = [];
                profs.map(p => {
                    const prof = p as AvailableProfessionalDto;
                    professionals.push({
                        id: prof.professional_id,
                        first_name: prof.first_name,
                        last_name: prof.last_name,
                        picture: !prof.picture || prof.picture.length === 0 ?
                            'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp' : prof.picture
                    } as Professional);
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

    createPlanning(planning: CreatePlanningDto) {
        return this.http.post(`${API_URL}/plannings`, planning, httpOptions);
    }

    getProfessional(id: number) {
        return this.http.get<Professional>(`${API_URL}/professionals/${id}`);
    }
}
