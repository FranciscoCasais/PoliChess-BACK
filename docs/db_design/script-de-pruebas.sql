
DROP DATABASE `polichess`;
CREATE DATABASE IF NOT EXISTS `polichess`;
USE `polichess`;
SHOW TABLES FROM `polichess`;


-- Asegurarse de que las restricciones de claves foráneas y unicidad se validen
SELECT @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 1;
SELECT @@UNIQUE_CHECKS;
SET UNIQUE_CHECKS = 1;


-- Asegurarse de que las columnas requeridas admitan valores nulos
SELECT TABLE_NAME, COLUMN_NAME, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'polichess'
AND COLUMN_NAME IN ('usuario_id', 'organizador_id', 'blancas_id', 'negras_id');


-- Obtener filas
SELECT * FROM `polichess`.`usuario`;
SELECT * FROM `polichess`.`torneo`;
SELECT * FROM `polichess`.`ronda`;
SELECT * FROM `polichess`.`partida`;
SELECT * FROM `polichess`.`usuario_torneo`;
SELECT * FROM `polichess`.`noticia`;
SELECT * FROM `polichess`.`comentario`;


-- Limpiar tablas
DELETE FROM `polichess`.`usuario`;
DELETE FROM `polichess`.`torneo`;
DELETE FROM `polichess`.`ronda`;
DELETE FROM `polichess`.`partida`;
DELETE FROM `polichess`.`usuario_torneo`;
DELETE FROM `polichess`.`noticia`;
DELETE FROM `polichess`.`comentario`;


-- Inserciones
INSERT INTO `polichess`.`usuario` (`id`, `nombre`, `apellido`, `nombre_usuario`, `contrasena_hash`) VALUES
	(1, 'Sapo', 'Peluquería', 'Sapo Peluquería', 'megatone1890');

INSERT INTO `polichess`.`usuario` (`id`, `nombre`, `apellido`, `nombre_usuario`, `contrasena_hash`) VALUES
	(2, 'Sapo', 'Arquitectura', 'Sapo Aquitectura', 'remeratermica00');

INSERT INTO `polichess`.`torneo`
	(`id`,
    `nombre`,
	`organizador_id`,
	`ritmo`,
    `sistema_emparejamiento`,
    `criterio_desempate`,
    `fecha_inicio`,
    `intervalo_rondas`,
    `horario_preferido`,
    `minimo_jugadores`,
    `maximo_jugadores`,
    `minimo_elo`,
    `maximo_elo`,
	`estado`) VALUES
	(1,
    'Torneo de Sapo Peluquería',
    1,
    'Estándar',
    'Todos contra todos (ida y vuelta)',
    'Buchholz',
    '2025-2-24',
    7,
    '12:15:00',
    5,
    20,
    1000,
    0,
    'Pendiente');

INSERT INTO `polichess`.`ronda` (`id`, `torneo_id`, `numero`, `fecha_hora`) VALUES
	(1,
    1,
    1,
    '2025-2-28 12:15:00');

INSERT INTO `polichess`.`partida` (`id`, `ronda_id`, `blancas_id`, `negras_id`) VALUES
	(1, 1, 1, 2);
    
INSERT INTO `polichess`.`usuario_torneo` (`id`, `usuario_id`, `torneo_id`, `elo_inicial`) VALUES
	(1, 1, 1, 1200);

INSERT INTO `polichess`.`usuario_torneo` (`id`, `usuario_id`, `torneo_id`, `elo_inicial`) VALUES
	(2, 2, 1, 1200);

INSERT INTO `polichess`.`noticia` (`id`, `titulo`, `copete`, `autor_id`, `cuerpo`) VALUES
	(1, 'Muere Sapo Arquitectura a los 135 años de edad',
    'El hombre que supo ser el mejor jugador del Arquitectura murió el sábado pasado de hipotermia por olvidar ponerse su remera térmica',
    1,
    'Párrafo 1\nPárrafo 2\nPárrafo 3');

INSERT INTO `polichess`.`comentario` (`id`, `usuario_id`, `noticia_id`, `contenido`) VALUES
	(1, 1, 1, 'BUENA PELU');
