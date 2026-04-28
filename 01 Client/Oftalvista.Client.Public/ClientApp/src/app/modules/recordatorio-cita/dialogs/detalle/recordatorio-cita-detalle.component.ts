import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
@Component({
  selector: 'app-recordatorio-cita-detalle',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './recordatorio-cita-detalle.component.html',
})
export class RecordatorioCitaDetalleComponent {
  constructor(
    public ref: MatDialogRef<RecordatorioCitaDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
}
