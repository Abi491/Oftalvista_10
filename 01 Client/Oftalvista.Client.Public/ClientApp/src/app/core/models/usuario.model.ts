export interface UsuarioRequest {
  guidUsuario?: string;
  idTipoUsuario: number;
  idTipoDocumento: number | null;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  claveHash: string;
  telefono: string;
}

export interface UsuarioItemsDto {
  rowNum?: number;
  idUsuario: number;
  idTipoUsuario: number;
  idTipoDocumento: number | null;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  claveHash: string;
  telefono: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface UsuarioFilter {
  idTipoUsuario: string;
  idTipoDocumento: string;
  numeroDocumento: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
