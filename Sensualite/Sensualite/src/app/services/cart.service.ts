import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<Product[]>([]);
  cart$ = this.cart.asObservable();
  private apiUrl = environment.endpoint;

  constructor(private http: HttpClient) { }

  addToCart(product: Product) {
    const currentCart = this.cart.value;
    const productExists = currentCart.some(item => item.id === product.id);

    if (!productExists) {
      this.cart.next([...currentCart, product]);
    } else {
      console.log(`El producto ${product.nombre} ya está en el carrito.`);
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

  buyProduct(product: Product, quantity: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}api/products/buy`, { productId: product.id, quantity }, { headers });
  }
  
}
