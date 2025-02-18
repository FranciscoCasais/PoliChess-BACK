import { Usuario_Torneo } from '../models/usuario_torneo.model';

async function getSome(pagina: number): Promise<Usuario_Torneo[]> {
  return await Usuario_Torneo.findAll({
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getOne(id: number): Promise<Usuario_Torneo | null> {
  return await Usuario_Torneo.findByPk(id);
}

async function add(usuario_torneo: Usuario_Torneo): Promise<Usuario_Torneo> {
  return await Usuario_Torneo.create(usuario_torneo);
}

async function update(usuario_torneo: Usuario_Torneo): Promise<[number]> {
  return await Usuario_Torneo.update(usuario_torneo, {
    where: {
      id: usuario_torneo.id
    }
  });
}

async function delete_(id: number): Promise<number> {
  return await Usuario_Torneo.destroy({
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