import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SingleServicePage} from './single-service.page';
import {MomentModule} from 'ngx-moment';
import {Ng5SliderModule} from 'ng5-slider';
import {SharedModule} from '../../+shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SingleServicePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MomentModule,
        Ng5SliderModule,
        SharedModule
    ],
  declarations: [SingleServicePage]
})
export class SingleServicePageModule {}
