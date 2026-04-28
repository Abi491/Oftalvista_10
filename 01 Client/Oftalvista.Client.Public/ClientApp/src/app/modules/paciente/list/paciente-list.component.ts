import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { PacienteService } from "../../../core/services/paciente.service";
import { PacienteItemsDto, PacienteFilter } from "../../../core/models/paciente.model";
import { PaginatedRequest } from "../../../core/models/paginated.model";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { PacienteFormDialogComponent } from "../dialog/paciente-form-dialog.component";

@Component({
  selector: "app-paciente-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./paciente-list.component.html"
})
export class PacienteListComponent implements OnInit {
  private svc    = inject(PacienteService);
  private dialog = inject(MatDialog);
  private snack  = inject(MatSnackBar);
  private fb     = inject(FormBuilder);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idUsuario","fechaNacimiento","sexo","direccion","contactoEmergencia","telefonoEmergencia","idTblEstadoVigencia","acciones"];
  data: PacienteItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;

  filtros = this.fb.group({ idUsuario:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""] });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"idPaciente", sortDir:"asc", filter:this.filtros.value as PacienteFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }

  abrirForm(item?: PacienteItemsDto) {
    const ref = this.dialog.open(PacienteFormDialogComponent, { width:"580px", data:item??null, disableClose:true });
    ref.afterClosed().subscribe(ok => { if(ok) this.cargar(); });
  }

  eliminar(item: PacienteItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width:"380px", data:{title:"Eliminar Paciente",message:`¿Eliminar paciente ID: ${item.idPaciente}?`} });
    ref.afterClosed().subscribe(ok => {
      if(!ok) return;
      this.svc.eliminar(item.idPaciente.toString()).subscribe(() => { this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar(); });
    });
  }
}
