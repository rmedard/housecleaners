import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PlanningPage} from './planning.page';
import {SharedModule} from '../+shared/shared.module';
import {PlanningTeaserComponent} from './planning-teaser/planning-teaser.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: PlanningPage}]),
        SharedModule
    ],
    declarations: [PlanningPage, PlanningTeaserComponent]
})
export class PlanningPageModule {
}
