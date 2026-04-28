import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { HistorialCitaService } from "../../../core/services/historial-cita.service";
import { HistorialCitaItemsDto, HistorialCitaFilter } from "../../../core/models/historial-cita.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-historial-cita-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./historial-cita-list.component.html"
})
export class HistorialCitaListComponent implements OnInit {
  private svc     = inject(HistorialCitaService);
  private fb      = inject(FormBuilder);
  catalogoSvc     = inject(CatalogoService);
  estadosCita     = this.catalogoSvc.getEstadoCita();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = ["rowNum","idCita","idEstadoCita","descripcion","fechaEvento","idTblEstadoVigencia"];
  data: HistorialCitaItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;

  filtros = this.fb.group({
    idCita:[""], idEstadoCita:[""], fechaRegistroDesde:[""], fechaRegistroHasta:[""]
  });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    this.svc.listar({ pageSize:this.pageSize, skip, sortField:"fechaEvento", sortDir:"desc",
      filter:this.filtros.value as HistorialCitaFilter }).subscribe({
      next: res => { this.data=res.data; this.total=res.count; this.loading=false; },
      error: () => { this.loading=false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize=e.pageSize; this.cargar(e.pageIndex*e.pageSize); }
  getEstado(id: number) { return this.estadosCita.find(e => e.value===id)?.text ?? id; }
}
