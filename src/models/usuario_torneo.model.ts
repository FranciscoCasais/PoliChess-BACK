import logger from 'jet-logger';

import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, BeforeCreate } from 'sequelize-typescript';
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

  @Column({ type: DataType.ENUM('Activo', 'Vetado', 'Eliminado'), allowNull: false })
  estado_usuario!: 'Activo' | 'Vetado' | 'Eliminado';

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  puntaje?: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  posicion?: number;

  @BeforeCreate
  static async validarInscripcion(inscripcion: Usuario_Torneo) {
    const ROOT_MSG: string = "No se pudo inscribir al usuario: ";
    const usuario: Usuario | null = await Usuario.findByPk(inscripcion.usuario_id);
    
    if (!usuario) {
      logger.err(ROOT_MSG + "Usuario no encontrado");
      return;
    }

    const torneo: Torneo | null = await Torneo.findByPk(inscripcion.torneo_id, { include: Usuario_Torneo });

    if (!torneo) {
      logger.err(ROOT_MSG + "Torneo no encontrado");
      return;
    }

    let elo: number;

    switch(torneo!.ritmo) {
      case "Estándar":
        elo = usuario!.elo_estandar;
      break;
      case "Rápido":
        elo = usuario!.elo_rapido;
      break;
      case "Blitz":
        elo = usuario!.elo_blitz;
      break;
    }

    const cantidadInscriptos: number = torneo!.usuario_torneos?.length || 0;

    if (cantidadInscriptos === torneo.maximo_jugadores) {
      logger.err("El torneo ya alcanzó el máximo de jugadores inscriptos")
      return;
    }

    if (elo < torneo!.maximo_elo || elo > torneo!.maximo_elo) {
      logger.err("El usuario no cumple con los requisitos de Elo de este torneo")
      return;
    }
  }
}