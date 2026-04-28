import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MaterialModule } from "../../../shared/material.module";

@Component({
  selector: "app-dashboard-paciente",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="page-container">
      <h2 style="color:#3f51b5">Bienvenido a Oftalvista</h2>
      <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:24px">
        <mat-card (click)="router.navigate(['/operaciones/citas'])" style="cursor:pointer; padding:24px; min-width:180px; text-align:center; border-top:4px solid #3f51b5">
          <mat-icon style="font-size:40px; width:40px; height:40px; color:#3f51b5">calendar_today</mat-icon>
          <p style="margin:12px 0 0; font-weight:500">Mis Citas</p>
        </mat-card>
        <mat-card (click)="router.navigate(['/operaciones/pagos'])" style="cursor:pointer; padding:24px; min-width:180px; text-align:center; border-top:4px solid #27ae60">
          <mat-icon style="font-size:40px; width:40px; height:40px; color:#27ae60">payments</mat-icon>
          <p style="margin:12px 0 0; font-weight:500">Mis Pagos</p>
        </mat-card>
        <mat-card (click)="router.navigate(['/operaciones/historial-citas'])" style="cursor:pointer; padding:24px; min-width:180px; text-align:center; border-top:4px solid #8e44ad">
          <mat-icon style="font-size:40px; width:40px; height:40px; color:#8e44ad">history</mat-icon>
          <p style="margin:12px 0 0; font-weight:500">Mi Historial</p>
        </mat-card>
      </div>
    </div>
  `
})
export class DashboardPacienteComponent { router = inject(Router); }
