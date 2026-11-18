import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent {
  nombre = '';
  correo = '';
  mensaje = '';

  enviar(): void {
    const asunto = encodeURIComponent(`Consulta web de ${this.nombre.trim()}`);
    const cuerpo = encodeURIComponent(`Nombre: ${this.nombre.trim()}\nCorreo: ${this.correo.trim()}\n\nMensaje:\n${this.mensaje.trim()}`);
    window.location.href = `mailto:contacto@rrconstructiva.com?subject=${asunto}&body=${cuerpo}`;
  }
}
