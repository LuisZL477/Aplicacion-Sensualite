// src/app/pages/cart/cart.page.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service'; 
import { Product } from '../../../interfaces/product'; 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: Product[] = [];

  constructor(private _cartService: CartService) { }

  ngOnInit() {
    this._cartService.getCartItems().subscribe((items: Product[]) => {
      this.cartItems = items;
    });
  }

  removeFromCart(product: Product) {
    this._cartService.removeFromCart(product);
  }
}
