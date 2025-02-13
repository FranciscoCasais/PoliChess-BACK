import { Table, Model, Column, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';

@Table({
  tableName: "usuario",
  timestamps: false
})
export class Usuario extends Model<Usuario> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  /* Por ahora comento al ser posible que una columna booleana "organizador" en Usuario_Torneo sea más conveniente
  @HasMany(() => Torneo, { foreignKey: "organizador_id", as: "organizador_id" })
  torneos?: Torneo[];
  */

  /* Por ahora comento para que no dé error al no existir todavía los modelos necesarios
  @HasMany(() => Partida, { foreignKey: "blancas_id", as: "blancas_id" })
  partidas_blancas?: Partida[];

  @HasMany(() => Partida, { foreignKey: "negras_id", as: "negras_id" })
  partidas_negras?: Partida[];

  @HasMany(() => Usuario_Torneo, { foreignKey: "usuario_id", as: "usuario_id" })
  usuario_torneos?: Usuario_Torneo[];

  @HasMany(() => Historial, { foreignKey: "usuario_id", as: "usuario_id" })
  historiales?: Historial[];

  @HasMany(() => Noticia, { foreignKey: "autor_id", as: "autor_id" })
  noticias?: Noticia[];

  @HasMany(() => Comentario, { foreignKey: "usuario_id", as: "usuario_id" })
  comentarios?: Comentario[];
  */

  @Column({ type: DataType.STRING(30), allowNull: false })
  nombre!: string;

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