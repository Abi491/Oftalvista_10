import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { PagoCitaRequest, PagoCitaItemsDto, PagoCitaFilter } from "../models/pago-cita.model";

@Injectable({ providedIn: "root" })
export class PagoCitaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/pago-cita`;

  listar(request: PaginatedRequest<PagoCitaFilter>): Observable<PaginatedResponse<PagoCitaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<PagoCitaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<PagoCitaItemsDto> {
    return this.http.get<PagoCitaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: PagoCitaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: PagoCitaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
