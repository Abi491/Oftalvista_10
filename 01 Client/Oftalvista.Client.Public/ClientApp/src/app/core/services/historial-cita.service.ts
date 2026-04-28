import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { HistorialCitaRequest, HistorialCitaItemsDto, HistorialCitaFilter } from "../models/historial-cita.model";

@Injectable({ providedIn: "root" })
export class HistorialCitaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/historial-cita`;

  listar(request: PaginatedRequest<HistorialCitaFilter>): Observable<PaginatedResponse<HistorialCitaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<HistorialCitaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<HistorialCitaItemsDto> {
    return this.http.get<HistorialCitaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: HistorialCitaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: HistorialCitaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
