import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Comentario } from './comentario.model';
import { Usuario } from './usuario.model';

@Table({
  tableName: "noticia",
  timestamps: true,
  indexes: [
    {
      name: "fk_autor_id_idx",
      fields: ["autor_id"]
    }
  ],
  engine: "InnoDB"
})
export class Noticia extends Model<Noticia> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Comentario, { foreignKey: "noticia_id", as: "comentarios" })
  comentarios?: Comentario[];

  @Column({ type: DataType.STRING(150), allowNull: false })
  titulo!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  copete!: string;

  @Column({ type: DataType.BLOB('medium') })
  imagen?: Buffer;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  autor_id?: number;

  @BelongsTo(() => Usuario)
  autor?: Usuario;

  /* Comento al ser innecesarias gracias a "timestamps"
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  publicado!: Date;

  @Column({ type: DataType.DATE, onUpdate: "NOW()" })
  editado?: Date;
  */

  @Column({ type: DataType.TEXT, allowNull: false })
  cuerpo!: string;
}