import {Component, OnInit} from '@angular/core';
import {AuthService} from '../+services/auth.service';
import {User} from '../+models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {
    title = 'Profile d\'utilisateur';
    user: User = {} as User;
    loginForm: FormGroup;

    constructor(private authService: AuthService,
                private formBuilder: FormBuilder,
                private toastCtrl: ToastController) {
    }

    ngOnInit(): void {
        this.initializeProfile();
    }

    login() {
        this.authService.login({
            email: this.loginForm.controls['username'].value.toString(),
            password: this.loginForm.controls['password'].value.toString()
        }).subscribe(() => {
            this.authService.getLoggedInUser().then(user => {
                this.user = user;
            });
        }, error => {
            this.showFailedLoginMessage(error.toString());
        });
    }

    logout() {
        this.authService.logout();
        this.initializeLoginForm();
    }

    async showFailedLoginMessage(messageStr: string) {
        const toast = await this.toastCtrl.create({
            message: messageStr,
            duration: 2000,
            color: 'danger',
            position: 'top',
            translucent: true,
            showCloseButton: true
        });
        toast.present();
    }

    private initializeProfile() {
        if (this.authService.LOGGED_IN) {
            this.authService.getLoggedInUser().then(u => {
                this.user = u;
            });
        } else {
            this.initializeLoginForm();
        }
    }

    private initializeLoginForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            password: ['', [Validators.required]]
        });
    }
}
