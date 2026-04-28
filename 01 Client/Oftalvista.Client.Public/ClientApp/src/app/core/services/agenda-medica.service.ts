import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { AgendaMedicaRequest, AgendaMedicaItemsDto, AgendaMedicaFilter } from "../models/agenda-medica.model";

@Injectable({ providedIn: "root" })
export class AgendaMedicaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/agenda-medica`;

  listar(request: PaginatedRequest<AgendaMedicaFilter>): Observable<PaginatedResponse<AgendaMedicaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<AgendaMedicaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<AgendaMedicaItemsDto> {
    return this.http.get<AgendaMedicaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: AgendaMedicaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: AgendaMedicaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
