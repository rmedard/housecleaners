import {Component, OnInit} from '@angular/core';
import {AuthService} from '../+services/auth.service';
import {User} from '../+models/user';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {
    title = 'Profile Page';
    user: User = {} as User;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.getLoggedInUser().then(u => {
            this.user = u;
        });
    }
}
