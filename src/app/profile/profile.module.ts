import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfilePage} from './profile.page';
import {SharedModule} from '../+shared/shared.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: ProfilePage}]),
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [ProfilePage]
})
export class ProfilePageModule {
}
