import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Ronda } from './ronda.model';
import { Usuario } from './usuario.model';

@Table({
  tableName: "partida",
  timestamps: false,
  indexes: [
    {
      name: "fk_ronda_id_idx",
      fields: ["ronda_id"]
    },
    {
      name: "fk_blancas_id_idx",
      fields: ["blancas_id"]
    },
    {
      name: "fk_negras_id_idx",
      fields: ["negras_id"]
    }
  ],
  engine: "InnoDB"
})
export class Partida extends Model<Partida> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Ronda)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  ronda_id!: number;

  @BelongsTo(() => Ronda)
  ronda!: Ronda;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  blancas_id?: number;

  @BelongsTo(() => Usuario)
  blancas?: Usuario;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  negras_id?: number;

  @BelongsTo(() => Usuario)
  negras?: Usuario;

  @Column({ type: DataType.ENUM('Blancas', 'Negras', 'Tablas', 'Cancelado') })
  resultado?: 'Blancas' | 'Negras' | 'Tablas' | 'Cancelado';
}