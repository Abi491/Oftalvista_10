export interface LoginRequest {
  correo: string;
  claveHash: string;
}

export interface LoginResponse {
  token: string;
  nombreCompleto: string;
  idTipoUsuario: number;
  correo: string;
}
