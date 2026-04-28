import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MaterialModule } from "../../../shared/material.module";

@Component({
  selector: "app-dashboard-admin",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./dashboard-admin.component.html"
})
export class DashboardAdminComponent {
  router = inject(Router);
  accesos = [
    { label:"Especialidades",  icon:"local_hospital",   route:"/mantenimiento/especialidades",  color:"#3f51b5" },
    { label:"Usuarios",        icon:"manage_accounts",  route:"/mantenimiento/usuarios",         color:"#7b1fa2" },
    { label:"Médicos",         icon:"medical_services", route:"/mantenimiento/medicos",          color:"#0288d1" },
    { label:"Pacientes",       icon:"people",           route:"/mantenimiento/pacientes",        color:"#00897b" },
    { label:"Agenda Médica",   icon:"event",            route:"/mantenimiento/agenda-medica",    color:"#f57c00" },
    { label:"Citas",           icon:"calendar_today",   route:"/operaciones/citas",              color:"#c0392b" },
    { label:"Pagos",           icon:"payments",         route:"/operaciones/pagos",              color:"#27ae60" },
    { label:"Historial Citas", icon:"history",          route:"/operaciones/historial-citas",    color:"#8e44ad" },
    { label:"Recordatorios",   icon:"notifications",    route:"/operaciones/recordatorios",      color:"#d35400" }
  ];
  ir(route: string) { this.router.navigate([route]); }
}
