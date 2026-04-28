export interface CitaRequest {
  guidCita?: string;
  idPaciente: number;
  idMedico: number;
  idAgendaMedica: number;
  idEstadoCita: number;
  idModalidadCita: number;
  motivo: string;
  fechaCita: string;
  horaCita: string;
  observacion: string;
}

export interface CitaItemsDto {
  rowNum?: number;
  idCita: number;
  idPaciente: number;
  idMedico: number;
  idAgendaMedica: number;
  idEstadoCita: number;
  idModalidadCita: number;
  motivo: string;
  fechaCita: string;
  horaCita: string;
  observacion: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface CitaFilter {
  idPaciente: string;
  idMedico: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
