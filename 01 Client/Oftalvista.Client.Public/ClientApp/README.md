# Oftalvista App — Frontend Angular 17

## Requisitos
- Node.js >= 18
- Angular CLI >= 17: `npm install -g @angular/cli`

## Instalación
```bash
npm install
```

## Ejecución local
```bash
ng serve
```
Acceder en: http://localhost:4200

## Configuración del backend
Editar `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api/v1"
};
```

## Estructura de módulos
```
src/app/
├── core/
│   ├── models/          → DTOs tipados (AgendaMedica, Cita, Medico, etc.)
│   ├── services/        → Servicios HTTP por entidad + AuthService + CatalogoService
│   ├── guards/          → authGuard, roleGuard
│   └── interceptors/    → jwtInterceptor, errorInterceptor
├── shared/
│   ├── material.module.ts
│   └── components/confirm-dialog/
├── layout/shell/        → Sidenav + Topbar
└── modules/
    ├── auth/login/
    ├── dashboard/admin | paciente/
    ├── especialidad-medica/   list/ + dialog/
    ├── usuario/               list/ + dialog/
    ├── medico/                list/ + dialog/
    ├── paciente/              list/ + dialog/
    ├── agenda-medica/         list/ + dialog/
    ├── cita/                  list/ + dialog/ (form + detalle)
    ├── pago-cita/             list/ + dialog/
    ├── historial-cita/        list/ (solo lectura)
    └── recordatorio-cita/     list/ + dialog/
```

## Roles
| Rol | idTipoUsuario | Acceso |
|-----|--------------|--------|
| Administrador | 1 | Todo el sistema |
| Paciente | 2 | Citas, Pagos, Historial propios |
| Médico | 3 | Dashboard paciente |

## Tecnologías
- Angular 17 (standalone components)
- Angular Material 17
- Reactive Forms
- JWT via localStorage
- HttpClient con interceptores funcionales
