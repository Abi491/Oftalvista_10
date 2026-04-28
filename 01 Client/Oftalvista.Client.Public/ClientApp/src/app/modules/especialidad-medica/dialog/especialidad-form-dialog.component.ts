import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { EspecialidadMedicaService } from "../../../core/services/especialidad-medica.service";
import { EspecialidadMedicaItemsDto } from "../../../core/models/especialidad-medica.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-especialidad-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./especialidad-form-dialog.component.html"
})
export class EspecialidadFormDialogComponent implements OnInit {
  private svc      = inject(EspecialidadMedicaService);
  private snack    = inject(MatSnackBar);
  private fb       = inject(FormBuilder);
  catalogoSvc      = inject(CatalogoService);
  estados          = this.catalogoSvc.getEstadoVigencia();
  loading          = false;
  esEdicion        = false;

  form = this.fb.group({
    guidEspecialidadMedica: [null as string | null],
    codigo:      ["", Validators.required],
    nombre:      ["", Validators.required],
    descripcion: ["", Validators.required]
  });

  constructor(
    public ref: MatDialogRef<EspecialidadFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EspecialidadMedicaItemsDto | null
  ) {}

  ngOnInit() {
    if (this.data) {
      this.esEdicion = true;
      this.svc.getById(this.data.idEspecialidadMedica.toString()).subscribe(item => {
        this.form.patchValue(item as any);
      });
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value as any;
    const op = this.esEdicion ? this.svc.editar(payload) : this.svc.crear(payload);
    op.subscribe({
      next: () => {
        this.snack.open(this.esEdicion ? "Actualizado correctamente" : "Registrado correctamente","Cerrar",{duration:3000});
        this.loading = false;
        this.ref.close(true);
      },
      error: () => { this.loading = false; }
    });
  }
}
