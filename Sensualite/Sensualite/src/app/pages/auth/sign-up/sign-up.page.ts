import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import { User } from 'src/app/interfaces/users';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {

  @ViewChild('passwordInput', { static: false }) passwordInput: IonInput | undefined;
  @ViewChild('confirmpasswordInput', { static: false }) confirmpasswordInput: IonInput | undefined;

  nombre: string = '';
  apellido: string = '';
  edad: number | undefined;
  correo: string = '';
  domicilio: string = '';
  telefono: number | undefined;
  password: string = '';
  confirmpassword: string = '';
  loading: boolean = false;

  constructor(
    private _userService: UserService, 
    private router: Router
  ) {}

  togglePasswordVisibility(inputType: string) {
    if (inputType === 'password' && this.passwordInput) {
      this.passwordInput.type = this.passwordInput.type === 'password' ? 'text' : 'password';
    } else if (inputType === 'confirmpassword' && this.confirmpasswordInput) {
      this.confirmpasswordInput.type = this.confirmpasswordInput.type === 'password' ? 'text' : 'password';
    }
  }

  addUser() {
    // Validar que el usuario ingrese campos
    if (!this.nombre || !this.apellido || this.edad === undefined || !this.correo || !this.domicilio || this.telefono === undefined || !this.password || !this.confirmpassword) {
      this.showWarningAlert('Todos los campos son obligatorios');
      return;
    }

    // Validar la edad mínima
    if (this.edad < 18) {
      this.showWarningAlert('Debes tener al menos 18 años para registrarte.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmpassword) {
      this.showWarningAlert('Las contraseñas no coinciden');
      return;
    }

    // Crear el objeto usuario
    const user: User = {
      id: 0, 
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad,
      correo: this.correo,
      password: this.password,
      domicilio: this.domicilio,
      telefono: this.telefono,
    };

    this.loading = true;
    this._userService.signIn(user).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccessAlert(`El usuario ${user.nombre} con la cuenta ${user.correo} fue registrado con éxito`);
        this.router.navigate(['/auth']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.msjError(e);
      }
    });

    // Limpiar los campos del formulario
    this.nombre = '';
    this.apellido = '';
    this.edad = undefined;
    this.correo = '';
    this.domicilio = '';
    this.telefono = undefined;
    this.password = '';
    this.confirmpassword = '';
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
