import {Component, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-carrusel',
  templateUrl: 'carrusel.component.html',
  styleUrls: ['carrusel.component.css']
})
export class CarruselComponent implements OnDestroy {
  imagenes = signal<string[]> ([
    "img-carrusel/cons1.jpg",
    "img-carrusel/cons2.jpg",
    "img-carrusel/cons3.jpg",
    "img-carrusel/cons4.jpg",
    "img-carrusel/cons5.jpg",
  ]);
  indiceActual = signal(0)

  private intervalo: ReturnType<typeof setInterval> | undefined;

  constructor() {
    this.intervalo = setInterval(()=>{
      const nuevoIndice = (this.indiceActual()+1)% this.imagenes().length;
      this.indiceActual.set(nuevoIndice);
    }, 3000)
  }
  anterior(): void { this.indiceActual.set((this.indiceActual() - 1 + this.imagenes().length) % this.imagenes().length); }
  siguiente(): void { this.indiceActual.set((this.indiceActual() + 1) % this.imagenes().length); }
  irA(indice: number): void { this.indiceActual.set(indice); }
  ngOnDestroy(): void { if (this.intervalo) clearInterval(this.intervalo); }
}
