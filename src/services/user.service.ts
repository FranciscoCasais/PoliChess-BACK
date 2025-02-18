import { Usuario } from '../models/usuario.model';

async function getSome(pagina: number): Promise<Usuario[]> {
  return await Usuario.findAll({
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
  getSome,
  getOne,
  add,
  update,
  delete: delete_
} as const;