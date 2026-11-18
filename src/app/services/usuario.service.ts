import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';

const CLAVE_USUARIOS = 'rr_usuarios';
const CLAVE_SESION = 'rr_sesion';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarios: Usuario[] = this.cargar();

  // ---------- Almacenamiento (localStorage) ----------
  private cargar(): Usuario[] {
    try {
      const datos = localStorage.getItem(CLAVE_USUARIOS);
      if (datos) return JSON.parse(datos);
    } catch {}
    return [
      { idusuario: 1, nombrelogin: 'Jorge@gmail.com', nombreusuario: 'Jorge', apellidosusuario: 'Huaman Pillaca', contrasena: '123456789', rol: 'admin' },
      { idusuario: 2, nombrelogin: 'Pedro@gmail.com', nombreusuario: 'Pedro', apellidosusuario: 'Sulca Ramos', contrasena: '987654321', rol: 'user' },
      { idusuario: 3, nombrelogin: 'Mario@gmail.com', nombreusuario: 'Mario', apellidosusuario: 'Perez Oré', contrasena: '987654321', rol: 'user' },
    ];
  }

  private guardar(): void {
    try {
      localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(this.usuarios));
    } catch {}
  }

  // ---------- Sesión ----------
  autenticarUsuario(nombrelogin: string, contrasena: string, rol: string): boolean {
    const usuario = this.usuarios.find(
      u => u.nombrelogin?.toLowerCase() === nombrelogin.trim().toLowerCase() &&
           u.contrasena === contrasena && u.rol === rol
    );
    if (usuario) {
      sessionStorage.setItem(CLAVE_SESION, String(usuario.idusuario));
      return true;
    }
    return false;
  }

  usuarioActual(): Usuario | null {
    const id = Number(sessionStorage.getItem(CLAVE_SESION));
    return this.usuarios.find(u => u.idusuario === id) ?? null;
  }

  estaLogueado(): boolean {
    return this.usuarioActual() !== null;
  }

  esAdmin(): boolean {
    return this.usuarioActual()?.rol === 'admin';
  }

  cerrarSesion(): void {
    sessionStorage.removeItem(CLAVE_SESION);
  }

  // ---------- CRUD ----------
  verUsuarios(): Usuario[] {
    return this.usuarios;
  }

  crearUsuario(usuario: Usuario): void {
    const nuevoId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.idusuario)) + 1 : 1;
    this.usuarios.push({ ...usuario, idusuario: nuevoId });
    this.guardar();
  }

  editarUsuario(usuario: Usuario): void {
    const index = this.usuarios.findIndex(u => u.idusuario === usuario.idusuario);
    if (index >= 0) {
      this.usuarios[index] = { ...usuario };
      this.guardar();
    }
  }

  eliminarUsuario(id: number): void {
    this.usuarios = this.usuarios.filter(u => u.idusuario !== id);
    this.guardar();
  }

  correoExiste(correo: string, ignorarId?: number): boolean {
    return this.usuarios.some(
      u => u.nombrelogin?.toLowerCase() === correo.trim().toLowerCase() && u.idusuario !== ignorarId
    );
  }
}
