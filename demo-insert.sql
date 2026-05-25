-- ============================================================
-- INSERTAR DATOS DEMO EN GROOVELINK
-- Requiere pgcrypto: CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Pass de todos los usuarios: 123456
-- EJECUTAR PRIMERO: demo-delete.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- APTITUDES
-- ============================================================
INSERT INTO aptitud (nombre) VALUES ('Cocina');
INSERT INTO aptitud (nombre) VALUES ('Baile');
INSERT INTO aptitud (nombre) VALUES ('Fotografía');
INSERT INTO aptitud (nombre) VALUES ('Pintura');
INSERT INTO aptitud (nombre) VALUES ('Lectura');
INSERT INTO aptitud (nombre) VALUES ('Deportes');
INSERT INTO aptitud (nombre) VALUES ('Música');
INSERT INTO aptitud (nombre) VALUES ('Viajes');
INSERT INTO aptitud (nombre) VALUES ('Yoga');
INSERT INTO aptitud (nombre) VALUES ('Gaming');
INSERT INTO aptitud (nombre) VALUES ('Escritura');
INSERT INTO aptitud (nombre) VALUES ('Cine');
INSERT INTO aptitud (nombre) VALUES ('Running');
INSERT INTO aptitud (nombre) VALUES ('Idiomas');
INSERT INTO aptitud (nombre) VALUES ('Voluntariado');

-- ============================================================
-- GENEROS MUSICALES
-- ============================================================
INSERT INTO genero (nombre) VALUES ('Rock');
INSERT INTO genero (nombre) VALUES ('Pop');
INSERT INTO genero (nombre) VALUES ('Electrónica');
INSERT INTO genero (nombre) VALUES ('Jazz');
INSERT INTO genero (nombre) VALUES ('Reggaeton');
INSERT INTO genero (nombre) VALUES ('Clásica');
INSERT INTO genero (nombre) VALUES ('Hip-Hop');
INSERT INTO genero (nombre) VALUES ('Indie');
INSERT INTO genero (nombre) VALUES ('Flamenco');
INSERT INTO genero (nombre) VALUES ('R&B');
INSERT INTO genero (nombre) VALUES ('Soul');
INSERT INTO genero (nombre) VALUES ('Metal');
INSERT INTO genero (nombre) VALUES ('Blues');
INSERT INTO genero (nombre) VALUES ('Funk');
INSERT INTO genero (nombre) VALUES ('Alternativo');

-- ============================================================
-- USUARIOS (base) + PERSONAS (subclase JOINED)
-- ============================================================

-- admin
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('admin', 'admin@example.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '90 days', 'ROLE_ADMIN');
INSERT INTO administrador (id, cargo) VALUES (currval('usuario_id_seq'), 'SUPERADMIN');

-- carlos_garcia
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('carlos_garcia', 'carlos@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '60 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- maria_lopez
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('maria_lopez', 'maria@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '50 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- alejandro_m
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('alejandro_m', 'alejandro@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '45 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- laura_sevilla
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('laura_sevilla', 'laura@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '40 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- david_ruiz
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('david_ruiz', 'david@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '35 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- ana_perez
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('ana_perez', 'ana@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '30 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- javi_rodri
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('javi_rodri', 'javi@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '25 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- sara_mm
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('sara_mm', 'sara@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '20 days', 'ROLE_USER');
INSERT INTO persona (id) VALUES (currval('usuario_id_seq'));

-- ============================================================
-- PERFILES
-- ============================================================
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'carlos_garcia'),
    'Me gusta salir de fiesta y concer gente nueva. Ultimamente estoy aprendiendo a tocar la guitarra.',
    'Madrid', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'maria_lopez'),
    'Soy de Barcelona pero vivo en Madrid por estudios. Busco gente para hacer planes!',
    'Madrid', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'alejandro_m'),
    'Apasionado del deporte y la naturaleza. Escapo a la montaña siempre que puedo. Tambien me gusta la fotografia.',
    'Valencia', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'laura_sevilla'),
    'Fotógrafa aficionada, me encanta capturar momentos. Tambien me gusta cocinar y viajar!',
    'Sevilla', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'david_ruiz'),
    'Ingeniero de dia, musico de noche. Toco la bateria en una banda de rock local.',
    'Bilbao', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'ana_perez'),
    'Estudiante de bellas artes. Me encanta pintar y ir a exposiciones. También hago yoga.',
    'Granada', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'javi_rodri'),
    'Gamer y amante de la tecnologia. Me gusta el cine y los planes tranquilos.',
    'Zaragoza', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'sara_mm'),
    'Viajera empedernida, he visitado 15 paises. Ahora busco gente para planes por Malaga!',
    'Málaga', NOW()
);

-- ============================================================
-- PERSONA - APTITUDES
-- ============================================================
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'carlos_garcia' AND a.nombre IN ('Baile', 'Música', 'Cine');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'maria_lopez' AND a.nombre IN ('Cocina', 'Fotografía', 'Lectura');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'alejandro_m' AND a.nombre IN ('Deportes', 'Fotografía', 'Viajes');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'laura_sevilla' AND a.nombre IN ('Cocina', 'Fotografía', 'Viajes');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'david_ruiz' AND a.nombre IN ('Música', 'Cine', 'Running');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'ana_perez' AND a.nombre IN ('Pintura', 'Yoga', 'Voluntariado');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'javi_rodri' AND a.nombre IN ('Gaming', 'Cine', 'Idiomas');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'sara_mm' AND a.nombre IN ('Viajes', 'Running', 'Voluntariado');

-- ============================================================
-- PERSONA - GENEROS
-- ============================================================
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'carlos_garcia' AND g.nombre IN ('Rock', 'Pop', 'Indie');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'maria_lopez' AND g.nombre IN ('Pop', 'Jazz', 'Flamenco');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'alejandro_m' AND g.nombre IN ('Hip-Hop', 'Funk', 'Alternativo');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'laura_sevilla' AND g.nombre IN ('Jazz', 'Flamenco', 'Metal');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'david_ruiz' AND g.nombre IN ('Rock', 'Metal', 'Blues');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'ana_perez' AND g.nombre IN ('Indie', 'Alternativo', 'Flamenco');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'javi_rodri' AND g.nombre IN ('Hip-Hop', 'Electrónica', 'Alternativo');
INSERT INTO persona_generos (id_usuario, id_genero)
SELECT u.id, g.id FROM usuario u, genero g WHERE u.username = 'sara_mm' AND g.nombre IN ('Pop', 'Electrónica', 'Clásica');

-- ============================================================
-- EVENTOS
-- ============================================================
INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Noche de Jazz en el Casco Antiguo',
    'Barrio de las Letras, Madrid',
    'Ven a disfrutar de una noche de jazz en el barrio antiguo. Habra musica en directo y cocteles. Entrada gratuita hasta completar aforo! Tambien tendremos jam session abierta para quien quiera unirse al final.',
    CURRENT_DATE + 5, CURRENT_DATE + 5,
    (SELECT id FROM usuario WHERE username = 'carlos_garcia'),
    NOW() - INTERVAL '14 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Jazz'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Taller de Cocina Italiana',
    'Calle Mayor 23, Madrid',
    'Aprende a hacer pasta desde cero con ingredientes frescos. Vamos a cocinar raviolis y tiramisú. Despues nos lo comemos todo juntos. Plazas limitadas!',
    CURRENT_DATE + 12, CURRENT_DATE + 12,
    (SELECT id FROM usuario WHERE username = 'maria_lopez'),
    NOW() - INTERVAL '10 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Cocina'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Pop'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Ruta de Senderismo por la Sierra',
    'Puerto de Navacerrada, Madrid',
    'Ruta guiada por la sierra con vistas espectaculares. Dificultad baja-media, apto para principiantes. Llevar agua y calzado comodo. Comemos alli, cada uno lleva su tupper!',
    CURRENT_DATE + 8, CURRENT_DATE + 8,
    (SELECT id FROM usuario WHERE username = 'alejandro_m'),
    NOW() - INTERVAL '8 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Deportes'));
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Viajes'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Indie'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Torneo de Videojuegos Retro',
    'Game Over Bar, Calle Fuencarral 45, Madrid',
    'Torneo de juegos retro con premios! Tendremos Street Fighter, Mario Kart y Guitar Hero. Inscripcion 5€ incluye una consumicion. Os esperamos!',
    CURRENT_DATE + 3, CURRENT_DATE + 3,
    (SELECT id FROM usuario WHERE username = 'javi_rodri'),
    NOW() - INTERVAL '6 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Gaming'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Hip-Hop'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Exposición de Fotografía Urbana',
    'Galería La Fábrica, C/Alameda 12, Sevilla',
    'Exposición colectiva de fotografia urbana con artistas locales. Despues de la expo haremos un recorrido fotografico por el barrio de Triana.',
    CURRENT_DATE + 15, CURRENT_DATE + 17,
    (SELECT id FROM usuario WHERE username = 'laura_sevilla'),
    NOW() - INTERVAL '5 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Fotografía'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Flamenco'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Jam Session de Rock',
    'La Rock House, Bilbao',
    'Jam session abierta para musicos de todos los niveles. Trae tu instrumento y unete! Hay amplis y bateria. Desde las 20:00 hasta que el cuerpo aguante.',
    CURRENT_DATE + 10, CURRENT_DATE + 10,
    (SELECT id FROM usuario WHERE username = 'david_ruiz'),
    NOW() - INTERVAL '4 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Rock'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Metal'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Blues'));

-- ============================================================
-- AMISTADES (ACEPTADAS)
-- ============================================================
INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT c.id, m.id, 'ACEPTADA', NOW() - INTERVAL '30 days'
FROM usuario c, usuario m WHERE c.username = 'carlos_garcia' AND m.username = 'maria_lopez';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT c.id, a.id, 'ACEPTADA', NOW() - INTERVAL '25 days'
FROM usuario c, usuario a WHERE c.username = 'carlos_garcia' AND a.username = 'alejandro_m';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT m.id, l.id, 'ACEPTADA', NOW() - INTERVAL '20 days'
FROM usuario m, usuario l WHERE m.username = 'maria_lopez' AND l.username = 'laura_sevilla';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT m.id, a.id, 'ACEPTADA', NOW() - INTERVAL '18 days'
FROM usuario m, usuario a WHERE m.username = 'maria_lopez' AND a.username = 'ana_perez';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT a.id, d.id, 'ACEPTADA', NOW() - INTERVAL '15 days'
FROM usuario a, usuario d WHERE a.username = 'alejandro_m' AND d.username = 'david_ruiz';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT a.id, j.id, 'ACEPTADA', NOW() - INTERVAL '12 days'
FROM usuario a, usuario j WHERE a.username = 'alejandro_m' AND j.username = 'javi_rodri';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT l.id, s.id, 'ACEPTADA', NOW() - INTERVAL '10 days'
FROM usuario l, usuario s WHERE l.username = 'laura_sevilla' AND s.username = 'sara_mm';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT d.id, an.id, 'ACEPTADA', NOW() - INTERVAL '8 days'
FROM usuario d, usuario an WHERE d.username = 'david_ruiz' AND an.username = 'ana_perez';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT an.id, j.id, 'ACEPTADA', NOW() - INTERVAL '6 days'
FROM usuario an, usuario j WHERE an.username = 'ana_perez' AND j.username = 'javi_rodri';

INSERT INTO solicitud_amistad (id_solicitante, id_solicitado, estado, fecha_solicitud)
SELECT j.id, s.id, 'ACEPTADA', NOW() - INTERVAL '4 days'
FROM usuario j, usuario s WHERE j.username = 'javi_rodri' AND s.username = 'sara_mm';

-- ============================================================
-- PARTICIPACIONES EN EVENTOS (asistencias + likes)
-- ============================================================
INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '5 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Torneo de Videojuegos Retro';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Torneo de Videojuegos Retro';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '7 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Taller de Cocina Italiana';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '6 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Taller de Cocina Italiana';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Ruta de Senderismo por la Sierra';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Ruta de Senderismo por la Sierra';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'laura_sevilla' AND e.nombre = 'Exposición de Fotografía Urbana';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '5 days'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Jam Session de Rock';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '6 days'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Taller de Cocina Italiana';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '5 days'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Taller de Cocina Italiana';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Ruta de Senderismo por la Sierra';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '7 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Torneo de Videojuegos Retro';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '6 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Torneo de Videojuegos Retro';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Exposición de Fotografía Urbana';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Exposición de Fotografía Urbana';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Exposición de Fotografía Urbana';

-- ============================================================
-- COMENTARIOS EN EVENTOS
-- ============================================================
INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Muy buen evento, lo recomiendo!! El jazz estuvo increible.', 3, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'La semana pasada fui y me encanto. Este finde repito jaja', 5, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'No pude ir al final pero mis amigos dicen q estuvo muy bien', 2, NOW() - INTERVAL '12 hours'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Aprendimos a hacer pasta, fue super divertido. El tiramisú quedó brutal!', 4, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Taller de Cocina Italiana';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'La organizacion fue un poco caotica pero al final se disfruto', 1, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Taller de Cocina Italiana';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Las vistas desde arriba son impresionantes. Merece la pena el madrugón', 6, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Ruta de Senderismo por la Sierra';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'El año pasado fui y estuvo genial, este año repito seguro', 3, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Ruta de Senderismo por la Sierra';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Tocamos hasta las 3 de la mañana jajajaj que buen ambiente', 7, NOW() - INTERVAL '12 hours'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'La bateria sonaba que te cagas, menudo pedazo de jam session', 4, NOW() - INTERVAL '6 hours'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Gane el torneo de Mario Kart!! El año q viene os espero para la revancha', 8, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Torneo de Videojuegos Retro';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Las fotos eran preciosas, muy buen trabajo de los artistas locales', 3, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Exposición de Fotografía Urbana';

-- ============================================================
-- CHATS GRUPALES (uno por evento)
-- ============================================================
INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Taller de Cocina Italiana';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Ruta de Senderismo por la Sierra';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Torneo de Videojuegos Retro';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Exposición de Fotografía Urbana';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Jam Session de Rock';

-- ============================================================
-- ASIGNAR TODOS LOS USUARIOS A LOS CHATS GRUPALES
-- ============================================================
INSERT INTO usuario_participa_chat (id_chat, id_usuario)
SELECT c.id, u.id FROM chat c, usuario u
WHERE c.evento_id IS NOT NULL;

-- ============================================================
-- MENSAJES EN LOS CHATS
-- ============================================================

-- Chat 1: Noche de Jazz
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'oye gente al final llego un poco tarde, sobre las 9 y media', NOW() - INTERVAL '48 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'tranqui tio, nosotros estamos hasta las tantas', NOW() - INTERVAL '47 hours'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo llevo la cámara para hacer fotos, el sitio es muy chulo', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'alguien sabe si hay que pagar entrada?', NOW() - INTERVAL '12 hours'
FROM usuario u, chat c WHERE u.username = 'david_ruiz' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'creo q es gratis pero no estoy seguro del todo', NOW() - INTERVAL '11 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'acabo de llegar y esto esta petado! no hay sitio', NOW() - INTERVAL '2 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'nosotros estamos detras del todo, buscanos!', NOW() - INTERVAL '1 hour'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'q bien suena esto!! llegamos en 5 min', NOW() - INTERVAL '1 hour'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Jazz en el Casco Antiguo');

-- Chat 2: Taller de Cocina
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'alguien sabe si hay que llevar algo para el taller de cocina?', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Taller de Cocina Italiana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'solo ganas de comer! ellos ponen los ingredientes', NOW() - INTERVAL '22 hours'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Taller de Cocina Italiana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'jajajaj perfecto entonces alli nos vemos', NOW() - INTERVAL '20 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Taller de Cocina Italiana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'el taller estuvo genial, me lleve las recetas a casa', NOW() - INTERVAL '48 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Taller de Cocina Italiana');

-- Chat 3: Ruta de Senderismo
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'chicos el tiempo para el sabado no pinta bien, lluvia toda la mañana', NOW() - INTERVAL '36 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Ruta de Senderismo por la Sierra');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'no pasa nada, yo tengo tienda de campaña por si llueve', NOW() - INTERVAL '35 hours'
FROM usuario u, chat c WHERE u.username = 'david_ruiz' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Ruta de Senderismo por la Sierra');

-- Chat 4: Torneo Retro
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo voy a daros a todos en street fighter eh!!', NOW() - INTERVAL '18 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Torneo de Videojuegos Retro');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'tu flipas, yo llevo practicando desde que me apunté', NOW() - INTERVAL '16 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Torneo de Videojuegos Retro');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'pues preparate pq te voy a barrer jajajaj', NOW() - INTERVAL '14 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Torneo de Videojuegos Retro');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'jajajaj te gané bien eh! reconoce la derrota', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Torneo de Videojuegos Retro');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'la proxima vez me vengooo, esto no se queda asi', NOW() - INTERVAL '22 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Torneo de Videojuegos Retro');

-- Chat 5: Expo Fotografía
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'la expo cuelga mis fotos! estoy super nerviosa', NOW() - INTERVAL '48 hours'
FROM usuario u, chat c WHERE u.username = 'laura_sevilla' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Exposición de Fotografía Urbana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'tus fotos son una pasada, vas a triunfar seguro', NOW() - INTERVAL '36 hours'
FROM usuario u, chat c WHERE u.username = 'sara_mm' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Exposición de Fotografía Urbana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'nosotros vamos el sabado, hay visita guiada no?', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Exposición de Fotografía Urbana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'si si, a las 12 en la galeria. No llegues tarde q son puntuales!', NOW() - INTERVAL '12 hours'
FROM usuario u, chat c WHERE u.username = 'laura_sevilla' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Exposición de Fotografía Urbana');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'allí estaremos! con cámara y todo jajaja', NOW() - INTERVAL '8 hours'
FROM usuario u, chat c WHERE u.username = 'sara_mm' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Exposición de Fotografía Urbana');

-- Chat 6: Jam Session
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo llevo la guitarra acustica por si alguien quiere sumarse', NOW() - INTERVAL '72 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Jam Session de Rock');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo llevo la bateria electrónica, montamos un pollo! jajaja', NOW() - INTERVAL '71 hours'
FROM usuario u, chat c WHERE u.username = 'david_ruiz' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Jam Session de Rock');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'al final no voy a poder ir, me surgio un imprevisto :(', NOW() - INTERVAL '6 hours'
FROM usuario u, chat c WHERE u.username = 'david_ruiz' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Jam Session de Rock');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'noo tio, te vas a perder la mejor jam session del año!', NOW() - INTERVAL '5 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Jam Session de Rock');

-- ============================================================
-- ACTUALIZAR ULTIMO_MENSAJE DE CADA CHAT
-- ============================================================
UPDATE chat c SET ultimo_mensaje = (
    SELECT MAX(m.fecha_envio) FROM mensaje m WHERE m.id_chat = c.id
);
