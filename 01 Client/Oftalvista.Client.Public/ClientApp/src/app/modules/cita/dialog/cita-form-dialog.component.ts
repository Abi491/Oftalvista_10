import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { CitaService } from "../../../core/services/cita.service";
import { AgendaMedicaService } from "../../../core/services/agenda-medica.service";
import { CitaItemsDto } from "../../../core/models/cita.model";
import { CatalogoItem } from "../../../core/models/paginated.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-cita-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./cita-form-dialog.component.html"
})
export class CitaFormDialogComponent implements OnInit {
  private svc       = inject(CitaService);
  private agendaSvc = inject(AgendaMedicaService);
  private snack     = inject(MatSnackBar);
  private fb        = inject(FormBuilder);
  catalogoSvc       = inject(CatalogoService);

  estadosCita = this.catalogoSvc.getEstadoCita();
  modalidades = this.catalogoSvc.getModalidadCita();
  slotsDisponibles: CatalogoItem[] = [];
  loading = false; esEdicion = false;

  form = this.fb.group({
    guidCita:        [null as string|null],
    idPaciente:      [null as number|null, Validators.required],
    idMedico:        [null as number|null, Validators.required],
    idAgendaMedica:  [null as number|null, Validators.required],
    idEstadoCita:    [null as number|null, Validators.required],
    idModalidadCita: [null as number|null, Validators.required],
    motivo:          ["", Validators.required],
    fechaCita:       ["", Validators.required],
    horaCita:        ["", Validators.required],
    observacion:     [""]
  });

  constructor(
    public ref: MatDialogRef<CitaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: CitaItemsDto|null; medicos: CatalogoItem[]; pacientes: CatalogoItem[] }
  ) {}

  ngOnInit() {
    if (this.data.item) {
      this.esEdicion = true;
      this.svc.getById(this.data.item.idCita.toString()).subscribe(item => {
        this.form.patchValue(item as any);
        this.cargarSlots(item.idMedico);
      });
    }
    this.form.get("idMedico")?.valueChanges.subscribe(id => { if (id) this.cargarSlots(id); });
  }

  cargarSlots(idMedico: number) {
    this.agendaSvc.listar({ pageSize:100, skip:0, sortField:"fecha", sortDir:"asc",
      filter:{ idMedico:idMedico.toString(), fecha:"", fechaRegistroDesde:"", fechaRegistroHasta:"" } }).subscribe(res => {
        this.slotsDisponibles = res.data
          .filter(a => a.esDisponible)
          .map(a => ({ value:a.idAgendaMedica, text:`${a.fecha} ${a.horaInicio}-${a.horaFin}` }));
    });
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
