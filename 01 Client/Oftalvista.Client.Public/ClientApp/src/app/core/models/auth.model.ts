export interface loginRequest {
  correo: string;
  claveHash: string;
}
export interface loginResponse {
  token: string;
  refreshToken?: string;
  idUsuario: number;
  nombres: string;
  apellidos: string;
  idTipoUsuario: number;
  tipoUsuario: string;
}
