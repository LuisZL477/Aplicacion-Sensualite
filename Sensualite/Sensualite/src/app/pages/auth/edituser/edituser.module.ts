import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdituserPageRoutingModule } from './edituser-routing.module';

import { EdituserPage } from './edituser.page';

import { SharedModule } from '../../../shared/shared.module'; 


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdituserPageRoutingModule,
    SharedModule
  ],
  declarations: [EdituserPage]
})
export class EdituserPageModule {}