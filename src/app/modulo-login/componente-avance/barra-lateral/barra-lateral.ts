import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

interface OpcionMenu {
  texto: string;
  ruta: string;
  soloAdmin: boolean;
}

@Component({
  imports: [CommonModule],
  selector: 'app-barra-lateral',
  styleUrl: './barra-lateral.css',
  templateUrl: './barra-lateral.html',
})
export class BarraLateral {
  private todas: OpcionMenu[] = [
    { texto: 'VER AVANCES', ruta: '/dashboard/verImagenes', soloAdmin: false },
    { texto: 'AGREGAR AVANCE', ruta: '/dashboard/agregarImagenes', soloAdmin: true },
    { texto: 'USUARIOS', ruta: '/dashboard/usuarios', soloAdmin: true },
  ];

  opciones: OpcionMenu[];
  nombre: string;

  constructor(private router: Router, private usuarioService: UsuarioService) {
    const esAdmin = this.usuarioService.esAdmin();
    this.opciones = this.todas.filter(o => !o.soloAdmin || esAdmin);
    const u = this.usuarioService.usuarioActual();
    this.nombre = u ? `${u.nombreusuario} (${u.rol})` : '';
  }

  estaActiva(ruta: string): boolean {
    return this.router.url.startsWith(ruta);
  }

  ir(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    this.usuarioService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
