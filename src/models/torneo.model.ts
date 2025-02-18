import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Usuario } from './usuario.model';
import { Usuario_Torneo } from './usuario_torneo.model';

@Table({
  tableName: "torneo",
  timestamps: false,
  indexes: [
    {
      name: "fk_organizador_id_idx",
      fields: ["organizador_id"]
    },
    {
      name: "nombre_organizador_id",
      fields: ["nombre", "organizador_id"],
      unique: true
    }
  ],
  engine: "InnoDB"
})
export class Torneo extends Model<Torneo> {
  public static duracionMaximaEstandar: string = "03:00:00";
  public static duracionMaximaRapido: string = "01:30:00";
  public static duracionMaximaBlitz: string = "00:15:00";
  public static horarioMinimo: string = "08:00:00";
  public static horarioMaximo: string = "23:00:00";
  public static minimoJugadores: number = 2;
  public static maximoJugadoresSuizo: number = 100;
  public static maximoJugadoresTCT: number = 20;
  public static maximoJugadoresTCTx2: number = 10;
  public static minimoIntervaloRondas: number = 1;
  public static maximoIntervaloRondas: number = 14;
  public static minimoRondasSuizo: number = 4;
  public static maximoRondasSuizo: number = 10;
  public static minimoDeEspera: number = 7;
  public static limiteDeEspera: number = 30;

  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Usuario_Torneo, { foreignKey: "torneo_id", as: "usuario_torneos" })
  usuario_torneos?: Usuario_Torneo[] | null;

  @Column({ type: DataType.STRING(45), allowNull: false, validate: { notEmpty: true }})
  nombre!: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "NO ACTION", onUpdate: "CASCADE" })
  organizador_id!: number;

  @BelongsTo(() => Usuario)
  organizador!: Usuario;

  @Column({ type: DataType.STRING(255), validate: { notEmpty: true }})
  descripcion?: string | null;

  @Column({ type: DataType.ENUM('Estándar', 'Rápido', 'Blitz'), allowNull: false })
  ritmo!: 'Estándar' | 'Rápido' | 'Blitz';

  @Column({ type: DataType.ENUM('Suizo', 'Todos contra todos', 'Todos contra todos (ida y vuelta)'), allowNull: false })
  sistema_emparejamiento!: 'Suizo' | 'Todos contra todos' | 'Todos contra todos (ida y vuelta)';

  @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: null })
  cantidad_rondas?: number | null;

  @Column({ type: DataType.DATE, allowNull: false })
  fecha_hora_inicio!: Date;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  intervalo_rondas!: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  minimo_jugadores!: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  maximo_jugadores!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  minimo_elo!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  maximo_elo!: number;


  /*
  ------------------------------------------------------------------------------------------------
  
  CREATE

  1. Antes de insertar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - El ID del organizador sea el mismo que el ID del usuario en el token

  2. Antes de insertar, en el hook @BeforeCreate, se necesita comprobar que:
  - Si se seleccionó el sistema de emparejamiento suizo, que la cantidad de rondas se haya
    establecido entre los límites aceptados
  - Si no se seleccionó el sistema suizo, que la cantidad de rondas sea null o undefined
  - La fecha de inicio esté entre los límites de espera
  - El intervalo de rondas sea un número entero mayor a 0 y menor a 15
  - El horario de inicio de las rondas esté por delante de las 08:00:00 AM
  - El horario de inicio de las rondas + la duración máxima de las partidas (dependiendo del
    ritmo) no sobrepase las 23:00:00 PM
  - La cantidad mínima de jugadores no sea mayor a la cantidad máxima de jugadores
  - La cantidad de jugadores respete los límites del sistema de emparejamiento
  - El Elo mínimo no sea mayor al Elo máximo

  3. Luego, se intentan insertar estos campos en la consulta de Sequelize:
  - Nombre
  - ID del organizador
  - Descripción: Si es null, se deja así
  - Ritmo
  - Sistema de emparejamiento
  - Cantidad de rondas: Si es null, se deja así
  - Fecha de inicio
  - Intervalo en días de las rondas
  - Horario preferido de las rondas
  - Cantidad mínima de jugadores
  - Cantidad máxima de jugadores
  - Elo mínimo requerido
  - Elo máximo requerido

  Campos que NUNCA se intentan insertar en la consulta de Sequelize (obviando el ID y claves
  foráneas):
  - Estado: adopta 'Pendiente'

  ------------------------------------------------------------------------------------------------
  */

  /*
  ------------------------------------------------------------------------------------------------

  UPDATE

  1. Antes de actualizar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - El torneo sea suyo

  2. Antes de actualizar, en el hook @BeforeUpdate, se necesita comprobar que:
  - Comprobar que el estado sea 'Pendiente' o 'En curso'
  - En caso de que el torneo esté en estado 'Pendiente'
    - Realizar todas las mismas validaciones que en el hook @BeforeCreate
    - Borrar las inscripciones a los últimos jugadores inscritos si la nueva cantidad máxima de
      jugadores es menos a la cantidad actual
    - Expulsar a los jugadores que no cumplan con los nuevos requisitos de Elo
    - No se haya cambiado el estado a 'Finalizado' ni 'Cancelado' (cuando está pendiente y se
      quiere cancelar, se hace una request delete)
    - Si se cambia el estado a 'En curso', que la fecha de inicio sea la fecha actual y se haya
      alcanzado el mínimo de jugadores
  - En caso de que el estado sea 'En curso'
    - Solo se esté intentando cambiar el estado
    - No se haya cambiado el estado a 'Pendiente'
    - Si se cambia el estado a 'Finalizado', no haya partidas sin resultados registrados

  3. Luego, se intentan actualizar estos campos en la consulta de Sequelize:
  - Nombre
  - Descripción
  - Ritmo
  - Sistema de emparejamiento
  - Cantidad de rondas
  - Fecha de inicio
  - Intervalo en días de las rondas
  - Horario preferido de las rondas
  - Cantidad mínima de jugadores
  - Cantidad máxima de jugadores
  - Elo mínimo requerido
  - Elo máximo requerido
  - Estado
  
  4. Después de actualizar, en el hook @AfterUpdate, se necesita que:
  - Si el estado fue cambiado a 'En curso'
    - Si el sistema de emparejamiento no es el suizo
      - Calcular la cantidad de rondas en base a la cantidad de jugadores inscritos
      - Programar el fixture completo
    - Si el sistema de emparejamiento es suizo, programar la primera ronda y al resto dejarlas
      llenas de partidos con IDs de jugadores y resultado en null
  - Si el estado fue cambiado a 'Finalizado'
    - Se actualicen los Elos de todos los jugadores
  - Si el estado fue cambiado a 'Cancelado' (se hizo una request put cuando estaba en curso,
    si se quiere eliminar cuando está pendiente se hace una request delete)
    - Se actualicen los Elos de todos los jugadores no expulsados en base a las partidas que
      se hayan llegado a jugar
    - Establecer el estado de todas las partidas que no se hayan jugado en 'Cancelado'
  
  ------------------------------------------------------------------------------------------------
  */

  /*
  ------------------------------------------------------------------------------------------------

  DESTROY

  1. Antes de eliminar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - El torneo sea suyo

  2. Antes de eliminar, en el hook @BeforeDestroy, se necesita comprobar que:
  - El torneo está en estado 'Pendiente'

  3. Luego, se elimina el registro en la consulta de Sequelize.

  ------------------------------------------------------------------------------------------------
  */
}