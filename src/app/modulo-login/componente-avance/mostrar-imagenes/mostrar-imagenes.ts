import { Component, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { AvanceService } from '../../../services/avance.service';
import { ImagenPorUsuario } from '../../../models/areglos-objetos';
import { AvanceModel } from '../../../models/avance.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mostrar-imagenes',
  styleUrl: './mostrar-imagenes.css',
  templateUrl: './mostrar-imagenes.html',
})
export class MostrarImagenes {
  Usuarios: ImagenPorUsuario[] = [];
  esAdmin = false;

  modalForm = viewChild.required<ElementRef<HTMLDialogElement>>('modalForm');
  modalDel = viewChild.required<ElementRef<HTMLDialogElement>>('modalDel');

  modo: 'agregar' | 'editar' = 'agregar';
  form: AvanceModel = this.vacio(0);
  avanceAEliminar: AvanceModel | null = null;
  error = '';

  imagenesDisponibles = [
    'img-carrusel/cons1.jpg',
    'img-carrusel/cons2.jpg',
    'img-carrusel/cons3.jpg',
    'img-carrusel/cons4.jpg',
    'img-carrusel/cons5.jpg',
  ];

  constructor(private avanceService: AvanceService, private usuarioService: UsuarioService) {
    this.esAdmin = this.usuarioService.esAdmin();
    this.recargar();
  }

  private recargar(): void {
    this.Usuarios = this.avanceService.filtroPorUsuarios();
  }

  private vacio(idUsuario: number): AvanceModel {
    return {
      id: 0,
      idUsuario,
      rutaImagen: 'img-carrusel/cons1.jpg',
      fecha: new Date().toISOString().substring(0, 10),
      porcentaje: 0,
      descripcion: '',
    };
  }

  // ----- AGREGAR -----
  abrirAgregar(idUsuario: number): void {
    this.modo = 'agregar';
    this.form = this.vacio(idUsuario);
    this.error = '';
    this.modalForm().nativeElement.showModal();
  }

  // ----- EDITAR -----
  abrirEditar(avance: AvanceModel): void {
    this.modo = 'editar';
    this.form = { ...avance };
    this.error = '';
    this.modalForm().nativeElement.showModal();
  }

  async subirArchivo(evento: Event): Promise<void> {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    try {
      this.form.rutaImagen = await this.avanceService.reducirImagen(archivo);
    } catch {
      this.error = 'No se pudo leer la imagen';
    }
  }

  guardar(): void {
    if (!this.form.fecha || this.form.porcentaje === null || this.form.porcentaje === undefined) {
      this.error = 'Complete la fecha y el porcentaje';
      return;
    }
    if (this.form.porcentaje < 0 || this.form.porcentaje > 100) {
      this.error = 'El porcentaje debe estar entre 0 y 100';
      return;
    }
    if (this.modo === 'agregar') {
      const { id, ...nuevo } = this.form;
      this.avanceService.agregar(nuevo);
    } else {
      this.avanceService.editar(this.form);
    }
    this.cerrarForm();
    this.recargar();
  }

  cerrarForm(): void {
    this.modalForm().nativeElement.close();
  }

  // ----- ELIMINAR -----
  abrirEliminar(avance: AvanceModel): void {
    this.avanceAEliminar = avance;
    this.modalDel().nativeElement.showModal();
  }

  confirmarEliminar(): void {
    if (this.avanceAEliminar) {
      this.avanceService.eliminar(this.avanceAEliminar.id);
    }
    this.avanceAEliminar = null;
    this.modalDel().nativeElement.close();
    this.recargar();
  }

  cancelarEliminar(): void {
    this.avanceAEliminar = null;
    this.modalDel().nativeElement.close();
  }
}
