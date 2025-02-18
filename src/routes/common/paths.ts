export default {
  base: "/polichess",
  login: "login",
  perfil: "perfil",
  usuarios: {
    base: "usuarios",
    getSome: "pagina/:pagina",
    getOne: ":id",
    add: "",
    update: "",
    delete: ":id",
  },
  torneos: {
    base: "torneos",
    getSome: "pagina/:pagina",
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
    getOne: ":id",
    add: "",
    update: "",
    delete: ":id",
    comentarios: {
      base: "comentarios",
      getSome: "pagina/:pagina",
      getOne: ":id",
      add: "",
      update: "",
      delete: ":id",
    }
  }
}