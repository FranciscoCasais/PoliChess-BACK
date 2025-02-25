import { Usuario } from '../models/usuario.model';
import { Op } from 'sequelize';

async function getSomeByBusqueda(busqueda: string, pagina: number): Promise<Usuario[]> {
  return await Usuario.findAll({
    where: {
      [Op.or]: [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { apellido: { [Op.like]: `%${busqueda}%` } },
        { nombre_usuario: { [Op.like]: `%${busqueda}%` } }
      ]
    },
    limit: 10,
    offset: (pagina - 1) * 10
  })
}

async function getSomeByElo(elo: string, pagina: number): Promise<Usuario[]> {
  const eloAFiltrar: string = elo === 'Estándar' ? 'estandar' : (elo === 'Rápido' ? 'rapido' : 'blitz');

  return await Usuario.findAll({
    order: [[`elo_${eloAFiltrar}`, 'DESC']],
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getOne(id: number): Promise<Usuario | null> {
  return await Usuario.findByPk(id);
}

async function add(usuario: Usuario): Promise<Usuario> {
  return await Usuario.create(usuario);
}

async function update(usuario: Usuario): Promise<[number]> {
  return await Usuario.update(usuario, {
    where: {
      id: usuario.id
    }
  });
}

async function delete_(id: number): Promise<number> {
  return await Usuario.destroy({
    where: {
      id: id
    }
  });
}

export default {
  getSomeByBusqueda,
  getSomeByElo,
  getOne,
  add,
  update,
  delete: delete_
} as const;