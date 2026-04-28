import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { RecordatorioCitaRequest, RecordatorioCitaItemsDto, RecordatorioCitaFilter } from "../models/recordatorio-cita.model";

@Injectable({ providedIn: "root" })
export class RecordatorioCitaService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/recordatorio-cita`;

  listar(request: PaginatedRequest<RecordatorioCitaFilter>): Observable<PaginatedResponse<RecordatorioCitaItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<RecordatorioCitaItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<RecordatorioCitaItemsDto> {
    return this.http.get<RecordatorioCitaItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: RecordatorioCitaRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: RecordatorioCitaRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
