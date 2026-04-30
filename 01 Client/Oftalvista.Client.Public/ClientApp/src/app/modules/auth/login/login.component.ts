import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../core/services/auth.service';
import { AppModeService } from '../../../core/services/app-mode.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hidePass = true;
  loading = false;
  form: FormGroup;
  readonly demoAccounts = [
    { label: 'Admin demo', correo: 'admin@demo.pe', claveHash: 'demo123' },
    { label: 'Paciente demo', correo: 'paciente@demo.pe', claveHash: 'demo123' },
  ];
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public mode: AppModeService,
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      claveHash: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get isDemoMode(): boolean {
    return this.mode.isDemoMode();
  }
  get correo() {
    return this.form.get('correo');
  }
  get claveHash() {
    return this.form.get('claveHash');
  }
  onModeChange(enabled: boolean): void {
    this.mode.setDemoMode(enabled);
    if (enabled) this.usarCuentaDemo(this.demoAccounts[0]);
  }
  usarCuentaDemo(account: { correo: string; claveHash: string }): void {
    this.form.patchValue(account);
  }
  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: (r) => {
        this.loading = false;
        this.router.navigate([r.idTipoUsuario === 1 ? '/dashboard/admin' : '/dashboard/paciente']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
