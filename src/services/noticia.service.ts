import { Noticia } from '../models/noticia.model';

async function getSome(pagina: number): Promise<Noticia[]> {
  return await Noticia.findAll({
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getOne(id: number): Promise<Noticia | null> {
  return await Noticia.findByPk(id);
}

async function add(noticia: Noticia): Promise<Noticia> {
  return await Noticia.create(noticia);
}

async function update(noticia: Noticia): Promise<[number]> {
  return await Noticia.update(noticia, {
    where: {
      id: noticia.id
    }
  });
}

async function delete_(id: number): Promise<number> {
  return await Noticia.destroy({
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