import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { MedicoService } from "../../../core/services/medico.service";
import { MedicoItemsDto } from "../../../core/models/medico.model";
import { CatalogoItem } from "../../../core/models/paginated.model";

@Component({
  selector: "app-medico-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./medico-form-dialog.component.html"
})
export class MedicoFormDialogComponent implements OnInit {
  private svc   = inject(MedicoService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidMedico:          [null as string | null],
    idUsuario:           [null as number | null, Validators.required],
    idEspecialidadMedica:[null as number | null, Validators.required],
    cmp:                 ["", Validators.required],
    perfilProfesional:   ["", Validators.required]
  });

  constructor(
    public ref: MatDialogRef<MedicoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: MedicoItemsDto | null; especialidades: CatalogoItem[] }
  ) {}

  ngOnInit() {
    if (this.data.item) {
      this.esEdicion = true;
      this.svc.getById(this.data.item.idMedico.toString()).subscribe(item => this.form.patchValue(item as any));
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value as any;
    const op = this.esEdicion ? this.svc.editar(payload) : this.svc.crear(payload);
    op.subscribe({
      next: () => { this.snack.open(this.esEdicion?"Actualizado":"Registrado","Cerrar",{duration:3000}); this.loading=false; this.ref.close(true); },
      error: () => { this.loading = false; }
    });
  }
}
