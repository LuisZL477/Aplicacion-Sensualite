import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPalService } from 'src/app/services/paypal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private payPalService: PayPalService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const paymentId = params['paymentId'];
      const payerId = params['PayerID'];

      if (paymentId && payerId) {
        this.payPalService.successPayPalTransaction(paymentId, payerId).subscribe({
          next: () => {
            this.toastr.success('Compra realizada con éxito');
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.toastr.error('Ocurrió un error al procesar el pago');
            this.router.navigate(['/dashboard']);
          }
        });
      } else {
        this.toastr.warning('No se proporcionaron los parámetros de pago');
        this.router.navigate(['/dashboard']);
      }
    });
  }
}


