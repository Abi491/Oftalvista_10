import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material.module';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { CitaService } from '../../../../core/services/cita.service';
import { catalogoItem } from '../../../../core/models/catalogo.model';
@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './cita-form.component.html',
})
export class CitaFormComponent implements OnInit {
  esEdicion = false;
  loading = false;
  pacientes: catalogoItem[] = [];
  medicos: catalogoItem[] = [];
  estadosCita: catalogoItem[] = [];
  modalidades: catalogoItem[] = [];
  estadosVigencia: catalogoItem[] = [];
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private svc: CitaService,
    private cat: CatalogoService,
    public ref: MatDialogRef<CitaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      idPaciente: [null as any, [Validators.required]],
      idMedico: [null as any, [Validators.required]],
      idAgendaMedica: [null as any, [Validators.required]],
      idEstadoCita: [null as any, [Validators.required]],
      idModalidadCita: [null as any, [Validators.required]],
      idTblEstadoVigencia: [null as any, [Validators.required]],
      fechaCita: [null as any, [Validators.required]],
      horaCita: [null as any, [Validators.required]],
      motivo: [null as any, [Validators.required]],
      observacion: [null as any],
    });
  }
  ngOnInit(): void {
    this.cat.getPacientes().subscribe((r) => (this.pacientes = r));
    this.cat.getMedicos().subscribe((r) => (this.medicos = r));
    this.cat.getEstadosCita().subscribe((r) => (this.estadosCita = r));
    this.cat.getModalidadesCita().subscribe((r) => (this.modalidades = r));
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
      ? this.svc.editar(this.data.guid ?? '', { ...body, guidCita: this.data.guid } as any)
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
