import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Service} from '../../+models/service';
import {ServicesService} from '../../+services/services.service';

@Component({
    selector: 'app-list-services',
    templateUrl: './list-services.page.html',
    styleUrls: ['./list-services.page.scss'],
})
export class ListServicesPage implements OnInit {
    title = 'Nos services';
    services: Service[];

    constructor(private servicesService: ServicesService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.services = this.activatedRoute.snapshot.data.services;
        if (this.services && this.services.length > 0) {
            this.title = this.services[0].category_id === 1 ? this.title + ' d\'interieur' : this.title + ' d\'exterieur';
        }
    }

}
