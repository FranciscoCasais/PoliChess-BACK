import 'express-async-errors';

import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';

dotenv.config({ path: `./env/.env.${ process.env.NODE_ENV || "development" }` });

import entornoActual from './constants/current-env';
import { HttpStatusCodes } from './constants/HttpStatusCodes';
import { NodeEnvs } from './constants/NodeEnvs';
import { RouteError } from './routes/common/RouteError';

import sequelize from './config/db';
import { prepararBD } from './config/db';


const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (entornoActual.NodeEnv === NodeEnvs.DEV.valueOf()) {
  app.use(morgan('dev'));
} else if (entornoActual.NodeEnv === NodeEnvs.PROD.valueOf()) {
  app.use(helmet());
}

prepararBD(sequelize);

// app.use(rutas.base, routerBase);

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
