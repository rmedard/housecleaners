import {Component, OnInit} from '@angular/core';
import {Planning} from '../+models/planning';
import {OrderingService} from '../+services/ordering.service';
import {AuthService} from '../+services/auth.service';

@Component({
    selector: 'app-planning',
    templateUrl: 'planning.page.html',
    styleUrls: ['planning.page.scss']
})
export class PlanningPage implements OnInit {

    title = 'Planning';

    plannings: Planning[];

    constructor(private orderingService: OrderingService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.orderingService.getPlannedOrders().subscribe(data => {
            this.plannings = data;
        });
    }
}
