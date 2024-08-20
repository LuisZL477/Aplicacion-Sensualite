import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/users';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: User | null = null;

  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

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
        this.showErrorAlert('Error al cargar los detalles del usuario.');
      }
    );
  }

  editUser(): void {
    this.router.navigate(['/edit-user']);
  }

  deleteUser(): void {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      heightAuto: false, // Desactiva la altura automática
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
        cancelButton: 'swal2-mobile-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser().subscribe(
          () => {
            localStorage.removeItem('token'); // Limpia el token almacenado
            this.router.navigate(['/login']); // Redirige al login
            this.showSuccessAlert('Perfil eliminado correctamente.');
          },
          (error) => {
            console.error('Error al eliminar el perfil del usuario:', error);
            this.showErrorAlert('No se pudo eliminar el perfil. Inténtalo de nuevo.');
          }
        );
      }
    });
  }

  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#d33',
      heightAuto: false, // Desactiva la altura automática
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
      }
    });
  }

  showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      confirmButtonColor: '#3085d6',
      heightAuto: false, // Desactiva la altura automática
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
      }
    });
  }
}
