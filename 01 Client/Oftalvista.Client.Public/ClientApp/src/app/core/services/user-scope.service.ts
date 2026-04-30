import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PacienteService } from './paciente.service';
import { pacienteItemsDto } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class UserScopeService {
  private cachedPaciente$?: Observable<pacienteItemsDto | null>;
  private cachedUserId?: number;

  constructor(
    private auth: AuthService,
    private pacienteService: PacienteService,
  ) {}

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  getCurrentPaciente(): Observable<pacienteItemsDto | null> {
    const user = this.auth.getUser();
    if (!user || this.auth.isAdmin()) return of(null);

    if (!this.cachedPaciente$ || this.cachedUserId !== user.idUsuario) {
      this.cachedUserId = user.idUsuario;
      this.cachedPaciente$ = this.pacienteService
        .listar({
          pageSize: 1,
          skip: 0,
          sortField: 'Id',
          sortDir: 'asc',
          filter: { idUsuario: String(user.idUsuario) } as any,
        })
        .pipe(
          map((response) => response.data[0] ?? null),
          shareReplay(1),
        );
    }

    return this.cachedPaciente$;
  }
}
