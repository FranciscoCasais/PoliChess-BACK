import { Torneo } from '../models/torneo.model';
import { Op } from 'sequelize';

async function getSome(pagina: number): Promise<Torneo[]> {
  const hoy: Date = new Date();

  return await Torneo.findAll({
    limit: 10,
    offset: (pagina - 1) * 10,
    where: {
      fecha_hora_inicio: {
        [Op.gte]: hoy
      }
    },
    order: [['fecha_hora_inicio', 'ASC']]
  });
}

async function getSomeByBusqueda(busqueda: string, pagina: number): Promise<Torneo[]> {
  return await Torneo.findAll({
    where: {
      nombre: {
        [Op.like]: `%${busqueda}%`
      }
    },
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getSomeByRitmo(ritmo: string, pagina: number): Promise<Torneo[]> {
  const ritmoAFiltrar: string = ritmo === 'estandar' ? 'Estándar' : (ritmo === 'rapido' ? 'Rápido' : 'Blitz');

  return await Torneo.findAll({
    where: { ritmo: ritmoAFiltrar },
    limit: 10,
    offset: (pagina - 1) * 10
  })
}

async function getOne(id: number): Promise<Torneo | null> {
  return await Torneo.findByPk(id);
}

async function add(torneo: Torneo): Promise<Torneo> {
  return await Torneo.create(torneo);
}

async function update(torneo: Torneo): Promise<[number]> {
  return await Torneo.update(torneo, {
    where: {
      id: torneo.id
    }
  });
}

async function delete_(id: number): Promise<number> {
  return await Torneo.destroy({
    where: {
      id: id
    }
  });
}

export default {
  getSome,
  getSomeByBusqueda,
  getSomeByRitmo,
  getOne,
  add,
  update,
  delete: delete_
} as const;