import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Partida } from './partida.model';
import { Usuario } from './usuario.model';

@Table({
  tableName: "historial",
  timestamps: false,
  indexes: [
    {
      name: "fk_partida_id_idx",
      fields: ["partida_id"]
    },
    {
      name: "fk_usuario_id_idx3",
      fields: ["usuario_id"]
    }
  ],
  engine: "InnoDB"
})
export class Historial extends Model<Historial> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @PrimaryKey
  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  usuario_id!: number;

  @BelongsTo(() => Usuario)
  usuario!: Usuario;

  @PrimaryKey
  @ForeignKey(() => Partida)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  partida_id!: number;

  @BelongsTo(() => Partida)
  partida!: Partida;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  elo_anterior!: number;
}