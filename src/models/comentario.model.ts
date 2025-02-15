import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Usuario } from './usuario.model';
import { Noticia } from './noticia.model';

@Table({
  tableName: "comentario",
  timestamps: true,
  indexes: [
    {
      name: "fk_usuario_id_idx",
      fields: ["usuario_id"]
    },
    {
      name: "fk_noticia_id_idx",
      fields: ["noticia_id"]
    }
  ],
  engine: "InnoDB"
})
export class Comentario extends Model<Comentario> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  usuario_id?: number;

  @BelongsTo(() => Usuario)
  usuario?: Usuario;

  @ForeignKey(() => Noticia)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  noticia_id!: number;

  @BelongsTo(() => Noticia)
  noticia!: Noticia;

  /* Comento al ser innecesarias gracias a "timestamps"
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  publicado!: Date;

  @Column({ type: DataType.DATE, onUpdate: "NOW()" })
  editado?: Date;
  */

  @Column({ type: DataType.TEXT, allowNull: false, validate: { notEmpty: true }})
  contenido!: string;
}