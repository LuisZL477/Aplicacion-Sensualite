import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoCanceladoPageRoutingModule } from './pago-cancelado-routing.module';

import { PagoCanceladoPage } from './pago-cancelado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoCanceladoPageRoutingModule
  ],
  declarations: [PagoCanceladoPage]
})
export class PagoCanceladoPageModule {}
