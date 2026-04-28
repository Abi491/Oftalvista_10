import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../shared/material.module";
import { UsuarioService } from "../../../core/services/usuario.service";
import { UsuarioItemsDto, UsuarioFilter } from "../../../core/models/usuario.model";
import { PaginatedRequest } from "../../../core/models/paginated.model";
import { CatalogoService } from "../../../core/services/catalogo.service";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { UsuarioFormDialogComponent } from "../dialog/usuario-form-dialog.component";

@Component({
  selector: "app-usuario-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./usuario-list.component.html"
})
export class UsuarioListComponent implements OnInit {
  private svc      = inject(UsuarioService);
  private dialog   = inject(MatDialog);
  private snack    = inject(MatSnackBar);
  private fb       = inject(FormBuilder);
  catalogoSvc      = inject(CatalogoService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns  = ["rowNum","nombres","apellidos","correo","telefono","tipoUsuario","tipoDocumento","numeroDocumento","idTblEstadoVigencia","acciones"];
  data: UsuarioItemsDto[] = [];
  total = 0; pageSize = 10; loading = false;
  tiposUsuario  = this.catalogoSvc.getTipoUsuario();
  tiposDocumento = this.catalogoSvc.getTipoDocumento();

  filtros = this.fb.group({
    idTipoUsuario: [""], idTipoDocumento: [""], numeroDocumento: [""],
    fechaRegistroDesde: [""], fechaRegistroHasta: [""]
  });

  ngOnInit() { this.cargar(); }

  cargar(skip = 0) {
    this.loading = true;
    const req: PaginatedRequest<UsuarioFilter> = {
      pageSize: this.pageSize, skip, sortField: "idUsuario", sortDir: "asc",
      filter: this.filtros.value as UsuarioFilter
    };
    this.svc.listar(req).subscribe({
      next: res => { this.data = res.data; this.total = res.count; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buscar() { this.paginator?.firstPage(); this.cargar(); }
  limpiar() { this.filtros.reset(); this.buscar(); }
  onPage(e: any) { this.pageSize = e.pageSize; this.cargar(e.pageIndex * e.pageSize); }

  getTipoUsuario(id: number) { return this.tiposUsuario.find(t => t.value === id)?.text ?? id; }
  getTipoDocumento(id: number | null) { return id ? (this.tiposDocumento.find(t => t.value === id)?.text ?? id) : "-"; }

  abrirForm(item?: UsuarioItemsDto) {
    const ref = this.dialog.open(UsuarioFormDialogComponent, { width:"600px", data: item ?? null, disableClose: true });
    ref.afterClosed().subscribe(ok => { if (ok) this.cargar(); });
  }

  eliminar(item: UsuarioItemsDto) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width:"380px", data: { title:"Eliminar Usuario", message:`¿Eliminar a "${item.nombres} ${item.apellidos}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.svc.eliminar(item.idUsuario.toString()).subscribe(() => {
        this.snack.open("Eliminado correctamente","Cerrar",{duration:3000});
        this.cargar();
      });
    });
  }
}
