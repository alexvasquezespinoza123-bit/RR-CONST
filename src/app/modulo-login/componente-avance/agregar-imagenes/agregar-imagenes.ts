import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { AvanceService } from '../../../services/avance.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-agregar-imagenes',
  styleUrl: './agregar-imagenes.css',
  templateUrl: './agregar-imagenes.html',
})
export class AgregarImagenes {
  usuarios: Usuario[] = [];
  imagenesDisponibles = [
    'img-carrusel/cons1.jpg',
    'img-carrusel/cons2.jpg',
    'img-carrusel/cons3.jpg',
    'img-carrusel/cons4.jpg',
    'img-carrusel/cons5.jpg',
  ];

  idUsuario: number | null = null;
  rutaImagen = this.imagenesDisponibles[0];
  fecha = new Date().toISOString().substring(0, 10);
  porcentaje: number | null = null;
  descripcion = '';

  mensaje = '';
  tipoMensaje: 'exito' | 'error' | '' = '';

  constructor(private usuarioService: UsuarioService, private avanceService: AvanceService) {
    this.usuarios = this.usuarioService.verUsuarios();
  }

  async subirArchivo(evento: Event): Promise<void> {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    try {
      this.rutaImagen = await this.avanceService.reducirImagen(archivo);
    } catch {
      this.mostrar('No se pudo leer la imagen', 'error');
    }
  }

  guardar(): void {
    if (this.idUsuario === null || !this.rutaImagen || !this.fecha || this.porcentaje === null) {
      this.mostrar('Complete usuario, imagen, fecha y porcentaje', 'error');
      return;
    }
    if (this.porcentaje < 0 || this.porcentaje > 100) {
      this.mostrar('El porcentaje debe estar entre 0 y 100', 'error');
      return;
    }
    this.avanceService.agregar({
      idUsuario: Number(this.idUsuario),
      rutaImagen: this.rutaImagen,
      fecha: this.fecha,
      porcentaje: this.porcentaje,
      descripcion: this.descripcion,
    });
    this.mostrar('Avance guardado correctamente', 'exito');
    this.limpiar();
  }

  limpiar(): void {
    this.porcentaje = null;
    this.descripcion = '';
    this.rutaImagen = this.imagenesDisponibles[0];
  }

  private mostrar(texto: string, tipo: 'exito' | 'error'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }
}
