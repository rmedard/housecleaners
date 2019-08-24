import {Component, Input, OnInit} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-top-header',
    templateUrl: './top-header.component.html',
    styleUrls: ['./top-header.component.scss'],
})
export class TopHeaderComponent implements OnInit {
    routeLoading = false;
    @Input() title = 'HouseCleaners';
    @Input() showBackButton = false;

    constructor(private router: Router, public navCtrl: NavController) {
        this.router.events.subscribe((value) => {
            switch (true) {
                case value instanceof NavigationStart:
                    this.routeLoading = true;
                    break;
                case value instanceof NavigationEnd:
                case value instanceof NavigationError:
                case value instanceof NavigationCancel:
                    this.routeLoading = false;
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
    }

}
