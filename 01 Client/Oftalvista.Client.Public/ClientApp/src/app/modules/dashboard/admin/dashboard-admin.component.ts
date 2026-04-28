import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../../shared/components/topbar/topbar.component';
@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, SidebarComponent, TopbarComponent],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent {
  kpis = [
    { t: 'Citas del dia', v: '128', bg: 'linear-gradient(135deg,#1e3a8a,#2563eb)', i: 'event' },
    {
      t: 'Ingresos del dia',
      v: 'S/ 4,860',
      bg: 'linear-gradient(135deg,#0f766e,#06b6d4)',
      i: 'payments',
    },
    {
      t: 'Pacientes activos',
      v: '1,245',
      bg: 'linear-gradient(135deg,#7c3aed,#9333ea)',
      i: 'people',
    },
    {
      t: 'Medicos activos',
      v: '18',
      bg: 'linear-gradient(135deg,#b45309,#f59e0b)',
      i: 'medical_services',
    },
  ];
}
