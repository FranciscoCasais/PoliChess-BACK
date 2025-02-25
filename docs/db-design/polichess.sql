
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema polichess
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `polichess` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `polichess` ;

-- -----------------------------------------------------
-- Table `polichess`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`usuario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido` VARCHAR(30) NOT NULL,
  `nombre_usuario` VARCHAR(30) NOT NULL,
  `contrasena_hash` VARCHAR(255) NOT NULL,
  `administrador` TINYINT(1) NOT NULL DEFAULT '0',
  `foto_perfil` VARCHAR(255) NULL DEFAULT '/polichess/imagenes/fotoperfildefault.png',
  `fecha_nacimiento` DATE NULL DEFAULT NULL,
  `elo_estandar` DECIMAL(6,2) UNSIGNED NOT NULL DEFAULT '1200.00',
  `elo_rapido` DECIMAL(6,2) UNSIGNED NOT NULL DEFAULT '1200.00',
  `elo_blitz` DECIMAL(6,2) UNSIGNED NOT NULL DEFAULT '1200.00',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_usuario` (`nombre_usuario` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `polichess`.`noticia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`noticia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(150) NOT NULL,
  `copete` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) NULL DEFAULT '/polichess/imagenes/noticiadefault.png',
  `autor_id` INT UNSIGNED NULL DEFAULT NULL,
  `cuerpo` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `titulo` (`titulo` ASC) VISIBLE,
  INDEX `fk_autor_id_idx` (`autor_id` ASC) VISIBLE,
  CONSTRAINT `noticia_ibfk_1`
    FOREIGN KEY (`autor_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `polichess`.`comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`comentario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NULL DEFAULT NULL,
  `noticia_id` INT UNSIGNED NOT NULL,
  `contenido` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_usuario_id_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_noticia_id_idx` (`noticia_id` ASC) VISIBLE,
  CONSTRAINT `comentario_ibfk_51`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `comentario_ibfk_52`
    FOREIGN KEY (`noticia_id`)
    REFERENCES `polichess`.`noticia` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `polichess`.`torneo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`torneo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `organizador_id` INT UNSIGNED NOT NULL,
  `descripcion` VARCHAR(255) NULL DEFAULT NULL,
  `ritmo` ENUM('Estándar', 'Rápido', 'Blitz') NOT NULL,
  `sistema_emparejamiento` ENUM('Suizo', 'Todos contra todos', 'Todos contra todos (ida y vuelta)') NOT NULL,
  `cantidad_rondas` TINYINT UNSIGNED NULL DEFAULT NULL,
  `fecha_hora_inicio` DATETIME NOT NULL,
  `intervalo_rondas` TINYINT UNSIGNED NOT NULL,
  `minimo_jugadores` TINYINT UNSIGNED NOT NULL,
  `maximo_jugadores` TINYINT UNSIGNED NOT NULL,
  `minimo_elo` SMALLINT UNSIGNED NOT NULL,
  `maximo_elo` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nombre_organizador_id` (`nombre` ASC, `organizador_id` ASC) VISIBLE,
  INDEX `fk_organizador_id_idx` (`organizador_id` ASC) VISIBLE,
  CONSTRAINT `torneo_ibfk_1`
    FOREIGN KEY (`organizador_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `polichess`.`usuario_torneo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `polichess`.`usuario_torneo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NULL DEFAULT NULL,
  `torneo_id` INT UNSIGNED NOT NULL,
  `elo_inicial` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_id_torneo_id` (`usuario_id` ASC, `torneo_id` ASC) VISIBLE,
  INDEX `fk_usuario_id_idx2` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_torneo_id_idx2` (`torneo_id` ASC) VISIBLE,
  CONSTRAINT `usuario_torneo_ibfk_51`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `polichess`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `usuario_torneo_ibfk_52`
    FOREIGN KEY (`torneo_id`)
    REFERENCES `polichess`.`torneo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=1;
SET UNIQUE_CHECKS=1;
