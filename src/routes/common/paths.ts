export default {
  base: "/polichess",
  login: "login",
  usuarios: {
    base: "usuarios",
    getSomeByBusqueda: "pagina/:pagina/busqueda/:busqueda",
    getSomeByElo: "pagina/:pagina/:elo",
    getOne: ":id",
    add: "",
    update: "",
    delete: ":id",
  },
  torneos: {
    base: "torneos",
    getSome: "pagina/:pagina",
    getSomeByBusqueda: "pagina/:pagina/busqueda/:busqueda",
    getSomeByRitmo: "pagina/:pagina/:ritmo",
    getOne: ":id",
    add: "",
    update: "",
    delete: ":id",
    inscripciones: {
      base: "inscripciones",
      getSome: "pagina/:pagina",
      getOne: ":id",
      add: "",
      update: "",
      delete: ":id",
    }
  },
  noticias: {
    base: "noticias",
    getSome: "pagina/:pagina",
    getSomeByBusqueda: "pagina/:pagina/busqueda/:busqueda",
    getOne: ":id",
    add: "",
    update: "",
    delete: ":id",
    comentarios: {
      base: "comentarios",
      getSomeByASC: "pagina/:pagina",
      getSomeByDESC: "pagina/:pagina",
      getOne: ":id",
      add: "",
      update: "",
      delete: ":id",
    }
  }
}