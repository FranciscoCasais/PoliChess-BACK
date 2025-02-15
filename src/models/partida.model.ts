import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, BelongsTo, BeforeCreate } from 'sequelize-typescript';
import { Ronda } from './ronda.model';
import { Torneo } from './torneo.model';
import { Usuario } from './usuario.model';
import { Usuario_Torneo } from './usuario_torneo.model';

@Table({
  tableName: "partida",
  timestamps: false,
  indexes: [
    {
      name: "fk_ronda_id_idx",
      fields: ["ronda_id"]
    },
    {
      name: "fk_blancas_id_idx",
      fields: ["blancas_id"]
    },
    {
      name: "fk_negras_id_idx",
      fields: ["negras_id"]
    }
  ],
  engine: "InnoDB"
})
export class Partida extends Model<Partida> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Ronda)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  ronda_id!: number;

  @BelongsTo(() => Ronda)
  ronda!: Ronda;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  blancas_id?: number;

  @BelongsTo(() => Usuario)
  blancas?: Usuario;

  @ForeignKey(() => Usuario)
  @Column({ type: DataType.INTEGER.UNSIGNED, onDelete: "SET NULL", onUpdate: "CASCADE" })
  negras_id?: number;

  @BelongsTo(() => Usuario)
  negras?: Usuario;

  @Column({ type: DataType.ENUM('Blancas', 'Negras', 'Tablas', 'Cancelado'), defaultValue: null })
  resultado?: 'Blancas' | 'Negras' | 'Tablas' | 'Cancelado';

  public validarCantidadPartidasRonda(ronda: Ronda): boolean {
    const jugadoresSonPar: boolean = ronda.torneo.usuario_torneos!.length % 2 === 0;
    const cantidadPartidasPorRonda: number = jugadoresSonPar ? ronda.torneo.usuario_torneos!.length / 2 : (ronda.torneo.usuario_torneos!.length - 1) / 2;

    return !((ronda.partidas?.length ?? 0) === cantidadPartidasPorRonda);
  }

  public async validarJugadores(ronda: Ronda): Promise<boolean> {
    const blancas: Usuario | null = await Usuario.findByPk(this.blancas_id);
    const negras: Usuario | null = await Usuario.findByPk(this.negras_id);

    return !(!blancas || !negras ||
      ronda.torneo.usuario_torneos!.findIndex(ut => ut.usuario_id === this.blancas_id) === -1 ||
      ronda.torneo.usuario_torneos!.findIndex(ut => ut.usuario_id === this.negras_id) === -1
    );
  }

  public async validar(): Promise<void> {
    const BASE_MSG: string = "No se pudo crear la partida: ";
    
    const ronda: Ronda | null = await Ronda.findByPk(this.ronda_id, { 
      include: [{ 
        model: Torneo, 
        include: [Usuario_Torneo] 
      }] 
    });

    if (!ronda) {
      throw new Error(BASE_MSG + "Ronda no encontrada");
    }
    
    if(!this.validarCantidadPartidasRonda(ronda)) {
      throw new Error(BASE_MSG + "La ronda ya tiene la cantidad de partidas necesarias");
    }
    
    if(!this.validarJugadores(ronda)) {
      throw new Error(BASE_MSG + "Jugador(es) no encontrado(s) o no inscripto(s) en el torneo");
    }
  }

  @BeforeCreate
  static async validarPartida(partida: Partida): Promise<void> {
    partida.validar();
  }
}