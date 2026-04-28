import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { CitaService } from "../../../core/services/cita.service";
import { MedicoService } from "../../../core/services/medico.service";
import { PacienteService } from "../../../core/services/paciente.service";
import { CitaItemsDto, CitaFilter } from "../../../core/models/cita.model";
import { PaginatedRequest, CatalogoItem } from "../../../core/models/paginated.model";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { CitaFormDialogComponent } from "../dialog/cita-form-dialog.component";
import { CitaDetalleDialogComponent } from "../dialog/cita-detalle-dialog.component";

@Component({
  selector: "app-cita-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./cita-list.component.html"
})
export class CitaListComponent implements OnInit {
  private svc        = inject(CitaService);
  private medSvc     = inject(MedicoService);
  private pacSvc     = inject(PacienteService);
  private dialog     = inject(MatDialog);
  private snack      = inject(MatSnackBar);
  private fb         = inject(FormBuilder);
  catalogoSvc        = inject(CatalogoService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idPaciente","idMedico","fechaCita","horaCita","idModalidadCita","idEstadoCita","idTblEstadoVigencia","acciones"];
  data: CitaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  medicos: CatalogoItem[]   = [];
  pacientes: CatalogoItem[] = [];
  estadosCita = this.catalogoSvc.getEstadoCita();
  modalidades = this.catalogoSvc.getModalidadCita();

  filtros = this.fb.group({ idPaciente:[""], idMedico:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""] });

  ngOnInit() {
    this.medSvc.listar({ pageSize:100, skip:0, sortField:"idMedico", sortDir:"asc", filter:{} as any })
      .subscribe(res => { this.medicos = res.data.map(m => ({ value:m.idMedico, text:`CMP:${m.cmp}` })); });
    this.pacSvc.listar({ pageSize:100, skip:0, sortField:"idPaciente", sortDir:"asc", filter:{} as any })
      .subscribe(res => { this.pacientes = res.data.map(p => ({ value:p.idPaciente, text:`ID:${p.idUsuario}` })); });
    this.cargar();
  }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"fechaCita", sortDir:"desc", filter:this.filtros.value as CitaFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }

  getEstado(id: number)    { return this.estadosCita.find(e => e.value===id)?.text ?? id; }
  getModalidad(id: number) { return this.modalidades.find(m => m.value===id)?.text ?? id; }
  getMedico(id: number)    { return this.medicos.find(m => m.value===id)?.text ?? `ID:${id}`; }
  getPaciente(id: number)  { return this.pacientes.find(p => p.value===id)?.text ?? `ID:${id}`; }

  abrirForm(item?: CitaItemsDto) {
    const ref = this.dialog.open(CitaFormDialogComponent, {
      width:"620px", data:{ item:item??null, medicos:this.medicos, pacientes:this.pacientes }, disableClose:true
    });
    ref.afterClosed().subscribe(ok => { if(ok) this.cargar(); });
  }

  verDetalle(item: CitaItemsDto) {
    this.dialog.open(CitaDetalleDialogComponent, { width:"700px", data:item });
  }

  eliminar(item: CitaItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width:"380px", data:{title:"Eliminar Cita",message:`¿Eliminar cita del ${item.fechaCita}?`} });
    ref.afterClosed().subscribe(ok => {
      if(!ok) return;
      this.svc.eliminar(item.idCita.toString()).subscribe(() => { this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar(); });
    });
  }
}
