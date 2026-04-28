import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { PagoCitaService } from "../../../core/services/pago-cita.service";
import { PagoCitaItemsDto } from "../../../core/models/pago-cita.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-pago-cita-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./pago-cita-form-dialog.component.html"
})
export class PagoCitaFormDialogComponent implements OnInit {
  private svc   = inject(PagoCitaService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  catalogoSvc   = inject(CatalogoService);
  metodos       = this.catalogoSvc.getMetodoPago();
  estados       = this.catalogoSvc.getEstadoPago();
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidPagoCita:    [null as string|null],
    idCita:          [null as number|null, Validators.required],
    idMetodoPago:    [null as number|null, Validators.required],
    idEstadoPago:    [null as number|null, Validators.required],
    monto:           [null as number|null, [Validators.required, Validators.min(0)]],
    fechaPago:       [null as string|null],
    numeroOperacion: [""],
    comprobante:     [""]
  });

  constructor(
    public ref: MatDialogRef<PagoCitaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PagoCitaItemsDto | null
  ) {}

  ngOnInit() {
    if (this.data) {
      this.esEdicion = true;
      this.svc.getById(this.data.idPagoCita.toString()).subscribe(item => this.form.patchValue(item as any));
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
