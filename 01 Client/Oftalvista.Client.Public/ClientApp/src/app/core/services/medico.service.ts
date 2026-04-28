import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PaginatedRequest, PaginatedResponse } from "../models/paginated.model";
import { MedicoRequest, MedicoItemsDto, MedicoFilter } from "../models/medico.model";

@Injectable({ providedIn: "root" })
export class MedicoService {
  private http = inject(HttpClient);
  private url  = `${environment.apiUrl}/medico`;

  listar(request: PaginatedRequest<MedicoFilter>): Observable<PaginatedResponse<MedicoItemsDto>> {
    let params = new HttpParams()
      .set("pageSize",   request.pageSize)
      .set("skip",       request.skip)
      .set("sortField",  request.sortField)
      .set("sortDir",    request.sortDir);
    if (request.filter) {
      Object.entries(request.filter).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    }
    return this.http.get<PaginatedResponse<MedicoItemsDto>>(this.url, { params });
  }

  getById(guid: string): Observable<MedicoItemsDto> {
    return this.http.get<MedicoItemsDto>(`${this.url}/${guid}`);
  }

  crear(payload: MedicoRequest): Observable<any> {
    return this.http.post(this.url, payload);
  }

  editar(payload: MedicoRequest): Observable<any> {
    return this.http.put(this.url, payload);
  }

  eliminar(guid: string): Observable<any> {
    return this.http.delete(`${this.url}/${guid}`);
  }
}
