import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { AgendaMedicaService } from "../../../core/services/agenda-medica.service";
import { AgendaMedicaItemsDto } from "../../../core/models/agenda-medica.model";
import { CatalogoItem } from "../../../core/models/paginated.model";

@Component({
  selector: "app-agenda-medica-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./agenda-medica-form-dialog.component.html"
})
export class AgendaMedicaFormDialogComponent implements OnInit {
  private svc   = inject(AgendaMedicaService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidAgendaMedica: [null as string|null],
    idMedico:    [null as number|null, Validators.required],
    fecha:       ["", Validators.required],
    horaInicio:  ["", Validators.required],
    horaFin:     ["", Validators.required],
    esDisponible:[true],
    observacion: [""]
  });

  constructor(
    public ref: MatDialogRef<AgendaMedicaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: AgendaMedicaItemsDto|null; medicos: CatalogoItem[] }
  ) {}

  ngOnInit() {
    if (this.data.item) {
      this.esEdicion = true;
      this.svc.getById(this.data.item.idAgendaMedica.toString()).subscribe(item => this.form.patchValue(item as any));
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
