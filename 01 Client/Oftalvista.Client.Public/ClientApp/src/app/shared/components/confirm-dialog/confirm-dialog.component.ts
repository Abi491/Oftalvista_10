import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
export interface confirmDialogData {
  title: string;
  message: string;
}
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `<div class="dialog-wrap">
    <div class="dialog-header">
      <div>
        <div class="dialog-title">{{ data.title }}</div>
        <div class="dialog-subtitle">Esta accion no se puede deshacer.</div>
      </div>
      <mat-icon style="color:#ef4444;font-size:32px;width:32px;height:32px">warning_amber</mat-icon>
    </div>
    <mat-dialog-content
      ><p style="color:#475569;line-height:1.7">{{ data.message }}</p></mat-dialog-content
    >
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close(false)">Cancelar</button>
      <button mat-flat-button color="warn" (click)="ref.close(true)">Si, eliminar</button>
    </mat-dialog-actions>
  </div>`,
})
export class ConfirmDialogComponent {
  constructor(
    public ref: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: confirmDialogData,
  ) {}
}
