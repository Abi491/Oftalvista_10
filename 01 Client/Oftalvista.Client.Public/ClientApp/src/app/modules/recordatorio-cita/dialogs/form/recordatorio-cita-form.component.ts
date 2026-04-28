import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { RecordatorioCitaService } from '../../../../core/services/recordatorio-cita.service';
import { catalogoItem } from '../../../../core/models/catalogo.model';
@Component({
  selector: 'app-recordatorio-cita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './recordatorio-cita-form.component.html',
})
export class RecordatorioCitaFormComponent implements OnInit {
  esEdicion = false;
  loading = false;
  citas: catalogoItem[] = [];
  estadosRecordatorio: catalogoItem[] = [];
  estadosVigencia: catalogoItem[] = [];
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private svc: RecordatorioCitaService,
    private cat: CatalogoService,
    public ref: MatDialogRef<RecordatorioCitaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      idCita: [null as any, [Validators.required]],
      idEstadoRecordatorio: [null as any, [Validators.required]],
      idTblEstadoVigencia: [null as any, [Validators.required]],
      fechaProgramada: [null as any, [Validators.required]],
      fechaEnvio: [null as any],
      mensaje: [null as any, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.cat.getCitas().subscribe((r) => (this.citas = r));
    this.cat.getEstadosRecordatorio().subscribe((r) => (this.estadosRecordatorio = r));
    this.cat.getEstadosVigencia().subscribe((r) => (this.estadosVigencia = r));
    if (this.data) {
      this.esEdicion = true;
      this.form.patchValue(this.data);
    }
  }
  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    const body = this.form.value;
    const op = this.esEdicion
      ? this.svc.editar(this.data.guid ?? '', {
          ...body,
          guidRecordatorioCita: this.data.guid,
        } as any)
      : this.svc.crear(body as any);
    op.subscribe({
      next: () => {
        this.loading = false;
        this.ref.close(true);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
