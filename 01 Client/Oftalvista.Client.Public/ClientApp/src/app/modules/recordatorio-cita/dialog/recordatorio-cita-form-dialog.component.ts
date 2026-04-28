import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { RecordatorioCitaService } from "../../../core/services/recordatorio-cita.service";
import { RecordatorioCitaItemsDto } from "../../../core/models/recordatorio-cita.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-recordatorio-cita-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./recordatorio-cita-form-dialog.component.html"
})
export class RecordatorioCitaFormDialogComponent implements OnInit {
  private svc   = inject(RecordatorioCitaService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  catalogoSvc   = inject(CatalogoService);
  estados       = this.catalogoSvc.getEstadoRecordatorio();
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidRecordatorioCita:  [null as string|null],
    idCita:                [null as number|null, Validators.required],
    idEstadoRecordatorio:  [null as number|null, Validators.required],
    fechaProgramada:       ["", Validators.required],
    fechaEnvio:            [null as string|null],
    mensaje:               ["", Validators.required]
  });

  constructor(
    public ref: MatDialogRef<RecordatorioCitaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecordatorioCitaItemsDto | null
  ) {}

  ngOnInit() {
    if (this.data) {
      this.esEdicion = true;
      this.svc.getById(this.data.idRecordatorioCita.toString()).subscribe(item => this.form.patchValue(item as any));
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value as any;
    const op = this.esEdicion ? this.svc.editar(payload) : this.svc.crear(payload);
    op.subscribe({
      next: () => { this.snack.open(this.esEdicion?"Actualizado":"Registrado","Cerrar",{duration:3000}); this.loading=false; this.ref.close(true); },
      error: () => { this.loading=false; }
    });
  }
}
