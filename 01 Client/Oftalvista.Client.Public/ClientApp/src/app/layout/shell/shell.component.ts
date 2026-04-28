import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MaterialModule } from "../../shared/material.module";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: "./shell.component.html"
})
export class ShellComponent {
  auth   = inject(AuthService);
  router = inject(Router);
  user   = this.auth.getUser();
  isAdmin = this.auth.getRol() === 1;

  menuAdmin = [
    { label: "Dashboard",       icon: "dashboard",      route: "/dashboard/admin" },
    { label: "Especialidades",  icon: "local_hospital",  route: "/mantenimiento/especialidades" },
    { label: "Usuarios",        icon: "manage_accounts", route: "/mantenimiento/usuarios" },
    { label: "Médicos",         icon: "medical_services",route: "/mantenimiento/medicos" },
    { label: "Pacientes",       icon: "people",          route: "/mantenimiento/pacientes" },
    { label: "Agenda Médica",   icon: "event",           route: "/mantenimiento/agenda-medica" },
    { label: "Citas",           icon: "calendar_today",  route: "/operaciones/citas" },
    { label: "Pagos",           icon: "payments",        route: "/operaciones/pagos" },
    { label: "Historial Citas", icon: "history",         route: "/operaciones/historial-citas" },
    { label: "Recordatorios",   icon: "notifications",   route: "/operaciones/recordatorios" }
  ];

  menuPaciente = [
    { label: "Mis Citas",    icon: "calendar_today", route: "/operaciones/citas" },
    { label: "Mis Pagos",    icon: "payments",       route: "/operaciones/pagos" },
    { label: "Mi Historial", icon: "history",        route: "/operaciones/historial-citas" }
  ];

  get menu() { return this.isAdmin ? this.menuAdmin : this.menuPaciente; }
  logout() { this.auth.logout(); }
}
