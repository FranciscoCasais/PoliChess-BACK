import bcrypt from "bcrypt";

import { Table, Model, Column, DataType, PrimaryKey, HasMany, Unique, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Comentario } from './comentario.model';
import { Noticia } from './noticia.model';
import { Torneo } from './torneo.model';
import { Usuario_Torneo } from './usuario_torneo.model';

@Table({
  tableName: "usuario",
  timestamps: false,
  engine: "InnoDB"
})
export class Usuario extends Model<Usuario> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Torneo, { foreignKey: "organizador_id", as: "torneos" })
  torneos?: Torneo[] | null;

  @HasMany(() => Usuario_Torneo, { foreignKey: "usuario_id", as: "usuario_torneos" })
  usuario_torneos?: Usuario_Torneo[] | null;

  @HasMany(() => Noticia, { foreignKey: "autor_id", as: "noticias" })
  noticias?: Noticia[] | null;

  @HasMany(() => Comentario, { foreignKey: "usuario_id", as: "comentarios" })
  comentarios?: Comentario[] | null;

  @Column({ type: DataType.STRING(30), allowNull: false, validate: { notEmpty: true }})
  nombre!: string;

  @Column({ type: DataType.STRING(30), allowNull: false, validate: { notEmpty: true }})
  apellido!: string;

  @Unique
  @Column({ type: DataType.STRING(30), allowNull: false, validate: { notEmpty: true }})
  nombre_usuario!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, validate: { notEmpty: true }})
  contrasena_hash!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  administrador!: boolean;

  @Column({ type: DataType.STRING(255), defaultValue: "Daniel Santi" })
  foto_perfil!: string;

  @Column({ type: DataType.DATEONLY })
  fecha_nacimiento?: Date | null;

  @Column({ type: DataType.DECIMAL(6, 2).UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_estandar!: number;

  @Column({ type: DataType.DECIMAL(6, 2).UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_rapido!: number;

  @Column({ type: DataType.DECIMAL(6, 2).UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_blitz!: number;


  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(usuario: Usuario): Promise<void> {
    if (usuario.changed("contrasena_hash")) {
      const saltRounds = 10;
      usuario.contrasena_hash = await bcrypt.hash(usuario.contrasena_hash, saltRounds);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.contrasena_hash);
  }


  /*
  ------------------------------------------------------------------------------------------------

  CREATE

  1. Cuando el usuario se está registrando, se intentan insertar estos campos en la consulta de
  Sequelize:
  - Nombre
  - Apellido
  - Nombre de usuario
  - Contraseña hasheada
  - Foto de perfil: Si es null, adopta la URL de la foto de perfil por defecto en los archivos
    estáticos de Express
  - Fecha de nacimiento: Si es null, se deja así

  Campos que NUNCA se intentan insertar en la consulta de Sequelize (obviando el ID):
  - Administrador: adopta false
  - Elos: adoptan 1200
  - Partidas jugadas: adoptan 0

  ------------------------------------------------------------------------------------------------

  UPDATE

  1. Antes de actualizar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El perfil sea suyo

  2. Luego, se intentan actualizar estos campos en la consulta de Sequelize:
  - Nombre
  - Apellido
  - Nombre de usuario
  - Contraseña hasheada
  - Foto de perfil
  - Fecha de nacimiento

  Campos que NUNCA se intentan actualizar en la consulta de Sequelize (obviando el ID):
  - Administrador
  - Elos
  - Partidas jugadas

  ------------------------------------------------------------------------------------------------

  DESTROY

  1. Antes de eliminar, se necesita el token JWT para comprobar que:
  - El usuario esté logueado
  - El perfil sea suyo
  - Si el perfil no es suyo, que sea administrador y que el perfil no pertenezca a otro
    administrador
  
  2. Después de eliminar, en el hook @BeforeDestroy, se necesita que:
  - Se eliminen todas las inscripciones del usuario de torneos en estado 'Pendiente'
  - Se establezcan todas sus posiciones en torneos en curso en null
  - Si algún torneo se queda con un jugador por su eliminación, se establezca como ganador al
    usuario restante
  - Se establezca el resultado de todas las partidas que todavía no jugó al jugador contrario
    - En caso de que el otro jugador estuviera expulsado o también fuera eliminado, establecer
      el resultado en 'Cancelado'

  3. Luego, se elimina el registro en la consulta de Sequelize.

  ------------------------------------------------------------------------------------------------
  */
}