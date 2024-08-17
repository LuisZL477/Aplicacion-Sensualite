import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/users';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users';
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  signIn(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`, user);
  }

  // Obtener detalles del usuario autenticado
  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}/profile`, { headers: this.getHeaders() });
  }

  // Actualizar el usuario autenticado
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.myAppUrl}${this.myApiUrl}/profile`, user, { headers: this.getHeaders() });
  }

  // Eliminar el usuario autenticado
  deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/profile`, { headers: this.getHeaders() });
  }
}
