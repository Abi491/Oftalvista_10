import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { PagoCitaService } from "../../../core/services/pago-cita.service";
import { PagoCitaItemsDto, PagoCitaFilter } from "../../../core/models/pago-cita.model";
import { PaginatedRequest } from "../../../core/models/paginated.model";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { PagoCitaFormDialogComponent } from "../dialog/pago-cita-form-dialog.component";

@Component({
  selector: "app-pago-cita-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./pago-cita-list.component.html"
})
export class PagoCitaListComponent implements OnInit {
  private svc    = inject(PagoCitaService);
  private dialog = inject(MatDialog);
  private snack  = inject(MatSnackBar);
  private fb     = inject(FormBuilder);
  catalogoSvc    = inject(CatalogoService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idCita","idMetodoPago","idEstadoPago","monto","fechaPago","numeroOperacion","idTblEstadoVigencia","acciones"];
  data: PagoCitaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  metodos  = this.catalogoSvc.getMetodoPago();
  estados  = this.catalogoSvc.getEstadoPago();

  filtros = this.fb.group({ idCita:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""] });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"idPagoCita", sortDir:"desc", filter:this.filtros.value as PagoCitaFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }
  getMetodo(id: number) { return this.metodos.find(m => m.value===id)?.text ?? id; }
  getEstado(id: number) { return this.estados.find(e => e.value===id)?.text ?? id; }

  abrirForm(item?: PagoCitaItemsDto) {
    const ref = this.dialog.open(PagoCitaFormDialogComponent, { width:"580px", data:item??null, disableClose:true });
    ref.afterClosed().subscribe(ok => { if(ok) this.cargar(); });
  }

  eliminar(item: PagoCitaItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width:"380px", data:{title:"Eliminar Pago",message:`¿Eliminar pago de cita ${item.idCita}?`} });
    ref.afterClosed().subscribe(ok => {
      if(!ok) return;
      this.svc.eliminar(item.idPagoCita.toString()).subscribe(() => { this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar(); });
    });
  }
}
