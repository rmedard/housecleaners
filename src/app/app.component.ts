import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AuthService} from './+services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar, private router: Router, private authService: AuthService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // this.authService.login({email: 'alfretoine@gmail.com', password: '122122122'});
        });

        this.platform.backButton.subscribe(() => {
            const currentUrl = this.router.url;
            if (currentUrl === '' || currentUrl.includes('/tabs/')) {
                navigator['app'].exitApp();
            }
        });
    }
}
