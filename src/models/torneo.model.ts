import { EsAntesOIgual } from '../misc/compare-dates';
import { horarioEnRangoValido } from '../misc/is-valid-time-range';
import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Ronda } from './ronda.model';
import { sumarHorarios } from '../misc/add-hours';
import { Usuario } from './usuario.model';
import { Usuario_Torneo } from './usuario_torneo.model';
import { sumarDias } from '../misc/add-days';

@Table({
  tableName: "torneo",
  timestamps: false,
  indexes: [
    {
      name: "fk_organizador_id_idx",
      fields: ["organizador_id"]
    },
    {
      name: "nombre_organizador_id",
      fields: ["nombre", "organizador_id"],
      unique: true
    }
  ],
  engine: "InnoDB"
})
export class Torneo extends Model<Torneo> {
  private static duracionEstandar: string = "03:00";
  private static duracionRapido: string = "01:00";
  private static duracionBlitz: string = "00:15";
  private static horarioMinimo: string = "08:00";
  private static horarioMaximo: string = "23:00";
  private static minimoJugadores: number = 2;
  private static maximoJugadoresSuizo: number = 128;
  private static maximoJugadoresTCT: number = 20;
  private static maximoJugadoresTCTx2: number = 10;
  private static minimoRondasSuizo: number = 4;
  private static maximoRondasSuizo: number = 10;
  private static limiteDeEspera: number = 30;

  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Ronda, { foreignKey: "torneo_id", as: "rondas" })
  rondas?: Ronda[];

  @HasMany(() => Usuario_Torneo, { foreignKey: "torneo_id", as: "usuario_torneos" })
  usuario_torneos?: Usuario_Torneo[];

  @Column({ type: DataType.STRING(45), allowNull: false, validate: { notEmpty: true }})
  nombre!: string;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  organizador_id?: number;

  @BelongsTo(() => Usuario)
  organizador?: Usuario;

  @Column({ type: DataType.STRING(255), validate: { notEmpty: true }})
  descripcion?: string;

  @Column({ type: DataType.ENUM('Estándar', 'Rápido', 'Blitz'), allowNull: false })
  ritmo!: 'Estándar' | 'Rápido' | 'Blitz';

  @Column({ type: DataType.ENUM('Suizo', 'Todos contra todos', 'Todos contra todos (ida y vuelta)'), allowNull: false })
  sistema_emparejamiento!: 'Suizo' | 'Todos contra todos' | 'Todos contra todos (ida y vuelta)';

  @Column({ type: DataType.TINYINT.UNSIGNED, defaultValue: null })
  cantidad_rondas?: number;

  @Column({ type: DataType.ENUM('Buchholz', 'Buchholz mediano', 'Buchholz -1', 'Sonneborn-Berger'), allowNull: false })
  criterio_desempate!: 'Buchholz' | 'Buchholz mediano' | 'Buchholz -1' | 'Sonneborn-Berger';

  @Column({ type: DataType.DATEONLY, allowNull: false })
  fecha_inicio!: Date;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  intervalo_rondas!: number;

  @Column({ type: DataType.TIME, allowNull: false })
  horario_preferido!: string;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  minimo_jugadores!: number;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  maximo_jugadores!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  minimo_elo!: number;

  @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: false })
  maximo_elo!: number;

  @Column({ type: DataType.ENUM('Pendiente', 'En curso', 'Finalizado', 'Cancelado'), allowNull: false, defaultValue: 'Pendiente' })
  estado!: 'Pendiente' | 'En curso' | 'Finalizado' | 'Cancelado';

  public validarSistemaEmparejamiento(): boolean {
    return (this.sistema_emparejamiento === 'Suizo'
      || this.sistema_emparejamiento === 'Todos contra todos'
      || this.sistema_emparejamiento === 'Todos contra todos (ida y vuelta)');
  }

  public validarRondasSistemaSuizo(): boolean {
    return (this.sistema_emparejamiento !== 'Suizo' && this.cantidad_rondas === undefined);
  }

  public validarCantidadRondas(): boolean {
    return (this.sistema_emparejamiento === 'Suizo'
      && this.cantidad_rondas! >= Torneo.minimoRondasSuizo
      && this.cantidad_rondas! <= Torneo.maximoRondasSuizo);
  }

  public validarFechaInicio(): boolean {
    return !(EsAntesOIgual(this.fecha_inicio, new Date()) || this.fecha_inicio > sumarDias(new Date(), Torneo.limiteDeEspera));
  }

  public validarIntervaloRondas(): boolean {
    return !(!Number.isInteger(this.intervalo_rondas) || this.intervalo_rondas <= 0);
  }

  public validarFormatoHorario(): string | null {
    const duracionRondas: string = this.ritmo === 'Estándar' ? Torneo.duracionEstandar : (this.ritmo === 'Rápido' ? Torneo.duracionRapido : Torneo.duracionBlitz);
    const horasSumadas: string | null = sumarHorarios(this.horario_preferido, duracionRondas);

    return horasSumadas;
  }

  public validarHorario(): boolean {
    const horasSumadas: string | null = this.validarFormatoHorario();
    return !(!horasSumadas || !horarioEnRangoValido(horasSumadas, Torneo.horarioMinimo, Torneo.horarioMaximo));
  }

  public validarCantidadJugadores(): boolean {
    const limitesCoherentes: boolean = (this.minimo_jugadores > this.maximo_jugadores);
    const limitesRespetados: boolean = ((this.sistema_emparejamiento === 'Suizo' ? (this.maximo_jugadores <= Torneo.maximoJugadoresSuizo)
      : (this.sistema_emparejamiento === 'Todos contra todos' ? (this.maximo_jugadores <= Torneo.maximoJugadoresTCT)
      : (this.maximo_jugadores <= Torneo.maximoJugadoresTCTx2 && this.minimo_jugadores >= Torneo.minimoJugadores)))
      && this.minimo_jugadores >= Torneo.minimoJugadores);
    return !(limitesCoherentes && limitesRespetados);
  }

  public validarElo(): boolean {
    return !(this.minimo_elo > this.maximo_elo);
  }

  public validar(): void {
    const BASE_MSG: string = "No se puedo crear el torneo: ";

    if (!this.validarSistemaEmparejamiento()) {
      throw new Error(BASE_MSG + "El sistema de emparejamiento no es válido");
    }

    if (!this.validarRondasSistemaSuizo()) {
      throw new Error(BASE_MSG + "No se puede establecer una cantidad de rondas con un sistema de emparejamiento distinto al suizo");
    }

    if (!this.validarCantidadRondas()) {
      throw new Error(BASE_MSG + "Cantidad de rondas inválida para este sistema de emparejamiento");
    }
    
    if (!this.validarFechaInicio()) {
      throw new Error(BASE_MSG + "La fecha de inicio no puede ser anterior a la fecha actual o mayor a 30 días");
    }

    if (!this.validarIntervaloRondas()) {
      throw new Error(BASE_MSG + "El intervalo de rondas debe ser un número entero mayor a 0");
    }
    
    if (!this.validarHorario()) {
      throw new Error(BASE_MSG + "El horario de inicio de las rondas debe ser una cadena en formato \"HH:MM\" y estar entre las " + Torneo.horarioMinimo + " y " + Torneo.horarioMaximo);
    }

    if (!this.validarCantidadJugadores()) {
      throw new Error(BASE_MSG + "La cantidad mínima de jugadores no puede ser mayor a la cantidad máxima de jugadores");
    }

    if (!this.validarElo()) {
      throw new Error(BASE_MSG + "El Elo mínimo no puede ser mayor al Elo máximo");
    }
  }

  @BeforeCreate
  static validarTorneo(torneo: Torneo): void {
    torneo.validar();
  }

  @BeforeUpdate
  static async validarActualizacion(torneo: Torneo, options: any): Promise<void> {
    const BASE_MSG: string = "No se pudo actualizar el torneo: ";

    if (torneo.previous("estado") === 'Pendiente') {
      torneo.validar();

      // Eliminar las inscripciones de los últimos jugadores en inscribirse hasta que la cantidad de jugadores
      // sea menor o igual a la cantidad máxima de jugadores actualizada

      // Eliminar las inscripciones de los jugadores que no cumplen con los requisitos de Elo actualizados

      // Si se le da inicio, corroborar que la fecha de inicio sea hoy
      // Programación de rondas y partidos EN AFTER UPDATE
    } else if (torneo.previous("estado") === 'En curso') {
      // Verificar que no se quiera cambiar cualquier otra cosa que no sea el estado
      // Cancelación
    } else {
      throw new Error(BASE_MSG + "No se puede modificar un torneo finalizado o cancelado");
    }
  }
}