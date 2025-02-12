import { HttpStatusCodes } from '../../constants/HttpStatusCodes';


export class RouteError extends Error {
  public estado: HttpStatusCodes;

  public constructor(estado: HttpStatusCodes, mensaje: string) {
    super(mensaje);
    this.estado = estado;
  }
}
