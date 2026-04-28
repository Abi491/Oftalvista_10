import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { LoginRequest, LoginResponse } from "../models/auth.model";

const KEY_TOKEN = "oftalvista_token";
const KEY_USER  = "oftalvista_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private http   = inject(HttpClient);
  private router = inject(Router);
  private base   = environment.apiUrl;

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, payload).pipe(
      tap(res => {
        localStorage.setItem(KEY_TOKEN, res.token);
        localStorage.setItem(KEY_USER, JSON.stringify(res));
      })
    );
  }

  logout() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    this.router.navigate(["/login"]);
  }

  getToken(): string | null { return localStorage.getItem(KEY_TOKEN); }

  getUser(): LoginResponse | null {
    const u = localStorage.getItem(KEY_USER);
    return u ? JSON.parse(u) : null;
  }

  getRol(): number { return this.getUser()?.idTipoUsuario ?? 0; }
  isLoggedIn(): boolean { return !!this.getToken(); }
}
