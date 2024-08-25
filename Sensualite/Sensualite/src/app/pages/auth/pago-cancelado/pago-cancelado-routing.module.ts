import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoCanceladoPage } from './pago-cancelado.page';

const routes: Routes = [
  {
    path: '',
    component: PagoCanceladoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoCanceladoPageRoutingModule {}
