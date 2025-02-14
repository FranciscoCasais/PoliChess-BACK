
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema polichess
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `polichess` DEFAULT CHARACTER SET utf8mb4;
USE `polichess`;

-- -----------------------------------------------------
-- Table `polichess`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`usuario` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido` VARCHAR(30) NOT NULL,
  `nombre_usuario` VARCHAR(30) NOT NULL UNIQUE,
  `contrasena_hash` VARCHAR(255) NOT NULL,
  `administrador` BOOLEAN NOT NULL DEFAULT 0,
  `foto_perfil` VARCHAR(22),
  `fecha_nacimiento` DATE,
  `elo_estandar` SMALLINT UNSIGNED NOT NULL DEFAULT 1200,
  `elo_rapido` SMALLINT UNSIGNED NOT NULL DEFAULT 1200,
  `elo_blitz` SMALLINT UNSIGNED NOT NULL DEFAULT 1200,
  `partidas_jugadas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_jugadas_blancas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas_blancas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas_blancas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas_blancas` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_jugadas_negras` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas_negras` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas_negras` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas_negras` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_jugadas_estandar` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas_estandar` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas_estandar` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas_estandar` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_jugadas_rapido` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas_rapido` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas_rapido` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas_rapido` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_jugadas_blitz` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_ganadas_blitz` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `tablas_blitz` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `partidas_perdidas_blitz` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`torneo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`torneo` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `organizador_id` INT UNSIGNED,
  `descripcion` VARCHAR(255),
  `ritmo` ENUM('Estándar', 'Rápido', 'Blitz') NOT NULL,
  `sistema_emparejamiento` ENUM('Suizo', 'Todos contra todos', 'Todos contra todos (ida y vuelta)') NOT NULL,
  `cantidad_rondas` TINYINT UNSIGNED,
  `criterio_desempate` ENUM('Buchholz', 'Buchholz mediano', 'Buchholz -1', 'Sonneborn-Berger') NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `intervalo_rondas` TINYINT UNSIGNED NOT NULL,
  `horario_preferido` TIME NOT NULL,
  `minimo_jugadores` TINYINT UNSIGNED NOT NULL,
  `maximo_jugadores` TINYINT UNSIGNED NOT NULL,
  `minimo_elo` SMALLINT UNSIGNED NOT NULL,
  `maximo_elo` SMALLINT UNSIGNED NOT NULL,
  `estado` ENUM('Pendiente', 'En curso', 'Finalizado', 'Cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_organizador_id` (`nombre`, `organizador_id`),
  INDEX `fk_organizador_id_idx` (`organizador_id`),
  CONSTRAINT `fk_organizador_id`
    FOREIGN KEY (`organizador_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`ronda`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`ronda` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `torneo_id` INT UNSIGNED NOT NULL,
  `numero` TINYINT UNSIGNED NOT NULL,
  `fecha_hora` DATETIME NOT NULL,

  -- Debería ser clave primaria compuesta, pero Sequelize-TypeScript no lo permite
  -- PRIMARY KEY (`id`, `torneo_id`),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `torneo_id_numero` (`torneo_id`, `numero`),
  INDEX `fk_torneo_id_idx` (`torneo_id`),
  CONSTRAINT `fk_torneo_id`
    FOREIGN KEY (`torneo_id`)
    REFERENCES `polichess`.`torneo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`partida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`partida` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `ronda_id` INT UNSIGNED NOT NULL,
  `blancas_id` INT UNSIGNED,
  `negras_id` INT UNSIGNED,
  `resultado` ENUM('Blancas', 'Negras', 'Tablas', 'Cancelado'),

  -- Debería ser clave primaria compuesta, pero Sequelize-TypeScript no lo permite
  -- PRIMARY KEY (`id`, `ronda_id`),

  PRIMARY KEY (`id`),
  INDEX `fk_ronda_id_idx` (`ronda_id`),
  INDEX `fk_blancas_id_idx` (`blancas_id`),
  INDEX `fk_negras_id_idx` (`negras_id`),
  CONSTRAINT `fk_ronda_id`
    FOREIGN KEY (`ronda_id`)
    REFERENCES `polichess`.`ronda` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_blancas_id`
    FOREIGN KEY (`blancas_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_negras_id`
    FOREIGN KEY (`negras_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`usuario_torneo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`usuario_torneo` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED,
  `torneo_id` INT UNSIGNED NOT NULL,
  `elo_inicial` SMALLINT UNSIGNED NOT NULL,
  `estado_usuario` ENUM('Activo', 'Vetado', 'Eliminado') NOT NULL,
  `puntaje` TINYINT UNSIGNED NULL,
  `posicion` TINYINT UNSIGNED NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_id_torneo_id` (`usuario_id`, `torneo_id`),
  INDEX `fk_usuario_id_idx2` (`usuario_id`),
  INDEX `fk_torneo_id_idx2` (`torneo_id`),
  CONSTRAINT `fk_usuario_id2`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_torneo_id2`
    FOREIGN KEY (`torneo_id`)
    REFERENCES `polichess`.`torneo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`noticia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`noticia` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `titulo` VARCHAR(150) NOT NULL,
  `copete` VARCHAR(255) NOT NULL,
  `imagen` MEDIUMBLOB,
  `autor_id` INT UNSIGNED,
  
  -- Innecesarias gracias a los "timestamps" de Sequelize-TypeScript
  -- `publicado` DATETIME NOT NULL DEFAULT NOW(),
  -- `editado` DATETIME ON UPDATE NOW(),
  
  `cuerpo` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `titulo_autor_id` (`titulo`, `autor_id`),
  INDEX `fk_autor_id_idx` (`autor_id`),
  CONSTRAINT `fk_autor_id`
    FOREIGN KEY (`autor_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `polichess`.`comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`comentario` (
  `id` INT UNSIGNED AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED,
  `noticia_id` INT UNSIGNED NOT NULL,
  
  -- Innecesarias gracias a los "timestamps" de Sequelize-TypeScript
  -- `publicado` DATETIME NOT NULL DEFAULT NOW(),
  -- `editado` DATETIME ON UPDATE NOW(),
  
  `contenido` TEXT NOT NULL,
  
  PRIMARY KEY (`id`),
  INDEX `fk_usuario_id_idx` (`usuario_id`),
  INDEX `fk_noticia_id_idx` (`noticia_id`),
  CONSTRAINT `fk_usuario_id`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_noticia_id`
    FOREIGN KEY (`noticia_id`)
    REFERENCES `polichess`.`noticia` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=1;
SET UNIQUE_CHECKS=1;
