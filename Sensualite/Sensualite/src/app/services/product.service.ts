import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/products/';
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del local storage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers: this.getHeaders() });
  }

  deleteProducts(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers: this.getHeaders() });
  }

  saveProducts(product: FormData): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, product, { headers: this.getHeaders() });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: FormData): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, product, { headers: this.getHeaders() });
  }

  deleteImage(imagePath: string): Observable<any> {
    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}uploads/${imagePath}`, { headers: this.getHeaders() });
  }
}
