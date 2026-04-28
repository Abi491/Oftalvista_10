import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () => import("./modules/auth/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: "dashboard",
    canActivate: [authGuard],
    children: [
      {
        path: "admin",
        canActivate: [roleGuard],
        data: { roles: [1] },
        loadComponent: () => import("./modules/dashboard/admin/dashboard-admin.component").then(m => m.DashboardAdminComponent)
      },
      {
        path: "paciente",
        canActivate: [roleGuard],
        data: { roles: [2] },
        loadComponent: () => import("./modules/dashboard/paciente/dashboard-paciente.component").then(m => m.DashboardPacienteComponent)
      }
    ]
  },
  {
    path: "mantenimiento",
    canActivate: [authGuard, roleGuard],
    data: { roles: [1] },
    children: [
      { path: "especialidades",  loadComponent: () => import("./modules/especialidad-medica/list/especialidad-list.component").then(m => m.EspecialidadListComponent) },
      { path: "usuarios",        loadComponent: () => import("./modules/usuario/list/usuario-list.component").then(m => m.UsuarioListComponent) },
      { path: "medicos",         loadComponent: () => import("./modules/medico/list/medico-list.component").then(m => m.MedicoListComponent) },
      { path: "pacientes",       loadComponent: () => import("./modules/paciente/list/paciente-list.component").then(m => m.PacienteListComponent) },
      { path: "agenda-medica",   loadComponent: () => import("./modules/agenda-medica/list/agenda-medica-list.component").then(m => m.AgendaMedicaListComponent) }
    ]
  },
  {
    path: "operaciones",
    canActivate: [authGuard],
    children: [
      { path: "citas",           loadComponent: () => import("./modules/cita/list/cita-list.component").then(m => m.CitaListComponent) },
      { path: "pagos",           loadComponent: () => import("./modules/pago-cita/list/pago-cita-list.component").then(m => m.PagoCitaListComponent) },
      { path: "historial-citas", loadComponent: () => import("./modules/historial-cita/list/historial-cita-list.component").then(m => m.HistorialCitaListComponent) },
      { path: "recordatorios",   loadComponent: () => import("./modules/recordatorio-cita/list/recordatorio-cita-list.component").then(m => m.RecordatorioCitaListComponent) }
    ]
  },
  { path: "**", redirectTo: "login" }
];
