import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from './usuario.service';

export const authGuard: CanActivateFn = () => {
  const usuarios = inject(UsuarioService);
  const router = inject(Router);
  return usuarios.estaLogueado() ? true : router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const usuarios = inject(UsuarioService);
  const router = inject(Router);
  return usuarios.esAdmin() ? true : router.createUrlTree(['/dashboard/verImagenes']);
};
