import {Component, OnInit} from '@angular/core';
import {Planning} from '../+models/planning';
import {OrderingService} from '../+services/ordering.service';
import {Professional} from '../+models/professional';
import {Service} from '../+models/service';
import {ServicesService} from '../+services/services.service';
import * as moment from 'moment';

@Component({
    selector: 'app-planning',
    templateUrl: 'planning.page.html',
    styleUrls: ['planning.page.scss']
})
export class PlanningPage implements OnInit {

    title = 'Planning';
    futurePlans: { planning: Planning, professional: Professional, service: Service }[] = [];
    pastPlans: { planning: Planning, professional: Professional, service: Service }[] = [];

    constructor(private orderingService: OrderingService, private servicesService: ServicesService) {
    }

    ngOnInit(): void {
        this.orderingService.getPlannedOrders().subscribe(data => {
            (data as Planning[]).forEach(plan => {
                this.servicesService.getProfessionalsByService(plan.service_id.toString()).subscribe(serv => {
                    if (moment(plan.date).isBefore(new Date())) {
                        this.pastPlans.push(
                            {
                                planning: plan,
                                service: serv,
                                professional: serv.professionals.filter(p => p.id === plan.professional_id)[0]
                            }
                        );
                    } else {
                        this.futurePlans.push(
                            {
                                planning: plan,
                                service: serv,
                                professional: serv.professionals.filter(p => p.id === plan.professional_id)[0]
                            }
                        );
                    }
                });
            });
        });
    }
}
