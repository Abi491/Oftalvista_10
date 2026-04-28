import { paginatedItemsRequest } from './pagination.model';
export interface recordatorioCitaItemsDto {
  rowNum?: number;
  idRecordatorioCita: number;
  guid?: string;
  idCita: number;
  idEstadoRecordatorio: number;
  fechaProgramada: string;
  fechaEnvio?: string;
  mensaje: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}
export interface recordatorioCitaBusquedaRequest {
  idCita?: string;
  fechaRegistroDesde?: string;
  fechaRegistroHasta?: string;
}
export interface createRecordatorioCitaRequest {
  idCita: number;
  idEstadoRecordatorio: number;
  fechaProgramada: string;
  fechaEnvio?: string;
  mensaje: string;
  idTblEstadoVigencia: number;
}
export interface updateRecordatorioCitaRequest {
  guidRecordatorioCita: string;
  idCita: number;
  idEstadoRecordatorio: number;
  fechaProgramada: string;
  fechaEnvio?: string;
  mensaje: string;
  idTblEstadoVigencia: number;
}
export type recordatorioCitaListRequest = paginatedItemsRequest<recordatorioCitaBusquedaRequest>;
