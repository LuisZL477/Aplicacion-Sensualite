import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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
        this.toastr.error('Error al cargar los datos del usuario', 'Error');
      }
    });
  }

  saveUser() {
    // Validar que los campos no estén vacíos
    if (!this.user.nombre || !this.user.apellido || this.user.edad === undefined || !this.user.correo || !this.user.domicilio || this.user.telefono === undefined) {
      this.toastr.warning('Todos los campos son obligatorios', 'Campos vacíos');
      return;
    }

    this.loading = true;
    this._userService.updateUser(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Los datos del usuario fueron actualizados con éxito', 'Usuario actualizado');
        this.router.navigate(['/perfil']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.msjError(e);
      }
    });
  }

  msjError(e: HttpErrorResponse) {
    if (e.error.msg) {
      this.toastr.error(e.error.msg, 'Error');
    } else {
      this.toastr.error('¡Ha ocurrido un error con el servidor, comuníquese con el administrador!', 'Error servidor');
    }
  }
}
