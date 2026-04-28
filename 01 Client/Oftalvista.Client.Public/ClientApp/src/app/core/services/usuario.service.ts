import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { UsuarioRequest, UsuarioItemsDto, UsuarioFilter } from "../models/usuario.model";

@Injectable({ providedIn: "root" })
export class UsuarioService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/usuario`;

  listar(request: PaginatedRequest<UsuarioFilter>): Observable<PaginatedResponse<UsuarioItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<UsuarioItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<UsuarioItemsDto> {
    return this.http.get<UsuarioItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: UsuarioRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: UsuarioRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
