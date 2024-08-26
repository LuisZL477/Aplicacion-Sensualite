import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PayPalService } from '../../../services/paypal.service'; // Importa PayPalService
import { Product } from '../../../interfaces/product';
import Swal from 'sweetalert2';
import { CartItem } from 'src/app/interfaces/CartItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];

  constructor(
    private _cartService: CartService,
    private _payPalService: PayPalService, // Inyecta PayPalService
    private router: Router  // Inyecta el servicio Router
  ) { }

  ngOnInit() {
    this.loadCartItems();
  }

  private loadCartItems() {
    this._cartService.getCartItems().subscribe(
      (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          this.cartItems = response.data.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity,
          }));
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          this.cartItems = response.data.items.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity,
          }));
        } else {
          console.error('La respuesta no contiene un array esperado');
          this.cartItems = [];
        }
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        this.cartItems = [];
      }
    );
  }

  getQuantities(product: Product): number[] {
    return Array.from({ length: product.existencia }, (_, i) => i + 1);
  }

  removeFromCart(item: { product: Product; quantity: number }) {
    this._cartService.removeFromCart(item.product.id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: `El producto ${item.product.nombre} ha sido eliminado del carrito.`,
          confirmButtonColor: '#3085d6',
          heightAuto: false,
        });
      },
      error => {
        console.error('Error al eliminar el producto del carrito:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el producto del carrito.',
          confirmButtonColor: '#d33',
          heightAuto: false,
        });
      }
    );
  }

  buyAllCart() {
    this._payPalService.createPayPalTransaction().subscribe(
      (response) => {
        const token = localStorage.getItem('token');
        window.location.href = response.approvalUrl;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear la transacción de PayPal.',
          confirmButtonColor: '#d33',
          heightAuto: false,
        });
      }
    );
  }
}
