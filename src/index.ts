import logger from 'jet-logger';

import app from './app';
import entornoActual from './constants/current-env';

import { traducirEntornoNode } from './util/translate-env';


const SERVER_START_MSG: string = "Servidor iniciado en modo de " + traducirEntornoNode(entornoActual.NodeEnv) + " en el puerto " + entornoActual.Port;

app.listen(entornoActual.Port, () => logger.info(SERVER_START_MSG));
