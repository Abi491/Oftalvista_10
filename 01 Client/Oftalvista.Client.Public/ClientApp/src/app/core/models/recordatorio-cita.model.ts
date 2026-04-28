export interface RecordatorioCitaRequest {
  guidRecordatorioCita?: string;
  idCita: number;
  idEstadoRecordatorio: number;
  fechaProgramada: string;
  fechaEnvio: string | null;
  mensaje: string;
}

export interface RecordatorioCitaItemsDto {
  rowNum?: number;
  idRecordatorioCita: number;
  idCita: number;
  idEstadoRecordatorio: number;
  fechaProgramada: string;
  fechaEnvio: string | null;
  mensaje: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface RecordatorioCitaFilter {
  idCita: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
