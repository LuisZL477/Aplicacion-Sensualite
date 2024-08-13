import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: Product[] = [];

  constructor(private _cartService: CartService, private toastr: ToastrService) { }

  ngOnInit() {
    // Obtener los productos del carrito desde el servicio
    this._cartService.getCartItems().subscribe(
      (items: Product[]) => {
        this.cartItems = items;
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
      }
    );
  }

  // Generar un array de cantidades disponibles basado en la existencia del producto
  getQuantities(product: Product): number[] {
    return Array.from({ length: product.existencia }, (_, i) => i + 1);
  }

  // Eliminar producto del carrito
  removeFromCart(product: Product) {
    this._cartService.removeFromCart(product).subscribe(
      () => {
        // Actualizar la lista de productos en el carrito después de eliminar
        this.cartItems = this.cartItems.filter(item => item.id !== product.id);
        this.toastr.success(`El producto ${product.nombre} ha sido eliminado del carrito.`);
      },
      error => {
        console.error('Error al eliminar el producto del carrito:', error);
        this.toastr.error('Ocurrió un error al eliminar el producto del carrito.');
      }
    );
  }
  
  

  // Comprar producto
  buyProduct(product: Product) {
    const quantity = product.quantity || 1; // Default to 1 if not selected
  
    if (product.existencia >= quantity) {
      this._cartService.buyProduct(product, quantity).subscribe(
        response => {
          product.existencia -= quantity;  // Reducir localmente el stock
          if (product.existencia === 0) {
            this.removeFromCart(product);  // Eliminar del carrito si ya no hay más en existencia
          }
          this.toastr.success(`Has comprado ${quantity} de ${product.nombre}`);
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
}
