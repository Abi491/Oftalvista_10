import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { loginRequest, loginResponse } from '../models/auth.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.apiUrl}/auth`;
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  login(body: loginRequest): Observable<loginResponse> {
    return this.http.post<loginResponse>(`${this.url}/login`, body).pipe(
      tap((r) => {
        localStorage.setItem('ov_token', r.token);
        localStorage.setItem('ov_user', JSON.stringify(r));
      }),
    );
  }
  logout(): void {
    localStorage.removeItem('ov_token');
    localStorage.removeItem('ov_user');
    this.router.navigate(['/login']);
  }
  getToken(): string | null {
    return localStorage.getItem('ov_token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUser(): loginResponse | null {
    const u = localStorage.getItem('ov_user');
    return u ? JSON.parse(u) : null;
  }
  isAdmin(): boolean {
    return this.getUser()?.idTipoUsuario === 1;
  }
}
