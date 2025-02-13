import logger from 'jet-logger';

import { Sequelize } from 'sequelize-typescript';
// IMPORTAR MODELOS CUANDO ESTÉN LISTOS


const variablesEntornoReq: Array<string> = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"];

variablesEntornoReq.forEach((variable: string) => {
  if (!process.env[variable]) {
    const MISSING_ENV_VAR_MSG: string = `Falta la variable de entorno \"${variable}\". Por favor, asegurate que esté definida en el archivo .env del entorno que estés utilizando.`;
    logger.err(MISSING_ENV_VAR_MSG);
    process.exit(1);
  }
});

const sequelize: Sequelize = new Sequelize({
  database: process.env.DB_NAME || "polichess",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",

  // AGREGAR LOS MODELOS CUANDO ESTÉN LISTOS
  models: []
});

sequelize.authenticate()
.then(() => {
  logger.info(`Se estableció exitosamente la conexión con la base de datos \"${ process.env.DB_NAME || "polichess" }\"`);

  // CAMBIAR POR ALTER AL TERMINAR EL DESARROLLO
  return sequelize.sync({ force: true });
})
.then(() => {
  logger.info("Se sincronizaron los modelos exitosamente");

  // HACER EL SEEDING ACÁ
})
.catch((error: Error) => {
  logger.err(error);
  process.exit(1);
});

export default sequelize;