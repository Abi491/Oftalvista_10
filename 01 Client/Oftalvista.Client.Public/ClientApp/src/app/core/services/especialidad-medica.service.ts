import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { EspecialidadMedicaRequest, EspecialidadMedicaItemsDto, EspecialidadMedicaFilter } from "../models/especialidad-medica.model";

@Injectable({ providedIn: "root" })
export class EspecialidadMedicaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/especialidad-medica`;

  listar(request: PaginatedRequest<EspecialidadMedicaFilter>): Observable<PaginatedResponse<EspecialidadMedicaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<EspecialidadMedicaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<EspecialidadMedicaItemsDto> {
    return this.http.get<EspecialidadMedicaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: EspecialidadMedicaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: EspecialidadMedicaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
