import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { AgendaMedicaService } from "../../../core/services/agenda-medica.service";
import { MedicoService } from "../../../core/services/medico.service";
import { AgendaMedicaItemsDto, AgendaMedicaFilter } from "../../../core/models/agenda-medica.model";
import { PaginatedRequest, CatalogoItem } from "../../../core/models/paginated.model";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { AgendaMedicaFormDialogComponent } from "../dialog/agenda-medica-form-dialog.component";

@Component({
  selector: "app-agenda-medica-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./agenda-medica-list.component.html"
})
export class AgendaMedicaListComponent implements OnInit {
  private svc      = inject(AgendaMedicaService);
  private medSvc   = inject(MedicoService);
  private dialog   = inject(MatDialog);
  private snack    = inject(MatSnackBar);
  private fb       = inject(FormBuilder);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idMedico","fecha","horaInicio","horaFin","esDisponible","idTblEstadoVigencia","acciones"];
  data: AgendaMedicaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  medicos: CatalogoItem[] = [];

  filtros = this.fb.group({ idMedico:[""], fecha:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""] });

  ngOnInit() {
    this.medSvc.listar({ pageSize:100, skip:0, sortField:"idMedico", sortDir:"asc", filter:{} as any }).subscribe(res => {
      this.medicos = res.data.map(m => ({ value: m.idMedico, text: `CMP: ${m.cmp}` }));
    });
    this.cargar();
  }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"fecha", sortDir:"asc", filter:this.filtros.value as AgendaMedicaFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }
  getMedico(id: number) { return this.medicos.find(m => m.value===id)?.text ?? `ID:${id}`; }

  abrirForm(item?: AgendaMedicaItemsDto) {
    const ref = this.dialog.open(AgendaMedicaFormDialogComponent, { width:"560px", data:{ item:item??null, medicos:this.medicos }, disableClose:true });
    ref.afterClosed().subscribe(ok => { if(ok) this.cargar(); });
  }

  eliminar(item: AgendaMedicaItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width:"380px", data:{title:"Eliminar Slot",message:`¿Eliminar slot del ${item.fecha}?`} });
    ref.afterClosed().subscribe(ok => {
      if(!ok) return;
      this.svc.eliminar(item.idAgendaMedica.toString()).subscribe(() => { this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar(); });
    });
  }
}
