export interface PacienteRequest {
  guidPaciente?: string;
  idUsuario: number;
  fechaNacimiento: string | null;
  sexo: string;
  direccion: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
}

export interface PacienteItemsDto {
  rowNum?: number;
  idPaciente: number;
  idUsuario: number;
  fechaNacimiento: string | null;
  sexo: string;
  direccion: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface PacienteFilter {
  idUsuario: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
