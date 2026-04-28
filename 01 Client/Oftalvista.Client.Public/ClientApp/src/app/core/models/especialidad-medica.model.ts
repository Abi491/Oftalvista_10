export interface EspecialidadMedicaRequest {
  guidEspecialidadMedica?: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface EspecialidadMedicaItemsDto {
  rowNum?: number;
  idEspecialidadMedica: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  idTblEstadoVigencia: number;
  rowCount?: number;
}

export interface EspecialidadMedicaFilter {
  codigo: string;
  fechaRegistroDesde: string;
  fechaRegistroHasta: string;
}
