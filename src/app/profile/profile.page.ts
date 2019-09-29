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

    constructor(public authService: AuthService,
                private formBuilder: FormBuilder,
                private toastCtrl: ToastController) {
    }

    ngOnInit(): void {
        this.initializeProfile();
    }

    login() {
        this.authService.login({
            email: this.loginForm.controls['username'].value.toString().trim(),
            password: this.loginForm.controls['password'].value.toString().trim()
        }).subscribe(data => {
            this.user = data as User;
            const type = this.user.person.type_id === 1 ? 'client' : 'préstataire';
            this.title = 'Profile d\'un ' + type;
        }, error => {
            this.showFailedLoginMessage(error.toString()).then(() => console.log(error));
        });
    }

    logout() {
        this.authService.logout();
        this.initializeLoginForm();
    }

    async showFailedLoginMessage(messageStr: string) {
        const toast = await this.toastCtrl.create({
            message: messageStr,
            duration: 3000,
            color: 'danger',
            position: 'top',
            translucent: true,
            showCloseButton: true
        });
        toast.present();
    }

    private initializeProfile() {
        if (this.authService.isUserLoggedIn) {
            this.user = this.authService.user;
            const type = this.user.person.type_id === 1 ? 'client' : 'préstataire';
            this.title = 'Profile d\'un ' + type;
        } else {
            this.initializeLoginForm();
        }
    }

    private initializeLoginForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
            password: ['', [Validators.required, Validators.minLength(2)]]
        });
    }
}
