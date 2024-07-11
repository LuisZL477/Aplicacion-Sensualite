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
  username: string = '';
  last_name: string = '';
  age: number | undefined;
  email: string = '';
  address: string = '';
  tel: number | undefined;
  password: string = '';
  confirmpassword: string = '';
  loading: boolean = false;


  constructor(private toastr: ToastrService, private _userService: UserService, private router: Router) {}

  togglePasswordVisibility(inputType: string) {
    const passwordInput = document.getElementsByName(inputType)[0] as HTMLIonInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
  

  addUser() {
    // Validar que el usuario ingrese campos
    if (!this.username || !this.last_name || this.age === undefined || !this.email || !this.address || this.tel === undefined || !this.password || !this.confirmpassword) {
      this.toastr.warning('Todos los campos son obligatorios', 'Campos vacíos');
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmpassword) {
      this.toastr.warning('Las contraseñas no coinciden', 'Contraseña inválida');
      return;
    }

    // Creamos el objeto
    const user: User = {
      id: 0, 
      username: this.username,
      last_name: this.last_name,
      age: this.age,
      email: this.email,
      password: this.password,
      address: this.address,
      tel: this.tel,
    };

    this.loading = true;
    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(`El usuario ${this.username} con la cuenta ${this.email} fue registrado con éxito`, 'Usuario registrado');
        this.router.navigate(['/auth']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.msjError(e);
      }
    })

    console.log('Username:', this.username);
    console.log('Last Name:', this.last_name);
    console.log('Age:', this.age);
    console.log('Email:', this.email);
    console.log('Address:', this.address);
    console.log('Tel:', this.tel);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmpassword);

  
    this.username = '';
    this.last_name = '';
    this.age = undefined;
    this.email = '';
    this.address = '';
    this.tel = undefined;
    this.password = '';
    this.confirmpassword = '';

  }

  msjError(e: HttpErrorResponse){
    if(e.error.msg){
      this.toastr.error(e.error.msg, ' Error');
    } else {
      this.toastr.error('¡A ocurrido un error con el servidor, comuniquese con el administrador', ' Error servidor');
    }
  }

}
