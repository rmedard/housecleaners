import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopHeaderComponent} from './top-header/top-header.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [TopHeaderComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TopHeaderComponent]
})
export class SharedModule { }
