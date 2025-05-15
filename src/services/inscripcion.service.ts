import { Usuario_Torneo } from '../models/usuario_torneo.model';
import { Torneo } from '../models/torneo.model';
import { Usuario } from '../models/usuario.model';


async function getSome(pagina: number): Promise<Usuario_Torneo[]> {
  return await Usuario_Torneo.findAll({
    limit: 15,
    offset: (pagina - 1) * 15,
    include: [
      {
        model: Usuario,
        attributes: ['id', 'nombre_usuario']  // Aquí pides solo lo necesario
      }
    ]
  });
}


async function getOne(id: number): Promise<Usuario_Torneo | null> {
  return await Usuario_Torneo.findByPk(id);
}

async function add(inscripcion: { usuario_id: number, torneo_id: number }): Promise<Usuario_Torneo> {
  const usuario = await Usuario.findByPk(inscripcion.usuario_id);
  const torneo = await Torneo.findByPk(inscripcion.torneo_id);

  if (!usuario || !torneo) {
    throw new Error("Usuario o torneo no encontrado.");
  }

 /* if (torneo.estado !== 'Pendiente') {
    throw new Error("El torneo no está en estado Pendiente.");
  } */

 /* if (torneo.jugadores_actuales >= torneo.maximo_jugadores) {
    throw new Error("El torneo ya está completo.");
  } */

  const elo =  usuario.elo_estandar;

  return await Usuario_Torneo.create({
  usuario_id: inscripcion.usuario_id,
  torneo_id: inscripcion.torneo_id,
  elo_inicial: elo,
} as any);

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
async function getByUsuarioYTorneo(usuarioId: number, torneoId: number): Promise<Usuario_Torneo | null> {
  return await Usuario_Torneo.findOne({
    where: {
      usuario_id: usuarioId,
      torneo_id: torneoId
    }
  });
}

async function getAllByTorneo(torneoId: number): Promise<Usuario_Torneo[]> {
  return await Usuario_Torneo.findAll({
    where: { torneo_id: torneoId },
    include: [Usuario], // 👈 Esto trae el nombre_usuario
  });
}


export default {
  getSome,
  getOne,
  add,
  update,
  delete: delete_,
  getByUsuarioYTorneo,
  getAllByTorneo
} as const;