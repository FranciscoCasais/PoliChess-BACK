import { Request as IReq, Response as IRes, Router } from "express";
import { HttpStatusCodes } from "../constants/HttpStatusCodes";
import { Usuario } from "../models/usuario.model";
import { generateToken } from "../util/auth";
import logger from "jet-logger";
import paths from "./common/paths";

const routerLogin: Router = Router();

routerLogin.post(`${paths.base}/${paths.login}`, async (req: IReq, res: IRes): Promise<void> => {
  try {
    const { nombre_usuario, contrasena_hash } = req.body;

    const usuario: Usuario | null = await Usuario.findOne({
      where: { nombre_usuario: nombre_usuario }
    });

    if (!usuario || !(await usuario.comparePassword(contrasena_hash))) {
      res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Credenciales inválidas" });
      return;
    }

    const token: string = generateToken(usuario.id);
    res.json({ token });
  } catch (error) {
    logger.err(error, true);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno" });
  }
});

export default routerLogin;