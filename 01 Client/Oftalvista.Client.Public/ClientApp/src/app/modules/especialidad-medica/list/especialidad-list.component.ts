import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { EspecialidadMedicaService } from "../../../core/services/especialidad-medica.service";
import { EspecialidadMedicaItemsDto, EspecialidadMedicaFilter } from "../../../core/models/especialidad-medica.model";
import { PaginatedRequest } from "../../../core/models/paginated.model";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { EspecialidadFormDialogComponent } from "../dialog/especialidad-form-dialog.component";

@Component({
  selector: "app-especialidad-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./especialidad-list.component.html"
})
export class EspecialidadListComponent implements OnInit {
  private svc    = inject(EspecialidadMedicaService);
  private dialog = inject(MatDialog);
  private snack  = inject(MatSnackBar);
  private fb     = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","codigo","nombre","descripcion","idTblEstadoVigencia","acciones"];
  data: EspecialidadMedicaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;

  filtros = this.fb.group({
    codigo: [""], fechaRegistroDesde: [""], fechaRegistroHasta: [""]
  });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    const req: PaginatedRequest<EspecialidadMedicaFilter> = {
      pageSize: this.pageSize, skip,
      sortField: "idEspecialidadMedica", sortDir: "asc",
      filter: this.filtros.value as EspecialidadMedicaFilter
    };
    this.svc.listar(req).subscribe({
      next: res => { this.data = res.data; this.total = res.count; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize = e.pageSize; this.cargar(e.pageIndex * e.pageSize); }

  abrirForm(item?: EspecialidadMedicaItemsDto) {
    const ref = this.dialog.open(EspecialidadFormDialogComponent, { width:"520px", data: item ?? null, disableClose: true });
    ref.afterClosed().subscribe(ok => { if (ok) this.cargar(); });
  }

  eliminar(item: EspecialidadMedicaItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width:"380px", data: { title:"Eliminar Especialidad", message:`¿Eliminar "${item.nombre}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.svc.eliminar(item.idEspecialidadMedica.toString()).subscribe(() => {
        this.snack.open("Eliminado correctamente","Cerrar",{duration:3000});
        this.cargar();
      });
    });
  }
}
