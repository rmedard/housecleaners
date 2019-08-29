import {Component, OnInit} from '@angular/core';
import {ServicesService} from '../+services/services.service';
import {AuthService} from '../+services/auth.service';

@Component({
    selector: 'app-services',
    templateUrl: 'services.page.html',
    styleUrls: ['services.page.scss']
})
export class ServicesPage implements OnInit {
    title = 'House Cleaners Services';
    interiorServicesCount = 0;
    exteriorServicesCount = 0;

    constructor(private servicesService: ServicesService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.login({email: 'alfretoine@gmail.com', password: '122122122'});
        this.servicesService.getServices().subscribe(data => {
            this.servicesService.interiorServices = data.filter(service => service.category_id === 1);
            this.servicesService.exteriorServices = data.filter(service => service.category_id === 2);
            this.interiorServicesCount = this.servicesService.interiorServices.length;
            this.exteriorServicesCount = this.servicesService.exteriorServices.length;
        });
    }
}
