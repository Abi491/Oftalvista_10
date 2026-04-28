export interface AgendaMedicaRequest {
  guidAgendaMedica?: string;
  idMedico: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  esDisponible: boolean;
  observacion: string;
}

export interface AgendaMedicaItemsDto {
  rowNum?: number;
  idAgendaMedica: number;
  idMedico: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  esDisponible: boolean;
  observacion: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface AgendaMedicaFilter {
  idMedico: string;
  fecha: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
