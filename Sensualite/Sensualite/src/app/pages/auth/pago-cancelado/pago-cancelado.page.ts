import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pago-cancelado',
  templateUrl: './pago-cancelado.page.html',
  styleUrls: ['./pago-cancelado.page.scss'],
})
export class PagoCanceladoPage implements OnInit {
  
    constructor(
      private toastr: ToastrService,
      private router: Router
    ) { }
  
    ngOnInit() {
      this.toastr.info('La transacción fue cancelada.');
      this.router.navigate(['/dashboard']);
    }
  }
  
