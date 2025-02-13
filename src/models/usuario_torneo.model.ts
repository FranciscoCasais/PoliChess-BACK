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

  @Column({ type: DataType.ENUM('Activo', 'Vetado', 'Eliminado'), allowNull: false })
  estado_usuario!: 'Activo' | 'Vetado' | 'Eliminado';

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  puntaje?: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: true })
  posicion?: number;
}