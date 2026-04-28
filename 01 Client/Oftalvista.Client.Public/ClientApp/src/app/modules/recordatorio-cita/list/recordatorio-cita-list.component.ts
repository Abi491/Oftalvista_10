import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { RecordatorioCitaService } from "../../../core/services/recordatorio-cita.service";
import { RecordatorioCitaItemsDto, RecordatorioCitaFilter } from "../../../core/models/recordatorio-cita.model";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { RecordatorioCitaFormDialogComponent } from "../dialog/recordatorio-cita-form-dialog.component";

@Component({
  selector: "app-recordatorio-cita-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./recordatorio-cita-list.component.html"
})
export class RecordatorioCitaListComponent implements OnInit {
  private svc    = inject(RecordatorioCitaService);
  private dialog = inject(MatDialog);
  private snack  = inject(MatSnackBar);
  private fb     = inject(FormBuilder);
  catalogoSvc    = inject(CatalogoService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idCita","idEstadoRecordatorio","fechaProgramada","fechaEnvio","mensaje","idTblEstadoVigencia","acciones"];
  data: RecordatorioCitaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  estadosRec = this.catalogoSvc.getEstadoRecordatorio();

  filtros = this.fb.group({ idCita:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""] });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"fechaProgramada", sortDir:"desc",
      filter:this.filtros.value as RecordatorioCitaFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }
  getEstado(id: number) { return this.estadosRec.find(e => e.value===id)?.text ?? id; }

  abrirForm(item?: RecordatorioCitaItemsDto) {
    const ref = this.dialog.open(RecordatorioCitaFormDialogComponent, { width:"560px", data:item??null, disableClose:true });
    ref.afterClosed().subscribe(ok => { if(ok) this.cargar(); });
  }

  eliminar(item: RecordatorioCitaItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width:"380px",
      data:{ title:"Eliminar Recordatorio", message:`¿Eliminar recordatorio de cita ${item.idCita}?` } });
    ref.afterClosed().subscribe(ok => {
      if(!ok) return;
      this.svc.eliminar(item.idRecordatorioCita.toString()).subscribe(() => {
        this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar();
      });
    });
  }
}
