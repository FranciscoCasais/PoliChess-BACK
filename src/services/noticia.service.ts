import { Noticia } from '../models/noticia.model';
import { Op } from 'sequelize';

async function getSome(pagina: number): Promise<Noticia[]> {
  return await Noticia.findAll({
    order: [['createdAt', 'DESC']],
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getSomeByBusqueda(busqueda: string, pagina: number): Promise<Noticia[]> {
  return await Noticia.findAll({
    where: {
      titulo: {
        [Op.like]: `%${busqueda}%`
      }
    },
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
  getSomeByBusqueda,
  getOne,
  add,
  update,
  delete: delete_
} as const;