import { Torneo } from '../models/torneo.model';

async function getSome(pagina: number): Promise<Torneo[]> {
  return await Torneo.findAll({
    limit: 10,
    offset: (pagina - 1) * 10
  });
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
  getOne,
  add,
  update,
  delete: delete_
} as const;