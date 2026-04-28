import { Component, inject, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "../../../shared/material.module";
import { UsuarioService } from "../../../core/services/usuario.service";
import { UsuarioItemsDto } from "../../../core/models/usuario.model";
import { CatalogoService } from "../../../core/services/catalogo.service";

@Component({
  selector: "app-usuario-form-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./usuario-form-dialog.component.html"
})
export class UsuarioFormDialogComponent implements OnInit {
  private svc   = inject(UsuarioService);
  private snack = inject(MatSnackBar);
  private fb    = inject(FormBuilder);
  catalogoSvc   = inject(CatalogoService);
  tiposUsuario  = this.catalogoSvc.getTipoUsuario();
  tiposDoc      = this.catalogoSvc.getTipoDocumento();
  estados       = this.catalogoSvc.getEstadoVigencia();
  loading = false; esEdicion = false; hidePass = true;

  form = this.fb.group({
    guidUsuario:      [null as string | null],
    idTipoUsuario:    [null as number | null, Validators.required],
    idTipoDocumento:  [null as number | null],
    numeroDocumento:  ["", Validators.required],
    nombres:          ["", Validators.required],
    apellidos:        ["", Validators.required],
    correo:           ["", [Validators.required, Validators.email]],
    claveHash:        [""],
    telefono:         ["", Validators.required]
  });

  constructor(
    public ref: MatDialogRef<UsuarioFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioItemsDto | null
  ) {}

  ngOnInit() {
    if (this.data) {
      this.esEdicion = true;
      this.svc.getById(this.data.idUsuario.toString()).subscribe(item => this.form.patchValue(item as any));
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.loading = true;
    const payload = this.form.value as any;
    const op = this.esEdicion ? this.svc.editar(payload) : this.svc.crear(payload);
    op.subscribe({
      next: () => {
        this.snack.open(this.esEdicion ? "Actualizado" : "Registrado","Cerrar",{duration:3000});
        this.loading = false; this.ref.close(true);
      },
      error: () => { this.loading = false; }
    });
  }
}
