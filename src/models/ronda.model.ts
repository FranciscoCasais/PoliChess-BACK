import { Table, Model, Column, DataType, PrimaryKey, ForeignKey, HasMany, BelongsTo, BeforeCreate } from 'sequelize-typescript';
import { Partida } from './partida.model';
import { sumarDias } from '../misc/add-days';
import { Torneo } from './torneo.model';

@Table({
  tableName: "ronda",
  timestamps: false,
  indexes: [
    {
      name: "fk_torneo_id_idx",
      fields: ["torneo_id"]
    },
    {
      name: "torneo_id_numero",
      fields: ["torneo_id", "numero"],
      unique: true
    }
  ],
  engine: "InnoDB"
})
export class Ronda extends Model<Ronda> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true })
  id!: number;

  @HasMany(() => Partida, { foreignKey: "ronda_id", as: "partidas" })
  partidas?: Partida[];

  @ForeignKey(() => Torneo)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, onDelete: "CASCADE", onUpdate: "CASCADE" })
  torneo_id!: number;

  @BelongsTo(() => Torneo)
  torneo!: Torneo;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false })
  numero!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  fecha_hora!: Date;

  public async validar(): Promise<void> {
    const BASE_MSG: string = "No se pudo crear la ronda: ";
    const torneo: Torneo | null = await Torneo.findByPk(this.torneo_id);

    if (!torneo) {
      throw new Error(BASE_MSG + "Torneo no encontrado");
    }

    if (torneo.estado !== 'En curso') {
      throw new Error(BASE_MSG + "No se puede ingresar la ronda durante este estado del torneo");
    }
    
    if (this.numero > torneo.cantidad_rondas!) {
      throw new Error(BASE_MSG + "El número de ronda no puede ser mayor a la cantidad de rondas del torneo");
    }

    if (this.numero < 1) {
      throw new Error(BASE_MSG + "El número de ronda no puede ser menor a 1");
    }

    // La fecha y hora ya son validadas en la creación automática de las rondas
    // cuando un torneo pasa de estado "Pendiente" a "En curso"

  }

  @BeforeCreate
  static async validarRonda(ronda: Ronda) {
    ronda.validar();
  }
}