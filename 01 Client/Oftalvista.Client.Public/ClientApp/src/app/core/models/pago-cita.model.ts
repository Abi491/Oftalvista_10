export interface PagoCitaRequest {
  guidPagoCita?: string;
  idCita: number;
  idMetodoPago: number;
  idEstadoPago: number;
  monto: number;
  fechaPago: string | null;
  numeroOperacion: string;
  comprobante: string;
}

export interface PagoCitaItemsDto {
  rowNum?: number;
  idPagoCita: number;
  idCita: number;
  idMetodoPago: number;
  idEstadoPago: number;
  monto: number;
  fechaPago: string | null;
  numeroOperacion: string;
  comprobante: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface PagoCitaFilter {
  idCita: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
