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
  usuario_id?: number | null;

  @BelongsTo(() => Usuario)
  usuario?: Usuario | null;

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
  

  /*
  ------------------------------------------------------------------------------------------------

  CREATE

  1. Antes de insertar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El ID del usuario sea el mismo que el ID del usuario en el token

  2. Luego, se intentan insertar estos campos en la consulta de Sequelize:
  - ID del usuario
  - ID de la noticia
  - Contenido

  ------------------------------------------------------------------------------------------------

  UPDATE

  1. Antes de actualizar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El comentario sea suyo

  2. Luego, se intentan actualizar estos campos en la consulta de Sequelize
  - Contenido

  ------------------------------------------------------------------------------------------------

  DESTROY

  1. Antes de eliminar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El comentario sea suyo
  - Si el comentario no es suyo, que el usuario sea administrador y que el comentario no
    pertenezca a otro administrador

  2. Luego, se elimina el registro en la consulta de Sequelize.

  ------------------------------------------------------------------------------------------------
  */
}