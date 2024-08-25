import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.page.html',
  styleUrls: ['./pago-exitoso.page.scss'],
})
export class PagoExitosoPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = params['status'];

      if (status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Compra exitosa',
          text: 'Compra realizada con éxito.',
          confirmButtonColor: '#3085d6',
          heightAuto: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al procesar el pago.',
          confirmButtonColor: '#d33',
          heightAuto: false,
        });
      }

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }); 
    });
  }
}
