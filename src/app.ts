import 'express-async-errors';

import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';
import path from 'path';

dotenv.config({ path: `./env/.env.${process.env.NODE_ENV || "development"}` });

import entornoActual from './constants/current-env';
import { HttpStatusCodes } from './constants/HttpStatusCodes';
import { NodeEnvs } from './constants/NodeEnvs';
import { RouteError } from './routes/common/RouteError';

import sequelize from './config/db';
import { prepararBD } from './config/db';
import paths from './routes/common/paths';

import { Usuario } from './models/usuario.model';
import { Comentario } from './models/comentario.model';

import usuarioService from './services/user.service';
import torneoService from './services/torneo.service';
import inscripcionService from './services/inscripcion.service';
import noticiaService from './services/noticia.service';
import comentarioService from './services/comentario.service';

import routerLogin from './routes/login';
import { authMiddleware } from './util/auth';
import { Usuario_Torneo } from './models/usuario_torneo.model';


const app: express.Application = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

if (entornoActual.NodeEnv === NodeEnvs.DEV.valueOf()) {
  app.use(morgan('dev'));
} else if (entornoActual.NodeEnv === NodeEnvs.PROD.valueOf()) {
  app.use(helmet());
}

prepararBD(sequelize);

app.options('*', cors());

app.get(`${paths.base}/${paths.usuarios.base}/${paths.usuarios.getOne}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  usuarioService.getOne(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.usuarios.base}/${paths.usuarios.getSome}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { pagina } = req.params;
  usuarioService.getSome(Number(pagina))
    .then(data => res.json(data))
    .catch(next);
});

app.post(`${paths.base}/${paths.usuarios.base}/${paths.usuarios.add}`,
  (req: Request, res: Response, next: NextFunction) => {
  const usuario = req.body;
  usuarioService.add(usuario)
    .then(data => res.json(data))
    .catch(next);
});

app.put(`${paths.base}/${paths.usuarios.base}/${paths.usuarios.update}`,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
  const usuario = req.body;
  
  usuarioService.update(usuario)
    .then(data => res.json(data))
    .catch(next);
});

app.delete(`${paths.base}/${paths.usuarios.base}/${paths.usuarios.delete}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (Number(id) !== (req as any).id && !(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  usuarioService.delete(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.torneos.base}/${paths.torneos.getOne}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  torneoService.getOne(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.torneos.base}/${paths.torneos.getSome}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { pagina } = req.params;
  torneoService.getSome(Number(pagina))
    .then(data => res.json(data))
    .catch(next);
});

app.post(`${paths.base}/${paths.torneos.base}/${paths.torneos.add}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const torneo = req.body;
  torneoService.add(torneo)
    .then(data => res.json(data))
    .catch(next);
});

app.put(`${paths.base}/${paths.torneos.base}/${paths.torneos.update}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const torneo = req.body;
  torneoService.update(torneo)
    .then(data => res.json(data))
    .catch(next);
});

app.delete(`${paths.base}/${paths.torneos.base}/${paths.torneos.delete}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const { id } = req.params;
  torneoService.delete(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.torneos.inscripciones.base}/${paths.torneos.inscripciones.getOne}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  inscripcionService.getOne(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.torneos.base}/${paths.torneos.getOne}/${paths.torneos.inscripciones.base}/${paths.torneos.inscripciones.getSome}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { pagina } = req.params;
  inscripcionService.getSome(Number(pagina))
    .then(data => res.json(data))
    .catch(next);
});

app.post(`${paths.base}/${paths.torneos.inscripciones.base}/${paths.torneos.inscripciones.add}`,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
  const inscripcion = req.body;

  inscripcionService.add(inscripcion)
    .then(data => res.json(data))
    .catch(next);
});

app.put(`${paths.base}/${paths.torneos.inscripciones.base}/${paths.torneos.inscripciones.update}`,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
  const inscripcion = req.body;
  inscripcionService.update(inscripcion)
    .then(data => res.json(data))
    .catch(next);
});

app.delete(`${paths.base}/${paths.torneos.inscripciones.base}/${paths.torneos.inscripciones.delete}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const inscripcion: Usuario_Torneo | null = await inscripcionService.getOne(Number(id));

  if (inscripcion!.usuario_id !== (req as any).id && !(req as any).administrador === false) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  inscripcionService.delete(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.noticias.base}/${paths.noticias.getOne}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  noticiaService.getOne(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.noticias.base}/${paths.noticias.getSome}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { pagina } = req.params;
  noticiaService.getSome(Number(pagina))
    .then(data => res.json(data))
    .catch(next);
});

app.post(`${paths.base}/${paths.noticias.base}/${paths.noticias.add}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const noticia = req.body;
  noticiaService.add(noticia)
    .then(data => res.json(data))
    .catch(next);
});

app.put(`${paths.base}/${paths.noticias.base}/${paths.noticias.update}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const noticia = req.body;
  noticiaService.update(noticia)
    .then(data => res.json(data))
    .catch(next);
});

app.delete(`${paths.base}/${paths.noticias.base}/${paths.noticias.delete}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {

  if (!(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const { id } = req.params;
  noticiaService.delete(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.noticias.comentarios.base}/${paths.noticias.comentarios.getOne}`,
  (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  comentarioService.getOne(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.get(`${paths.base}/${paths.noticias.base}/${paths.noticias.getOne}/${paths.noticias.comentarios.base}/${paths.noticias.comentarios.getSome}`,
  (req: Request, res: Response, next: NextFunction) => {
  const idNoticia = req.params.id;
  const pagina = req.params.pagina;
  comentarioService.getSome(Number(idNoticia), Number(pagina))
    .then(data => res.json(data))
    .catch(next);
});

app.post(`${paths.base}/${paths.noticias.comentarios.base}/${paths.noticias.comentarios.add}`,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
  const comentario = req.body;
  comentarioService.add(comentario)
    .then(data => res.json(data))
    .catch(next);
});

app.put(`${paths.base}/${paths.noticias.comentarios.base}/${paths.noticias.comentarios.update}`,
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
  const comentario = req.body;
  comentarioService.update(comentario)
    .then(data => res.json(data))
    .catch(next);
});

app.delete(`${paths.base}/${paths.noticias.comentarios.base}/${paths.noticias.comentarios.delete}`,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const comentario: Comentario | null = await comentarioService.getOne(Number(id));
  
  if (comentario!.usuario_id !== (req as any).id && !(req as any).administrador) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  comentarioService.delete(Number(id))
    .then(data => res.json(data))
    .catch(next);
});

app.use(routerLogin);

app.get(`${paths.base}/${paths.perfil}`, authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
  await Usuario.findByPk((req as any).id)
    .then(data => res.json(data))
    .catch(next);
});

app.use("/imagenes", express.static(path.join(__dirname, "../public/uploads")));

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (entornoActual.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    logger.err(err, true);
  }

  let estado = HttpStatusCodes.BAD_REQUEST;

  if (err instanceof RouteError) {
    estado = err.estado;
    res.status(estado).json({ error: err.message });
  }
  return next(err);
});

export default app;
