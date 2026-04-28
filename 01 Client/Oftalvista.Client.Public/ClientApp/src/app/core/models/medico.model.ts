export interface MedicoRequest {
  guidMedico?: string;
  idUsuario: number;
  idEspecialidadMedica: number;
  cmp: string;
  perfilProfesional: string;
}

export interface MedicoItemsDto {
  rowNum?: number;
  idMedico: number;
  idUsuario: number;
  idEspecialidadMedica: number;
  cmp: string;
  perfilProfesional: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface MedicoFilter {
  idUsuario: string;
  idEspecialidadMedica: string;
  cmp: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
