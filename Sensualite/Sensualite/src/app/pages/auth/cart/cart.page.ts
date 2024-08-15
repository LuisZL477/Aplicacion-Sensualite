import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product';
import { ToastrService } from 'ngx-toastr';
import { Response } from 'express';
import { CartItem } from 'src/app/interfaces/CartItem';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];

  constructor(private _cartService: CartService, private toastr: ToastrService) { }

  ngOnInit() {
    this._cartService.getCartItems().subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.data && Array.isArray(response.data.items)) {
          this.cartItems = response.data.items.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity,
          }));
        } else {
          console.error('La respuesta no contiene un array en `data.items`');
        }
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
  removeFromCart(item: { product: Product; quantity: number }) {
    this._cartService.removeFromCart(item.product).subscribe(
      () => {
        // Actualizar la lista de productos en el carrito después de eliminar
        this.cartItems = this.cartItems.filter(cartItem => cartItem.product.id !== item.product.id);
        this.toastr.success(`El producto ${item.product.nombre} ha sido eliminado del carrito.`);
      },
      error => {
        console.error('Error al eliminar el producto del carrito:', error);
        this.toastr.error('Ocurrió un error al eliminar el producto del carrito.');
      }
    );
  }

  // Comprar producto
  buyProduct(item: { product: Product; quantity: number }) {
    const { product, quantity } = item;
    const selectedQuantity = quantity || 1; // Default to 1 if not selected

    if (product.existencia >= selectedQuantity) {
      this._cartService.buyProduct(product, selectedQuantity).subscribe(
        response => {
          product.existencia -= selectedQuantity;  // Reducir localmente el stock
          if (product.existencia === 0) {
            this.removeFromCart(item);  // Eliminar del carrito si ya no hay más en existencia
          }
          this.toastr.success(`Has comprado ${selectedQuantity} de ${product.nombre}`);
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
