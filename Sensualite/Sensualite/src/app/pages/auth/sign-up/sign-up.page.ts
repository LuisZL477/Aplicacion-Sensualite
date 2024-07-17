import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService, 
    private _userService: UserService, 
    private router: Router
  ) {}

  togglePasswordVisibility(inputType: string) {
    const passwordInput = document.getElementsByName(inputType)[0] as HTMLIonInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  addUser() {
    // Validar que el usuario ingrese campos
    if (!this.nombre || !this.apellido || this.edad === undefined || !this.correo || !this.domicilio || this.telefono === undefined || !this.password || !this.confirmpassword) {
      this.toastr.warning('Todos los campos son obligatorios', 'Campos vacíos');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmpassword) {
      this.toastr.warning('Las contraseñas no coinciden', 'Contraseña inválida');
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
      next: (v) => {
        this.loading = false;
        this.toastr.success(`El usuario ${user.nombre} con la cuenta ${user.correo} fue registrado con éxito`, 'Usuario registrado');
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
      this.toastr.error(e.error.msg, 'Error');
    } else {
      this.toastr.error('¡Ha ocurrido un error con el servidor, comuníquese con el administrador!', 'Error servidor');
    }
  }
}
