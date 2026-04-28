import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { MedicoService } from "../../../core/services/medico.service";
import { EspecialidadMedicaService } from "../../../core/services/especialidad-medica.service";
import { MedicoItemsDto, MedicoFilter } from "../../../core/models/medico.model";
import { PaginatedRequest, CatalogoItem } from "../../../core/models/paginated.model";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { MedicoFormDialogComponent } from "../dialog/medico-form-dialog.component";

@Component({
  selector: "app-medico-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./medico-list.component.html"
})
export class MedicoListComponent implements OnInit {
  private svc      = inject(MedicoService);
  private espSvc   = inject(EspecialidadMedicaService);
  private dialog   = inject(MatDialog);
  private snack    = inject(MatSnackBar);
  private fb       = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","cmp","idUsuario","idEspecialidadMedica","perfilProfesional","idTblEstadoVigencia","acciones"];
  data: MedicoItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  especialidades: CatalogoItem[] = [];

  filtros = this.fb.group({
    idUsuario: [""], idEspecialidadMedica: [""], cmp: [""],
    fechaRegistroDesde: [""], fechaRegistroHasta: [""]
  });

  ngOnInit() {
    this.cargarEspecialidades();
    this.cargar();
  }

  cargarEspecialidades() {
    this.espSvc.listar({ pageSize:100, skip:0, sortField:"nombre", sortDir:"asc", filter:{} as any }).subscribe(res => {
      this.especialidades = res.data.map(e => ({ value: e.idEspecialidadMedica, text: e.nombre }));
    });
  }

  cargar(skip = 0) {
    this.loading = true;
    const req: PaginatedRequest<MedicoFilter> = {
      pageSize: this.pageSize, skip, sortField: "idMedico", sortDir: "asc",
      filter: this.filtros.value as MedicoFilter
    };
    this.svc.listar(req).subscribe({
      next: res => { this.data = res.data; this.total = res.count; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize = e.pageSize; this.cargar(e.pageIndex * e.pageSize); }
  getEsp(id: number) { return this.especialidades.find(e => e.value === id)?.text ?? id; }

  abrirForm(item?: MedicoItemsDto) {
    const ref = this.dialog.open(MedicoFormDialogComponent, {
      width:"580px", data: { item: item ?? null, especialidades: this.especialidades }, disableClose: true
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.cargar(); });
  }

  eliminar(item: MedicoItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width:"380px", data: { title:"Eliminar Médico", message:`¿Eliminar médico CMP: ${item.cmp}?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.svc.eliminar(item.idMedico.toString()).subscribe(() => {
        this.snack.open("Eliminado","Cerrar",{duration:3000}); this.cargar();
      });
    });
  }
}
