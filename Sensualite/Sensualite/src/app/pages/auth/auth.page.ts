import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from 'src/app/interfaces/users';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage  {

  correo: string = '';
  password: string = '';

  constructor(private _userService: UserService, private router: Router) { }

  login() {
    // Validamos que el usuario ingrese datos
    if (this.correo === '' || this.password === '') {
      this.showWarningAlert('Todos los campos son obligatorios');
      return;
    }

    // Creamos el body
    const user: User = {
      id: 0,
      correo: this.correo,
      password: this.password,
    };

    this._userService.login(user).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
        this.showSuccessAlert('Inicio de sesión exitoso');
      },
      error: (e: HttpErrorResponse) => {
        this.msjError(e);
      }
    });
  }

  togglePasswordVisibility(inputType: string) {
    const passwordInput = document.getElementsByName(inputType)[0] as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  msjError(e: HttpErrorResponse) {
    if (e.error.msg) {
      this.showErrorAlert(e.error.msg);
    } else {
      this.showErrorAlert('¡Ha ocurrido un error con el servidor, comuníquese con el administrador!');
    }
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

  showSuccessAlert(message: string): void {
    Swal.fire({
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
}
