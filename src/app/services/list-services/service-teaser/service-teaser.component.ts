import {Component, Input, OnInit} from '@angular/core';
import {Service} from '../../../+models/service';

@Component({
    selector: 'app-service-teaser',
    templateUrl: './service-teaser.component.html',
    styleUrls: ['./service-teaser.component.scss'],
})
export class ServiceTeaserComponent implements OnInit {

    @Input() service: Service = {} as Service;

    constructor() {
    }

    ngOnInit() {
    }

}
