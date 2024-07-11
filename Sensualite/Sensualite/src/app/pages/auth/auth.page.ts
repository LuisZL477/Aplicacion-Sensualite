import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  email: string = '';
  password: string = '';

  constructor(private toastr: ToastrService, private _userService: UserService,
    private router: Router ) {   }


  login() {

    //Validamos que el usuario ingrese datos

    if(this.email == '' || this.password == ''){
      this.toastr.warning('Todos los campos son obligatorios', 'Campos vacíos');
      return;
    }

    // Creamos el body

    const user: User= {
      id:0,
      email: this.email,
      password: this.password,
    }

    this._userService.login(user).subscribe({
      next: (token) => {
        this.router.navigate(['/dashboard'])
        localStorage.setItem('token', token )
      },
      error: (e: HttpErrorResponse) => {
        this.msjError(e);
      }
    })
  }
   
  togglePasswordVisibility(inputType: string) {
    const passwordInput = document.getElementsByName(inputType)[0] as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }

  msjError(e: HttpErrorResponse){
    if(e.error.msg){
      this.toastr.error(e.error.msg, ' Error');
    } else {
      this.toastr.error('¡A ocurrido un error con el servidor, comuniquese con el administrador', ' Error servidor');
    }
  }

}
