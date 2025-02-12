import { HttpStatusCodes } from "../../constants/HttpStatusCodes";
import { IValidationErrFormat } from "./IValidationErrFormat";
import { RouteError } from "./RouteError";


export class ValidationErr extends RouteError {
  public static mensaje = "Faltó el siguiente parámetro o es inválido.";

  public constructor(parametro: string, valor?: unknown, masInfo?: string) {
    const msjObj: IValidationErrFormat = {
      error: ValidationErr.mensaje,
      parametro,
      valor,
    };

    if (!!masInfo) {
      msjObj["mas-info"] = masInfo;
    }

    super(HttpStatusCodes.BAD_REQUEST, JSON.stringify(msjObj));
  }
}
