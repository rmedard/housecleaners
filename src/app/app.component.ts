import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';
import {AuthService} from './+services/auth.service';
import {timer} from 'rxjs';

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
            this.statusBar.backgroundColorByHexString('#222428');
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
            // timer(3000).subscribe(() => {
            //     this.statusBar.overlaysWebView(false);
            //     this.statusBar.backgroundColorByHexString('#fed330');
            //     this.statusBar.show();
            // });
            this.authService.getUser().then(user => {
                if (user != null) {
                    this.authService.login({email: user.email, password: user.password});
                }
            });
        });

        this.platform.backButton.subscribe(() => {
            const currentUrl = this.router.url;
            if (currentUrl === '' || currentUrl.includes('/tabs/')) {
                navigator['app'].exitApp();
            }
        });
    }
}
