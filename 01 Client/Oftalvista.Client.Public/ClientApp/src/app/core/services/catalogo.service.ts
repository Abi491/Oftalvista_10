import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catalogoItem } from '../models/catalogo.model';
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private url = `${environment.apiUrl}/catalogo`;
  constructor(private http: HttpClient) {}
  getTiposUsuario(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/tipos-usuario`);
  }
  getTiposDocumento(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/tipos-documento`);
  }
  getEstadosVigencia(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/estados-vigencia`);
  }
  getEstadosCita(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/estados-cita`);
  }
  getModalidadesCita(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/modalidades-cita`);
  }
  getMetodosPago(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/metodos-pago`);
  }
  getEstadosPago(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/estados-pago`);
  }
  getEstadosRecordatorio(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/estados-recordatorio`);
  }
  getEspecialidades(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/especialidades`);
  }
  getMedicos(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/medicos`);
  }
  getPacientes(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/pacientes`);
  }
  getUsuarios(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/usuarios`);
  }
  getAgendasMedico(id: number): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/agendas-medico/${id}`);
  }
  getCitas(): Observable<catalogoItem[]> {
    return this.http.get<catalogoItem[]>(`${this.url}/citas`);
  }
  getSexos(): catalogoItem[] {
    return [
      { value: 1, text: 'Masculino' },
      { value: 2, text: 'Femenino' },
      { value: 3, text: 'Otro' },
    ];
  }
}
