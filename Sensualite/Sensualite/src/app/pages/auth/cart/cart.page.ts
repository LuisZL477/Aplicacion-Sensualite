import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { PayPalService } from '../../../services/paypal.service'; // Importa PayPalService
import { Product } from '../../../interfaces/product';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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
        this.toastr.success(`El producto ${item.product.nombre} ha sido eliminado del carrito.`);
      },
      error => {
        console.error('Error al eliminar el producto del carrito:', error);
        this.toastr.error('Ocurrió un error al eliminar el producto del carrito.');
      }
    );
  }

  buyProduct(item: { product: Product; quantity: number }) {
    const { product, quantity } = item;
    const selectedQuantity = quantity || 1;

    if (product.existencia >= selectedQuantity) {
      this._cartService.buyProduct(product, selectedQuantity).subscribe(
        response => {
          this.removeFromCart(item); // Elimina el producto del carrito después de la compra
          this.toastr.success(`Has comprado ${selectedQuantity} de ${product.nombre}`);        
            this.router.navigate(['/dashboard']); // Navega a la página de pago                    
        },
        error => {
          console.error('Error al comprar el producto:', error);
          this.toastr.error('Ocurrió un error al procesar tu compra.');
        }
      );
    } else {
      this.toastr.warning(`El producto ${product.nombre} no tiene suficiente stock.`);
    }
  }

  // buyAllCart() {
  //   this._payPalService.createPayPalTransaction().subscribe(
  //     (response) => {
  //       window.location.href = response.approvalUrl; // Redirigir al usuario a la página de aprobación de PayPal
  //     },
  //     (error) => {
  //       console.error('Error al crear la transacción de PayPal:', error);
  //       this.toastr.error('Ocurrió un error al procesar la compra.');
  //     }
  //   );
  // }

  buyAllCart() {
    this._payPalService.createPayPalTransaction().subscribe(
      (response) => {
        const token = localStorage.getItem('token');
        window.location.href = response.approvalUrl;
      },
      (error) => {
        this.toastr.error('Ocurrió un error al crear la transacción de PayPal.');
      }
    );
  }
  

  
}
