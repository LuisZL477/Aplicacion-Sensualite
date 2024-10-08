import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl: string;
  private cartApiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.endpoint;
    this.cartApiUrl = 'api/carts/'; // Asegúrate de que coincida con la configuración del backend
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCartItems(): Observable<{ product: Product, quantity: number }[]> {
    return this.http.get<{ product: Product, quantity: number }[]>(`${this.apiUrl}${this.cartApiUrl}`, { headers: this.getHeaders() });
  }

  removeFromCart(productId: number) {
    return this.http.delete(`${this.apiUrl}${this.cartApiUrl}item/${productId}`, {
      headers: this.getHeaders()
    });
}

buyCart(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.cartApiUrl}buy`, {}, {
    headers: this.getHeaders()
  });
}

  buyProduct(product: Product, quantity: number): Observable<any> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}api/products/buy`, { productId: product.id, quantity }, { headers });
  }

  addToCart(product: Product, quantity: number = 1): Observable<any> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}${this.cartApiUrl}`, { productId: product.id, quantity }, { headers });
  }  
}
