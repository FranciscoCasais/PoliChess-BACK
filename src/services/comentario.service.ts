import { Comentario } from '../models/comentario.model';

async function getSomeByASC(idNoticia: number, pagina: number): Promise<Comentario[]> {
  return await Comentario.findAll({
    where: { noticia_id: idNoticia },
    order: [['createdAt', 'ASC']],
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getSomeByDESC(idNoticia: number, pagina: number): Promise<Comentario[]> {
  return await Comentario.findAll({
    where: { noticia_id: idNoticia },
    order: [['createdAt', 'DESC']],
    limit: 10,
    offset: (pagina - 1) * 10
  });
}

async function getOne(id: number): Promise<Comentario | null> {
  return await Comentario.findByPk(id);
}

async function add(comentario: Comentario): Promise<Comentario> {
  return await Comentario.create(comentario);
}

async function update(comentario: Comentario): Promise<[number]> {
  return await Comentario.update(comentario, {
    where: {
      id: comentario.id
    }
  });
}

async function delete_(id: number): Promise<number> {
  return await Comentario.destroy({
    where: {
      id: id
    }
  });
}

export default {
  getSomeByASC,
  getSomeByDESC,
  getOne,
  add,
  update,
  delete: delete_
} as const;