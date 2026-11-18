import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-modulo-login',
  styleUrl: './modulo-login.css',
  templateUrl: './modulo-login.html',
})
export class ModuloLogin {
  nombreLogin = '';
  constrasena = '';
  mensaje = '';
  rol = 'admin';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {
    if (this.usuarioService.estaLogueado()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    if (!this.nombreLogin || !this.constrasena || !this.rol) {
      this.mensaje = '¡Por favor, complete todos los campos!';
      this.tipoMensaje = 'error';
      return;
    }

    const autenticado = this.usuarioService.autenticarUsuario(this.nombreLogin, this.constrasena, this.rol);

    if (autenticado) {
      this.mensaje = 'Login correcto, ¡Bienvenido!';
      this.tipoMensaje = 'exito';
      this.router.navigate(['/dashboard']);
    } else {
      this.mensaje = 'Usuario, contraseña o rol incorrecto';
      this.tipoMensaje = 'error';
    }
  }
}
