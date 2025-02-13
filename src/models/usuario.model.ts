import { Table, Model, Column, DataType, PrimaryKey, HasMany, Unique } from 'sequelize-typescript';
import { Comentario } from './comentario.model';
import { Noticia } from './noticia.model';
import { Partida } from './partida.model';
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
  torneos?: Torneo[];

  @HasMany(() => Partida, { foreignKey: "blancas_id", as: "partidas_blancas" })
  partidas_blancas?: Partida[];

  @HasMany(() => Partida, { foreignKey: "negras_id", as: "partidas_negras" })
  partidas_negras?: Partida[];

  @HasMany(() => Usuario_Torneo, { foreignKey: "usuario_id", as: "usuario_torneos" })
  usuario_torneos?: Usuario_Torneo[];

  @HasMany(() => Noticia, { foreignKey: "autor_id", as: "noticias" })
  noticias?: Noticia[];

  @HasMany(() => Comentario, { foreignKey: "usuario_id", as: "comentarios" })
  comentarios?: Comentario[];

  @Column({ type: DataType.STRING(30), allowNull: false })
  nombre!: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  apellido!: string;

  @Unique
  @Column({ type: DataType.STRING(30), allowNull: false })
  nombre_usuario!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  contrasena_hash!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0})
  administrador!: boolean;

  @Column({ type: DataType.STRING(22) })
  foto_perfil?: string;

  @Column({ type: DataType.DATEONLY })
  fecha_nacimiento?: Date;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_estandar!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_rapido!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  elo_blitz!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas_blancas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas_blancas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas_blancas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas_blancas!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas_negras!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas_negras!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas_negras!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas_negras!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas_estandar!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas_estandar!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas_estandar!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas_estandar!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas_rapido!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas_rapido!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas_rapido!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas_rapido!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_jugadas_blitz!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_ganadas_blitz!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  tablas_blitz!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 1200 })
  partidas_perdidas_blitz!: number;
}