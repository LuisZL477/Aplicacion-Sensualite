import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-cancelado',
  templateUrl: './pago-cancelado.page.html',
  styleUrls: ['./pago-cancelado.page.scss'],
})
export class PagoCanceladoPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    Swal.fire({
      icon: 'info',
      title: 'Transacción cancelada',
      text: 'La transacción fue cancelada.',
      confirmButtonColor: '#3085d6',
      heightAuto: false, // Desactiva el ajuste automático de la altura
    });

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }); 
  }
}

