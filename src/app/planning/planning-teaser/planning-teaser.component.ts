import {Component, Input, OnInit} from '@angular/core';
import {Planning} from '../../+models/planning';
import {HttpClient} from '@angular/common/http';
import {Professional} from '../../+models/professional';
import {OrderingService} from '../../+services/ordering.service';

@Component({
    selector: 'app-planning-teaser',
    templateUrl: './planning-teaser.component.html',
    styleUrls: ['./planning-teaser.component.scss'],
})
export class PlanningTeaserComponent implements OnInit {

    @Input() planning: Planning;
    professional: Professional = {} as Professional;

    constructor(private orderingService: OrderingService) {
    }

    ngOnInit() {
        this.orderingService.getProfessional(this.planning.professional_id).subscribe(p => {
            this.professional = p;
            console.log(this.professional);
        });
    }

}
