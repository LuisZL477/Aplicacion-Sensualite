import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.userService.getUserDetails().subscribe(
      (data: User) => {
        this.user = data;
      },
      (error) => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    );
  }

  editUser(): void {
    this.router.navigate(['/edit-user']);
  }

  deleteUser(): void {
    this.userService.deleteUser().subscribe(() => {
      localStorage.removeItem('token'); // Limpia el token almacenado
      this.router.navigate(['/login']); // Redirige al login
    });
  }
}
