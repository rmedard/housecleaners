import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ServicesPage} from './services.page';
import {SharedModule} from '../+shared/shared.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: ServicesPage}]),
        SharedModule
    ],
  declarations: [ServicesPage]
})
export class ServicesPageModule {}
