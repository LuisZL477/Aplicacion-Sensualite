import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoExitosoPageRoutingModule } from './pago-exitoso-routing.module';

import { PagoExitosoPage } from './pago-exitoso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoExitosoPageRoutingModule
  ],
  declarations: [PagoExitosoPage]
})
export class PagoExitosoPageModule {}
