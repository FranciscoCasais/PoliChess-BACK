import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, BeforeCreate, BeforeUpdate, AfterUpdate } from 'sequelize-typescript';
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
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  usuario_id?: number;

  @BelongsTo(() => Usuario)
  usuario?: Usuario;

  @ForeignKey(() => Torneo)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  torneo_id!: number;

  @BelongsTo(() => Torneo)
  torneo!: Torneo;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  elo_inicial!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  expulsado!: boolean;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 })
  puntaje?: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 })
  posicion?: number;

  public validarCantidadInscripciones(torneo: Torneo): boolean {
    const cantidadInscritos: number = torneo.usuario_torneos?.length ?? 0;
    return !(cantidadInscritos === torneo.maximo_jugadores);
  }

  public async validar(): Promise<void> {
    const BASE_MSG: string = "No se pudo inscribir al usuario: ";
    
    const torneo: Torneo | null = await Torneo.findByPk(this.torneo_id,
      {
        include: {
          model: Usuario_Torneo,
          where: { expulsado: false }
        }
      });

    if (!torneo) {
      throw new Error(BASE_MSG + "Torneo no encontrado");
    }
    
    if (torneo.estado !== 'Pendiente') {
      throw new Error(BASE_MSG + "El torneo ya empezó o ya finalizó");
    }
    
    if (this.elo_inicial < torneo.minimo_elo || this.elo_inicial > torneo.maximo_elo) {
      throw new Error(BASE_MSG + "El usuario no cumple con los requisitos de Elo para este torneo");
    }

    if (!this.validarCantidadInscripciones(torneo)) {
      throw new Error(BASE_MSG + "El torneo ya tiene la cantidad máxima de jugadores inscritos");
    }
  }

  @BeforeCreate
  static async validarInscripcion(inscripcion: Usuario_Torneo): Promise<void> {
    inscripcion.validar();
  }

  @BeforeUpdate
  static async validarActualizacion(inscripcion: Usuario_Torneo, options: any): Promise<void> {
    const BASE_MSG: string = "No se pudo actualizar el registro: ";

    const torneo: Torneo | null = await Torneo.findByPk(inscripcion.torneo_id);

    if (!torneo) {
      throw new Error(BASE_MSG + "Torneo no encontrado");
    }

    if (options.fields.includes("expulsado") && torneo.estado === 'Finalizado') {
      throw new Error(BASE_MSG + "No se puede expulsar a un jugador de un torneo finalizado");
    }
    
    if ((options.fields.includes("puntaje") || options.fields.includes("posicion")) &&
       (torneo.estado === 'Pendiente' || torneo.estado === 'Finalizado')) {
      throw new Error(BASE_MSG + "El torneo todavía no empezó o ya finalizó");
    }
  }

  // En realidad no debería eliminarse el registro al expulsar a un jugador, incluso si el torneo está
  // en estado "Pendiente".

  // Se podrá actualizar el campo "expulsado", pero no se eliminará el registro para mantener constancia
  // de quiénes pueden inscribirse y quiénes no. Solo se elimina el registro si el usuario que se
  // inscribió se da de baja por su propia cuenta.

  // Así, ese usuario puede volver a inscribirse si quiere, pero si es expulsado el registro de la expulsión
  // seguirá disponible y su ID impedirá que se inscriba nuevamente gracias a la restricción de unicidad.

}