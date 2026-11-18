import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { AvanceService } from '../../../services/avance.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-usuarios',
  styleUrl: './usuarios.css',
  templateUrl: './usuarios.html',
})
export class Usuarios {
  lista: Usuario[] = [];
  form: Usuario = this.vacio();
  editando = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(private usuarioService: UsuarioService, private avanceService: AvanceService) {
    this.recargar();
  }

  private recargar(): void {
    this.lista = [...this.usuarioService.verUsuarios()];
  }

  private vacio(): Usuario {
    return { idusuario: 0, nombrelogin: '', nombreusuario: '', apellidosusuario: '', contrasena: '', rol: 'user' };
  }

  guardar(): void {
    const f = this.form;
    if (!f.nombreusuario || !f.apellidosusuario || !f.nombrelogin || !f.contrasena || !f.rol) {
      this.mostrar('Complete todos los campos', 'error');
      return;
    }
    if (this.usuarioService.correoExiste(f.nombrelogin, this.editando ? f.idusuario : undefined)) {
      this.mostrar('Ese usuario (correo) ya existe', 'error');
      return;
    }
    if (this.editando) {
      this.usuarioService.editarUsuario(f);
      this.mostrar('Usuario actualizado', 'exito');
    } else {
      this.usuarioService.crearUsuario(f);
      this.mostrar('Usuario creado', 'exito');
    }
    this.cancelar();
    this.recargar();
  }

  editar(u: Usuario): void {
    this.form = { ...u };
    this.editando = true;
    this.mensaje = '';
  }

  eliminar(u: Usuario): void {
    if (u.idusuario === this.usuarioService.usuarioActual()?.idusuario) {
      this.mostrar('No puedes eliminar tu propio usuario', 'error');
      return;
    }
    if (confirm(`¿Eliminar a ${u.nombreusuario} ${u.apellidosusuario} y todos sus avances?`)) {
      this.avanceService.eliminarPorUsuario(u.idusuario);
      this.usuarioService.eliminarUsuario(u.idusuario);
      this.mostrar('Usuario eliminado', 'exito');
      this.recargar();
    }
  }

  cancelar(): void {
    this.form = this.vacio();
    this.editando = false;
  }

  private mostrar(texto: string, tipo: 'exito' | 'error'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }
}
