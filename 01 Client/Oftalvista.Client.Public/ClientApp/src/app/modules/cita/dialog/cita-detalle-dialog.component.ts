import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MaterialModule } from "../../../shared/material.module";
import { CitaService } from "../../../core/services/cita.service";
import { CitaItemsDto } from "../../../core/models/cita.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-cita-detalle-dialog",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./cita-detalle-dialog.component.html"
})
export class CitaDetalleDialogComponent implements OnInit {
  private svc      = inject(CitaService);
  catalogoSvc      = inject(CatalogoService);
  estadosCita      = this.catalogoSvc.getEstadoCita();
  modalidades      = this.catalogoSvc.getModalidadCita();
  cita: CitaItemsDto | null = null;

  constructor(
    public ref: MatDialogRef<CitaDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CitaItemsDto
  ) {}

  ngOnInit() {
    this.svc.getById(this.data.idCita.toString()).subscribe(c => this.cita = c);
  }

  getEstado(id: number)    { return this.estadosCita.find(e => e.value===id)?.text ?? id; }
  getModalidad(id: number) { return this.modalidades.find(m => m.value===id)?.text ?? id; }
}
