import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage  {

  constructor(private router: Router) { }

  logout() {
    // Elimina el token del local storage
    localStorage.removeItem('token');

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }

}
