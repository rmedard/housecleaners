import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ListServicesPage} from './list-services.page';
import {ServiceTeaserComponent} from './service-teaser/service-teaser.component';
import {SharedModule} from '../../+shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: ListServicesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [ListServicesPage, ServiceTeaserComponent]
})
export class ListServicesPageModule {
}
