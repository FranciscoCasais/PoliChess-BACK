import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Partida } from './partida.model';
import { Torneo } from './torneo.model';

@Table({
  tableName: "ronda",
  timestamps: false,
  indexes: [
    {
      name: "fk_torneo_id_idx",
      fields: ["torneo_id"]
    },
    {
      name: "torneo_id_numero",
      fields: ["torneo_id", "numero"],
      unique: true
    }
  ],
  engine: "InnoDB"
})
export class Ronda extends Model<Ronda> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Partida, { foreignKey: "ronda_id", as: "partidas" })
  partidas?: Partida[];

  @ForeignKey(() => Torneo)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  torneo_id!: number;

  @BelongsTo(() => Torneo)
  torneo!: Torneo;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  numero!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  fecha_hora!: Date;
}