import { Injectable } from "@angular/core";
import { CatalogoItem } from "../models/paginated.model";

@Injectable({ providedIn: "root" })
export class CatalogoService {

  getEstadoVigencia(): CatalogoItem[] {
    return [{ value: 1, text: "Activo" }, { value: 0, text: "Inactivo" }];
  }

  getTipoUsuario(): CatalogoItem[] {
    return [
      { value: 1, text: "Administrador" },
      { value: 2, text: "Paciente" },
      { value: 3, text: "Médico" }
    ];
  }

  getTipoDocumento(): CatalogoItem[] {
    return [
      { value: 1, text: "DNI" },
      { value: 2, text: "Carné de Extranjería" },
      { value: 3, text: "Pasaporte" }
    ];
  }

  getEstadoCita(): CatalogoItem[] {
    return [
      { value: 1, text: "Pendiente" },
      { value: 2, text: "Confirmada" },
      { value: 3, text: "Cancelada" },
      { value: 4, text: "Reprogramada" },
      { value: 5, text: "Atendida" }
    ];
  }

  getModalidadCita(): CatalogoItem[] {
    return [{ value: 1, text: "Presencial" }, { value: 2, text: "Virtual" }];
  }

  getMetodoPago(): CatalogoItem[] {
    return [
      { value: 1, text: "Tarjeta" },
      { value: 2, text: "Yape" },
      { value: 3, text: "Plin" }
    ];
  }

  getEstadoPago(): CatalogoItem[] {
    return [
      { value: 1, text: "Pendiente" },
      { value: 2, text: "Pagado" },
      { value: 3, text: "Fallido" }
    ];
  }

  getEstadoRecordatorio(): CatalogoItem[] {
    return [
      { value: 1, text: "Programado" },
      { value: 2, text: "Enviado" },
      { value: 3, text: "Cancelado" }
    ];
  }

  getSexo(): CatalogoItem[] {
    return [{ value: 1, text: "Masculino" }, { value: 2, text: "Femenino" }];
  }
}
