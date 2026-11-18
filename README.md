# RR Constructiva Group S.A.C.

Aplicación web de presentación corporativa y seguimiento de avances de proyectos, desarrollada con Angular.

## Tecnologías
- Angular y TypeScript: componentes, navegación y lógica de interfaz.
- HTML y CSS: estructura y presentación adaptable.
- Angular Router: navegación entre páginas y protección de rutas del panel.
- localStorage / sessionStorage: persistencia local de usuarios y avances en el navegador.

> **Arquitectura actual:** este paquete contiene el Frontend Angular. La autenticación y los registros de usuarios/avances son una demostración local basada en almacenamiento del navegador; no existe un servidor Backend ni una base de datos central. No usar las credenciales de demostración para información real ni publicar así en producción. Para producción se debe implementar una API Backend, base de datos y autenticación segura del lado del servidor.

## Requisitos
- Node.js 22.22.3 o superior dentro de la rama 22 (o una versión compatible con Angular CLI 22).
- npm.

## Instalación y ejecución
Desde la carpeta del proyecto:

```bash
npm install
npm start
```

Abre la URL local que muestre Angular CLI, normalmente `http://localhost:4200`.

## Compilar para producción
```bash
npm run build
```

## Acceso de demostración
- Administrador: `Jorge@gmail.com` / `123456789` (rol Administrador).
- Usuario: `Pedro@gmail.com` / `987654321` (rol Usuario).

Estas credenciales están definidas en el servicio local de demostración. Cámbialas y sustituye la autenticación local antes de desplegar el sitio.

## Secciones
- Inicio, Nosotros, Servicios, Proyectos y Contacto.
- Acceso al panel de seguimiento.
- Visualización de avances por usuario.
- Gestión local de avances y usuarios para el rol administrador.

## Estructura principal
- `src/app/modulo-inicio`: página principal y sus secciones.
- `src/app/modulo-nosotros`: información corporativa.
- `src/app/modulo-servicios`: catálogo de servicios.
- `src/app/modulo-proyectos`: proyectos.
- `src/app/modulo-contacto`: formulario de contacto.
- `src/app/modulo-login`: acceso y panel de seguimiento.
- `src/app/services`: servicios de sesión, usuarios y avances.
- `public/img-carrusel`: imágenes locales utilizadas por el sitio.
