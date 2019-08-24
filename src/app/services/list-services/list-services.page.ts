import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Service} from '../../+models/service';
import {ServicesService} from '../../+services/services.service';

@Component({
    selector: 'app-list-services',
    templateUrl: './list-services.page.html',
    styleUrls: ['./list-services.page.scss'],
})
export class ListServicesPage implements OnInit {
    title = 'Nose services';
    showBackButton = true;
    services: Service[];

    constructor(private servicesService: ServicesService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.services = this.activatedRoute.snapshot.data.services;
    }

}
