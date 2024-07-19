// src/app/services/cart.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<Product[]>([]);
  cart$ = this.cart.asObservable();

  constructor() { }

  addToCart(product: Product) {
    const currentCart = this.cart.value;
    
    // Verificar si el producto ya está en el carrito por su ID
    const productExists = currentCart.some(item => item.id === product.id);

    if (!productExists) {
      this.cart.next([...currentCart, product]);
    } else {
      console.log(`El producto ${product.nombre} ya está en el carrito.`);
      // Puedes emitir un mensaje, lanzar una alerta, o manejarlo como necesites
    }
  }

  getCartItems() {
    return this.cart.asObservable();
  }

  removeFromCart(product: Product) {
    const currentCart = this.cart.value;
    const updatedCart = currentCart.filter(item => item.id !== product.id);
    this.cart.next(updatedCart);
  }

  clearCart() {
    this.cart.next([]);
  }
}
