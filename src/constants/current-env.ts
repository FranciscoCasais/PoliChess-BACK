import jetEnv, { num } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './NodeEnvs';


type Entorno = {
  NodeEnv: string,
  Port: number;
}

const entornoActual: Entorno = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num
});

export default entornoActual;
