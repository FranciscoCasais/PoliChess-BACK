import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, Unique, HasMany, BelongsTo } from 'sequelize-typescript';
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
  comentarios?: Comentario[] | null;

  @Unique
  @Column({ type: DataType.STRING(150), allowNull: false, validate: { notEmpty: true }})
  titulo!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, validate: { notEmpty: true }})
  copete!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, defaultValue: "/polichess/imagenes/noticiadefault.png" })
  imagen!: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "NO ACTION", onUpdate: "CASCADE" })
  autor_id!: number;

  @BelongsTo(() => Usuario)
  autor!: Usuario;

  /* Comento al ser innecesarias gracias a "timestamps"
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  publicado!: Date;

  @Column({ type: DataType.DATE, onUpdate: "NOW()" })
  editado?: Date;
  */

  @Column({ type: DataType.TEXT, allowNull: false, validate: { notEmpty: true }})
  cuerpo!: string;
  

  /*
  ------------------------------------------------------------------------------------------------

  CREATE

  1. Antes de insertar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - El ID del autor sea el mismo que el ID del usuario en el token

  2. Luego, se intentan insertar estos campos en la consulta de Sequelize
  - Título
  - Copete
  - Imagen: Si es null, adopta la URL de la imagen por defecto en los achivos estáticos de
    Express
  - ID del autor
  - Cuerpo

  ------------------------------------------------------------------------------------------------

  UPDATE

  1. Antes de actualizar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - La noticia sea suya

  2. Luego, se intentan actualizar estos campos en la consulta de Sequelize:
  - Título
  - Copete
  - Imagen
  - Cuerpo

  ------------------------------------------------------------------------------------------------

  DESTROY

  1. Antes de eliminar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El usuario sea administrador
  - La noticia sea suya

  2. Luego, se elimina el registro en la consulta de Sequelize.

  ------------------------------------------------------------------------------------------------
  */
}