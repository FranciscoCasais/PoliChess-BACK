import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Usuario } from './usuario.model';
import { Torneo } from './torneo.model';

@Table({
  tableName: "usuario_torneo",
  timestamps: false,
  indexes: [
    {
      name: "fk_usuario_id_idx2",
      fields: ["usuario_id"]
    },
    {
      name: "fk_torneo_id_idx2",
      fields: ["torneo_id"]
    },
    {
      name: "usuario_id_torneo_id",
      fields: ["usuario_id", "torneo_id"],
      unique: true
    }
  ],
  engine: "InnoDB"
})
export class Usuario_Torneo extends Model<Usuario_Torneo> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "CASCADE", onUpdate: "CASCADE" })
  usuario_id?: number | null;

  @BelongsTo(() => Usuario)
  usuario?: Usuario | null;

  @ForeignKey(() => Torneo)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  torneo_id!: number;

  @BelongsTo(() => Torneo)
  torneo!: Torneo;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  elo_inicial!: number;


  /*
  ------------------------------------------------------------------------------------------------

  CREATE

  1. Antes de insertar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El ID del usuario sea el mismo que el ID del usuario en el token

  2. Antes de insertar, en el hook @BeforeCreate, se necesita comprobar que:
  - El torneo exista
  - El torneo esté en estado "Pendiente"
  - Haya cupo en el torneo
  - El usuario cumpla con los requisitos de mínimo y máximo de Elo

  3. Luego, se intentan insertar estos campos en la consulta de Sequelize:
  - ID del usuario
  - ID del torneo
  - Elo inicial: Se define siempre en la consulta de Sequelize a partir del campo del Elo
    correspondiente obtenido a partir del registro con el ID que le llega a la consulta
  
  Campos que NUNCA se intentan insertar en la consulta de Sequelize (obviando el ID y claves
  foráneas):
  - Expulsado: adopta false
  - Puntaje: adopta 0
  - Posición: adopta 0

  ------------------------------------------------------------------------------------------------
  */



  /*
  ------------------------------------------------------------------------------------------------

  UPDATE

  1. Antes de actualizar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - El torneo al que está vinculado la inscripción sea suyo

  2. Antes de actualizar, en el hook @BeforeUpdate, se necesita comprobar que:
  - Si se quiere expulsar a un jugador
    - Solo ese campo haya sido modificado
    - Que se esté modificando a true
    - El torneo esté en estado 'Pendiente' o 'En curso'
  - Si se quiere modificar el puntaje y/o posición
    - El estado no haya sido modificado
    - El torneo esté en estado 'En curso'

  3. Luego, se intentan actualizar estos campos en la consulta de Sequelize:
  - Expulsado
  - Puntaje
  - Posición

  Campos que NUNCA se intentan actualizar en la consulta de Sequelize (obviando el ID y claves
  foráneas):
  - Elo inicial

  4. Después de actualizar, en el hook @AfterUpdate, se necesita que:
  - Si se expulsó a un jugador
    - En caso de que con la expulsión de este jugador haya quedado un solo jugador en el
      torneo, se establezca como ganador al usuario restante
    - Se actualice el Elo del jugador expulsado por las partidas que llegó a jugar
    - El resultado de todas las partidas que todavía no jugó se establezca al jugador contrario
    - En caso de que el otro jugador también fuera expulsado o eliminado (ID null), se
      establece el resultado a 'Cancelado'

  ------------------------------------------------------------------------------------------------
  */



  /*
  ------------------------------------------------------------------------------------------------

  DESTROY

  1. Antes de eliminar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - La inscripción sea suya
  - Si la inscripción no es suya, que el usuario sea administrador, que el torneo al que está
    vinculado la inscripción sea suyo y que la inscripción no pertenezca a otro administrador
  
  2. Antes de eliminar, en el hook @BeforeDestroy, se necesita comprobar que:
  - El torneo al que está vinculado la inscripción esté en estado 'Pendiente'

  3. Luego, se elimina el registro en la consulta de Sequelize.

  ------------------------------------------------------------------------------------------------
  */
}