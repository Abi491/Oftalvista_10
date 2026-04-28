import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MaterialModule } from "../../../shared/material.module";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  loading = false;
  hidePass = true;

  form = this.fb.group({
    correo:    ["", [Validators.required, Validators.email]],
    claveHash: ["", Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        this.loading = false;
        const route = res.idTipoUsuario === 1 ? "/dashboard/admin" : "/dashboard/paciente";
        this.router.navigate([route]);
      },
      error: () => { this.loading = false; }
    });
  }
}
