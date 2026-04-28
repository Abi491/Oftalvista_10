import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { PacienteService } from "../../../core/services/paciente.service";
import { PacienteItemsDto } from "../../../core/models/paciente.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-paciente-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./paciente-form-dialog.component.html"
})
export class PacienteFormDialogComponent implements OnInit {
  private svc   = inject(PacienteService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  catalogoSvc   = inject(CatalogoService);
  sexos         = this.catalogoSvc.getSexo();
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidPaciente:        [null as string|null],
    idUsuario:           [null as number|null, Validators.required],
    fechaNacimiento:     [null as string|null],
    sexo:                ["", Validators.required],
    direccion:           [""],
    contactoEmergencia:  [""],
    telefonoEmergencia:  [""]
  });

  constructor(
    public ref: MatDialogRef<PacienteFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PacienteItemsDto | null
  ) {}

  ngOnInit() {
    if (this.data) {
      this.esEdicion = true;
      this.svc.getById(this.data.idPaciente.toString()).subscribe(item => this.form.patchValue(item as any));
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
