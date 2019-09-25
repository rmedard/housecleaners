import {Component, OnInit, ViewChild} from '@angular/core';
import {Planning} from '../+models/planning';
import {OrderingService} from '../+services/ordering.service';
import {Professional} from '../+models/professional';
import {Service} from '../+models/service';
import {ServicesService} from '../+services/services.service';
import * as moment from 'moment';
import {AuthService} from '../+services/auth.service';
import {IonContent} from '@ionic/angular';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-planning',
    templateUrl: 'planning.page.html',
    styleUrls: ['planning.page.scss']
})
export class PlanningPage implements OnInit {

    title = 'Planning';
    @ViewChild(IonContent, {static: false}) content: IonContent;
    futurePlans: { planning: Planning, professional: Professional, service: Service }[] = [];
    pastPlans: { planning: Planning, professional: Professional, service: Service }[] = [];

    message: string;
    messageReady = false;

    constructor(private orderingService: OrderingService,
                private servicesService: ServicesService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        // this.loadPlannings();
    }

    ionViewWillEnter() {
        this.loadPlannings();
    }

    loadPlannings($event?) {
        this.futurePlans = [];
        this.pastPlans = [];
        if (this.authService.isUserLoggedIn) {
            this.orderingService.getPlannedOrders().subscribe(data => {
                    (data as Planning[])
                        .filter(order => this.authService.user.person.id === order.professional_id ||
                            this.authService.user.person.id === order.customer_id)
                        .forEach(plan => {
                            this.servicesService.getProfessionalsByService(plan.service_id.toString())
                                .subscribe(serv => {
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
                }, error => console.log(error),
                () => {
                    this.messageReady = true;
                    if ($event && $event.type === 'ionRefresh') {
                        $event.target.complete();
                    }
                });
        } else {
            this.messageReady = true;
            if ($event && $event.type === 'ionRefresh') {
                $event.target.complete();
            }
        }
    }

    doRefresh($event) {
        this.content.scrollToTop(1000).then(() => this.loadPlannings($event));
    }
}
