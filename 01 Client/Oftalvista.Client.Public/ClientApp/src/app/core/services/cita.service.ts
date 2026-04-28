import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { CitaRequest, CitaItemsDto, CitaFilter } from "../models/cita.model";

@Injectable({ providedIn: "root" })
export class CitaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/cita`;

  listar(request: PaginatedRequest<CitaFilter>): Observable<PaginatedResponse<CitaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<CitaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<CitaItemsDto> {
    return this.http.get<CitaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: CitaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: CitaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
