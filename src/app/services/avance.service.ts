import { Injectable } from '@angular/core';
import { AvanceModel } from '../models/avance.model';
import { ImagenPorUsuario } from '../models/areglos-objetos';
import { UsuarioService } from './usuario.service';

const CLAVE_AVANCES = 'rr_avances';

@Injectable({ providedIn: 'root' })
export class AvanceService {
  private imagenes: AvanceModel[] = this.cargar();

  constructor(private usuarioService: UsuarioService) {}

  // ---------- Almacenamiento (localStorage) ----------
  private cargar(): AvanceModel[] {
    try {
      const datos = localStorage.getItem(CLAVE_AVANCES);
      if (datos) return JSON.parse(datos);
    } catch {}
    return [
      { id: 1, rutaImagen: 'img-carrusel/cons1.jpg', idUsuario: 1, fecha: '2026-12-15', porcentaje: 50, descripcion: 'Por culminar la primera parte' },
      { id: 2, rutaImagen: 'img-carrusel/cons2.jpg', idUsuario: 2, fecha: '2026-12-15', porcentaje: 10, descripcion: 'Por culminar la primera parte' },
      { id: 3, rutaImagen: 'img-carrusel/cons5.jpg', idUsuario: 3, fecha: '2026-09-15', porcentaje: 10, descripcion: 'Por culminar la primera parte' },
      { id: 4, rutaImagen: 'img-carrusel/cons4.jpg', idUsuario: 3, fecha: '2026-12-15', porcentaje: 50, descripcion: 'Por culminar la primera parte' },
    ];
  }

  private guardar(): void {
    try {
      localStorage.setItem(CLAVE_AVANCES, JSON.stringify(this.imagenes));
    } catch {
      alert('No se pudo guardar: la imagen es muy pesada. Usa una imagen más pequeña.');
    }
  }

  // ---------- Lectura ----------
  filtroPorUsuarios(): ImagenPorUsuario[] {
    return this.usuarioService.verUsuarios().map(u => {
      const avances = this.imagenes.filter(a => a.idUsuario === u.idusuario);
      const total = avances.reduce((suma, a) => suma + (a.porcentaje || 0), 0);
      return {
        idusuario: { idUsuario: u.idusuario },
        usuarios: u,
        avances,
        totalporcentaje: Math.min(total, 100),
      };
    });
  }

  // ---------- CRUD ----------
  agregar(avance: Omit<AvanceModel, 'id'>): void {
    const nuevoId = this.imagenes.length > 0 ? Math.max(...this.imagenes.map(a => a.id)) + 1 : 1;
    this.imagenes.push({ ...avance, id: nuevoId });
    this.guardar();
  }

  editar(avance: AvanceModel): void {
    const index = this.imagenes.findIndex(a => a.id === avance.id);
    if (index >= 0) {
      this.imagenes[index] = { ...avance };
      this.guardar();
    }
  }

  eliminar(id: number): void {
    this.imagenes = this.imagenes.filter(a => a.id !== id);
    this.guardar();
  }

  eliminarPorUsuario(idUsuario: number): void {
    this.imagenes = this.imagenes.filter(a => a.idUsuario !== idUsuario);
    this.guardar();
  }

  // Reduce la imagen subida para que quepa en localStorage
  reducirImagen(archivo: File, maxLado = 800): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
      lector.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Archivo no válido'));
        img.onload = () => {
          const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * escala);
          canvas.height = Math.round(img.height * escala);
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = lector.result as string;
      };
      lector.readAsDataURL(archivo);
    });
  }
}
