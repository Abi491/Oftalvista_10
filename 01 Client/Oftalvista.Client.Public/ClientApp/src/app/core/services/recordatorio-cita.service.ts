import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { paginatedItemsResponse } from '../models/pagination.model';
import {
  recordatorioCitaItemsDto,
  createRecordatorioCitaRequest,
  updateRecordatorioCitaRequest,
  recordatorioCitaListRequest,
} from '../models/recordatorio-cita.model';
@Injectable({ providedIn: 'root' })
export class RecordatorioCitaService {
  private url = `${environment.apiUrl}/recordatorio-cita`;
  constructor(private http: HttpClient) {}
  listar(
    req: recordatorioCitaListRequest,
  ): Observable<paginatedItemsResponse<recordatorioCitaItemsDto>> {
    let p = new HttpParams().set('pageSize', req.pageSize).set('skip', req.skip);
    if (req.sortField) p = p.set('sortField', req.sortField);
    if (req.sortDir) p = p.set('sortDir', req.sortDir);
    if (req.filter)
      Object.keys(req.filter).forEach((k) => {
        const v = (req.filter as any)[k];
        if (v != null && v !== '') p = p.set(k, v);
      });
    return this.http.get<paginatedItemsResponse<recordatorioCitaItemsDto>>(this.url, { params: p });
  }
  obtener(guid: string): Observable<recordatorioCitaItemsDto> {
    return this.http.get<recordatorioCitaItemsDto>(`${this.url}/${guid}`);
  }
  crear(body: createRecordatorioCitaRequest): Observable<recordatorioCitaItemsDto> {
    return this.http.post<recordatorioCitaItemsDto>(this.url, body);
  }
  editar(guid: string, body: updateRecordatorioCitaRequest): Observable<recordatorioCitaItemsDto> {
    return this.http.put<recordatorioCitaItemsDto>(`${this.url}/${guid}`, body);
  }
  eliminar(guid: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${guid}`);
  }
}
