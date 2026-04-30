import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../../core/services/auth.service';
import { AppModeService } from '../../../core/services/app-mode.service';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() title = '';
  @Input() subtitle = '';
  constructor(public auth: AuthService, public mode: AppModeService) {}
  onModeChange(event: MatSlideToggleChange): void {
    if (event.checked === this.mode.isDemoMode()) return;
    this.mode.setDemoMode(event.checked);
    this.auth.logout();
  }
}
