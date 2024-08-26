import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.endpoint}api/paypal/`;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  createPayPalTransaction(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}create`, {}, { headers: this.getHeaders() });
  }

  successPayPalTransaction(paymentId: string, payerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}success?paymentId=${paymentId}&PayerID=${payerId}`, { headers: this.getHeaders() });
  }

  cancelPayPalTransaction(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cancel`, { headers: this.getHeaders() });
  }
}
