import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PurchaseService } from 'src/app/services/purchase.service'; // Importa el servicio de compras

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {

  purchases: any[] = []; // Aquí almacenaremos las compras del usuario

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.loadPurchases();
  }

  loadPurchases(event?: any) {
    this.purchaseService.getPurchases().subscribe({
      next: (response) => {
        this.purchases = response; // Asignar las compras obtenidas al array purchases
        if (event) {
          event.target.complete();
        }
      },
      error: () => {
        // Manejo de errores
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al cargar las compras.',
          confirmButtonColor: '#d33',
          heightAuto: false,
        });
        if (event) {
          event.target.complete();
        }
      }
    });
  }
}
