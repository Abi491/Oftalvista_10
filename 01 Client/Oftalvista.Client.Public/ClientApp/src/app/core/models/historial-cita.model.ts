export interface HistorialCitaRequest {
  guidHistorialCita?: string;
  idCita: number;
  idEstadoCita: number;
  descripcion: string;
  fechaEvento: string;
}

export interface HistorialCitaItemsDto {
  rowNum?: number;
  idHistorialCita: number;
  idCita: number;
  idEstadoCita: number;
  descripcion: string;
  fechaEvento: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface HistorialCitaFilter {
  idCita: string;
  idEstadoCita: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
