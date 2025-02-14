import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany, BeforeCreate, AfterCreate } from 'sequelize-typescript';
import { Ronda } from './ronda.model';
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
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Ronda, { foreignKey: "torneo_id", as: "rondas" })
  rondas?: Ronda[];

  @HasMany(() => Usuario_Torneo, { foreignKey: "torneo_id", as: "usuario_torneos" })
  usuario_torneos?: Usuario_Torneo[];

  @Column({ type: DataType.STRING(45), allowNull: false })
  nombre!: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  organizador_id?: number;

  @BelongsTo(() => Usuario)
  organizador?: Usuario;

  @Column({ type: DataType.STRING(255) })
  descripcion?: string;

  @Column({ type: DataType.ENUM('Estándar', 'Rápido', 'Blitz'), allowNull: false })
  ritmo!: 'Estándar' | 'Rápido' | 'Blitz';

  @Column({ type: DataType.ENUM('Suizo', 'Todos contra todos', 'Todos contra todos (ida y vuelta)'), allowNull: false })
  sistema_emparejamiento!: 'Suizo' | 'Todos contra todos' | 'Todos contra todos (ida y vuelta)';

  @Column({ type: DataType.TINYINT.UNSIGNED })
  cantidad_rondas?: number;

  @Column({ type: DataType.ENUM('Buchholz', 'Buchholz mediano', 'Buchholz -1', 'Sonneborn-Berger'), allowNull: false })
  criterio_desempate!: 'Buchholz' | 'Buchholz mediano' | 'Buchholz -1' | 'Sonneborn-Berger';

  @Column({ type: DataType.DATEONLY, allowNull: false })
  fecha_inicio!: Date;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  intervalo_rondas!: number;

  @Column({ type: DataType.TIME, allowNull: false })
  horario_preferido!: string;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  minimo_jugadores!: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  maximo_jugadores!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  minimo_elo!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  maximo_elo!: number;

  @Column({ type: DataType.ENUM('Pendiente', 'En curso', 'Finalizado', 'Cancelado'), allowNull: false })
  estado!: 'Pendiente' | 'En curso' | 'Finalizado' | 'Cancelado';
}