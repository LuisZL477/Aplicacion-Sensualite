import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from 'src/app/interfaces/users';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.page.html',
  styleUrls: ['./edituser.page.scss'],
})
export class EdituserPage implements OnInit {
  user: User = {
    id: 0, 
    nombre: '',
    apellido: '',
    edad: undefined,
    correo: '',
    domicilio: '',
    telefono: undefined,
    password: '', // Si no se requiere cambiar la contraseña, se puede omitir
  };
  loading: boolean = false;

  constructor(
    private _userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this._userService.getUserDetails().subscribe({
      next: (data: User) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error al obtener detalles del usuario:', error);
        this.showErrorAlert('Error al cargar los datos del usuario');
      }
    });
  }

  saveUser() {
    // Validar que los campos no estén vacíos
    if (!this.user.nombre || !this.user.apellido || this.user.edad === undefined || !this.user.correo || !this.user.domicilio || this.user.telefono === undefined) {
      this.showWarningAlert('Todos los campos son obligatorios');
      return;
    }

    this.loading = true;
    this._userService.updateUser(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccessAlert('Los datos del usuario fueron actualizados con éxito').then(() => {
          this.router.navigate(['/perfil']).then(() => {
            window.location.reload();  // Recarga la página para mostrar los cambios
          });
        });
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.msjError(e);
      }
    });
  }

  msjError(e: HttpErrorResponse) {
    if (e.error.msg) {
      this.showErrorAlert(e.error.msg);
    } else {
      this.showErrorAlert('¡Ha ocurrido un error con el servidor, comuníquese con el administrador!');
    }
  }

  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#d33',
      heightAuto: false, // Desactiva el ajuste automático de la altura
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
      }
    });
  }

  showSuccessAlert(message: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      confirmButtonColor: '#3085d6',
      heightAuto: false, // Desactiva el ajuste automático de la altura
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
      }
    });
  }

  showWarningAlert(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: message,
      confirmButtonColor: '#f39c12',
      heightAuto: false, // Desactiva el ajuste automático de la altura
      customClass: {
        popup: 'swal2-mobile-popup', // Clase CSS personalizada
        title: 'swal2-mobile-title',
        confirmButton: 'swal2-mobile-confirm',
      }
    });
  }
}
