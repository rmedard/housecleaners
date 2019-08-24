import {Component, OnInit} from '@angular/core';
import {ServicesService} from '../+services/services.service';

@Component({
    selector: 'app-services',
    templateUrl: 'services.page.html',
    styleUrls: ['services.page.scss']
})
export class ServicesPage implements OnInit {
    title = 'House Cleaners Services';
    interiorServicesCount = 0;
    exteriorServicesCount = 0;

    constructor(private servicesService: ServicesService) {
    }

    ngOnInit(): void {
        this.servicesService.getServices().subscribe(data => {
            this.servicesService.interiorServices = data.filter(service => service.category_id === 1);
            this.servicesService.exteriorServices = data.filter(service => service.category_id === 2);
            this.interiorServicesCount = this.servicesService.interiorServices.length;
            this.exteriorServicesCount = this.servicesService.exteriorServices.length;
        });
    }
}
