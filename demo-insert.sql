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

-- carlos_garcia (premium, organiza eventos)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('carlos_garcia', 'carlos@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '60 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), true);

-- maria_lopez (premium)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('maria_lopez', 'maria@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '50 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), true);

-- alejandro_m (premium, organiza conciertos)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('alejandro_m', 'alejandro@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '45 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), true);

-- laura_sevilla (premium, organiza conciertos)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('laura_sevilla', 'laura@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '40 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), true);

-- david_ruiz (no es premium, solo asiste a eventos)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('david_ruiz', 'david@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '35 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), false);

-- ana_perez
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('ana_perez', 'ana@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '30 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), false);

-- javi_rodri
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('javi_rodri', 'javi@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '25 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), true);

-- sara_mm
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('sara_mm', 'sara@email.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '20 days', 'ROLE_USER');
INSERT INTO persona (id, premium) VALUES (currval('usuario_id_seq'), false);

-- sala_arena (empresa, organiza conciertos)
INSERT INTO usuario (username, email, password, fecha_creacion, rol)
    VALUES ('sala_arena', 'info@salaarena.com', crypt('123456', gen_salt('bf', 10)), NOW() - INTERVAL '60 days', 'ROLE_EMPRESA');
INSERT INTO empresa (id, direccion) VALUES (currval('usuario_id_seq'), 'Calle Abril 45, Madrid');

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
    'Apasionado de la musica y los festivales. Escapo a la montaña siempre que puedo.',
    'Valencia', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'laura_sevilla'),
    'Cantante en una banda indie, me encanta el directo y conocer gente con los mismos gustos.',
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
    'Estudiante de bellas artes. Me encanta la musica indie y los conciertos pequeños. Tambien hago yoga.',
    'Granada', NOW()
);
INSERT INTO perfil (id, descripcion, ubicacion, fecha_actualizacion)
VALUES (
    (SELECT id FROM usuario WHERE username = 'javi_rodri'),
    'Gamer y amante de la tecnologia. Me encanta el hip-hop y los conciertos en vivo.',
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
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'maria_lopez' AND a.nombre IN ('Música', 'Baile', 'Viajes');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'alejandro_m' AND a.nombre IN ('Deportes', 'Fotografía', 'Viajes');
INSERT INTO persona_aptitudes (id_usuario, id_aptitud)
SELECT u.id, a.id FROM usuario u, aptitud a WHERE u.username = 'laura_sevilla' AND a.nombre IN ('Música', 'Baile', 'Viajes');
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
    'Noche de Música Electrónica',
    'Sala Arena, C/ Abril 45, Madrid',
    'Noche de musica electronica con DJs en vivo. Sonidos techno, house y drum and bass. Ven a bailar hasta el amanecer! Entrada anticipada 10€, en puerta 15€.',
    CURRENT_DATE + 12, CURRENT_DATE + 12,
    (SELECT id FROM usuario WHERE username = 'sala_arena'),
    NOW() - INTERVAL '10 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Baile'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Electrónica'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Festival de Reggaeton',
    'Plaza de España, Madrid',
    'El festival de reggaeton mas grande del verano! Actuaciones en directo, food trucks y mucho baile. Vente con tus amigos a disfrutar del mejor perreo.',
    CURRENT_DATE + 8, CURRENT_DATE + 8,
    (SELECT id FROM usuario WHERE username = 'alejandro_m'),
    NOW() - INTERVAL '8 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Baile'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Reggaeton'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Concierto de Hip-Hop',
    'Sala Caracol, C/ Bernardino 23, Madrid',
    'Concierto de las mejores bandas de hip-hop underground de la escena madrileña. Actuaciones en directo, batallas de freestyle y mucho flow. Ven a representar!',
    CURRENT_DATE + 3, CURRENT_DATE + 3,
    (SELECT id FROM usuario WHERE username = 'javi_rodri'),
    NOW() - INTERVAL '6 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Baile'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Hip-Hop'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Festival Indie de Primavera',
    'Teatro Lope de Vega, Sevilla',
    'Festival de musica indie con bandas emergentes de toda Andalucia. Sonidos frescos, ambiente joven y buena vibra. Dos dias de musica ininterrumpida!',
    CURRENT_DATE + 15, CURRENT_DATE + 17,
    (SELECT id FROM usuario WHERE username = 'laura_sevilla'),
    NOW() - INTERVAL '5 days'
);
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES (currval('evento_id_seq'), (SELECT id FROM aptitud WHERE nombre = 'Música'));
INSERT INTO evento_generos (id_evento, id_genero) VALUES (currval('evento_id_seq'), (SELECT id FROM genero WHERE nombre = 'Indie'));

INSERT INTO evento (nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion)
VALUES (
    'Jam Session de Rock',
    'La Rock House, Bilbao',
    'Jam session abierta para musicos de todos los niveles. Trae tu instrumento y unete! Hay amplis y bateria. Desde las 20:00 hasta que el cuerpo aguante.',
    CURRENT_DATE + 10, CURRENT_DATE + 10,
    (SELECT id FROM usuario WHERE username = 'admin'),
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
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Concierto de Hip-Hop';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Concierto de Hip-Hop';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '7 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Música Electrónica';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '6 days'
FROM usuario u, evento e WHERE u.username = 'maria_lopez' AND e.nombre = 'Noche de Música Electrónica';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Festival de Reggaeton';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Festival de Reggaeton';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'laura_sevilla' AND e.nombre = 'Festival Indie de Primavera';

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
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Noche de Música Electrónica';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '5 days'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Noche de Música Electrónica';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Festival de Reggaeton';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '7 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Concierto de Hip-Hop';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '6 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Concierto de Hip-Hop';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Festival Indie de Primavera';

INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion)
SELECT u.id, e.id, NOW() - INTERVAL '4 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Festival Indie de Primavera';
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta)
SELECT u.id, e.id, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Festival Indie de Primavera';

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
SELECT u.id, e.id, 'La musica electronica estuvo increible, los DJs se salieron!', 4, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'ana_perez' AND e.nombre = 'Noche de Música Electrónica';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'El sonido era un poco bajo al principio pero luego mejoró. Buen rollo!', 1, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'carlos_garcia' AND e.nombre = 'Noche de Música Electrónica';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'El ambiente en la plaza fue una locura, no paré de bailar!', 6, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Festival de Reggaeton';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'El año pasado vino mi artista favorito, este año repito seguro', 3, NOW() - INTERVAL '3 days'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Festival de Reggaeton';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Tocamos hasta las 3 de la mañana jajajaj que buen ambiente', 7, NOW() - INTERVAL '12 hours'
FROM usuario u, evento e WHERE u.username = 'alejandro_m' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'La bateria sonaba que te cagas, menudo pedazo de jam session', 4, NOW() - INTERVAL '6 hours'
FROM usuario u, evento e WHERE u.username = 'david_ruiz' AND e.nombre = 'Jam Session de Rock';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Las batallas de freestyle fueron lo mejor, que flow tienen algunos tios', 8, NOW() - INTERVAL '1 day'
FROM usuario u, evento e WHERE u.username = 'javi_rodri' AND e.nombre = 'Concierto de Hip-Hop';

INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha)
SELECT u.id, e.id, 'Las bandas sonaron genial, el mejor festival indie del año!', 3, NOW() - INTERVAL '2 days'
FROM usuario u, evento e WHERE u.username = 'sara_mm' AND e.nombre = 'Festival Indie de Primavera';

-- ============================================================
-- CHATS GRUPALES (uno por evento)
-- ============================================================
INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Noche de Jazz en el Casco Antiguo';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Noche de Música Electrónica';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Festival de Reggaeton';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Concierto de Hip-Hop';

INSERT INTO chat (nombre, descripcion, es_grupal, evento_id, fecha_creacion)
SELECT e.nombre, 'Chat grupal del evento: ' || e.nombre, true, e.id, NOW() - INTERVAL '3 days'
FROM evento e WHERE e.nombre = 'Festival Indie de Primavera';

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

-- Chat 2: Noche de Música Electrónica
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'a que hora abre la sala? yo llego sobre las 11', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Música Electrónica');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo llego antes para pillar sitio cerca del DJ!', NOW() - INTERVAL '22 hours'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Música Electrónica');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'perfecto pues alli nos vemos!', NOW() - INTERVAL '20 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Música Electrónica');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'el DJ de techno estuvo brutal, la sesion fue increible', NOW() - INTERVAL '48 hours'
FROM usuario u, chat c WHERE u.username = 'ana_perez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Noche de Música Electrónica');

-- Chat 3: Festival de Reggaeton
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'chicos el sabado hay cola desde las 5, mejor llegar temprano', NOW() - INTERVAL '36 hours'
FROM usuario u, chat c WHERE u.username = 'alejandro_m' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival de Reggaeton');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo llevo altavoz para el pre-party mientras esperamos!', NOW() - INTERVAL '35 hours'
FROM usuario u, chat c WHERE u.username = 'david_ruiz' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival de Reggaeton');

-- Chat 4: Concierto de Hip-Hop
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'yo conozco a uno de los raperos, va a ser una pasada!', NOW() - INTERVAL '18 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Concierto de Hip-Hop');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'el que canta despues del intermedio es una bestia', NOW() - INTERVAL '16 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Concierto de Hip-Hop');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'hacemos un freestyle entre todos no? jajaja', NOW() - INTERVAL '14 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Concierto de Hip-Hop');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'el micro sonaba que flipas, el conciertaco de la temporada', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'javi_rodri' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Concierto de Hip-Hop');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'la proxima vez me pongo en primera fila!', NOW() - INTERVAL '22 hours'
FROM usuario u, chat c WHERE u.username = 'carlos_garcia' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Concierto de Hip-Hop');

-- Chat 5: Festival Indie de Primavera
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'mi banda toca el sabado! estoy super nerviosa', NOW() - INTERVAL '48 hours'
FROM usuario u, chat c WHERE u.username = 'laura_sevilla' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival Indie de Primavera');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'tu grupo es una pasada, vais a triunfar seguro', NOW() - INTERVAL '36 hours'
FROM usuario u, chat c WHERE u.username = 'sara_mm' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival Indie de Primavera');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'nosotros vamos el sabado, hay entrada anticipada no?', NOW() - INTERVAL '24 hours'
FROM usuario u, chat c WHERE u.username = 'maria_lopez' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival Indie de Primavera');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'si si, en la web. No llegues tarde q empiezan puntuales!', NOW() - INTERVAL '12 hours'
FROM usuario u, chat c WHERE u.username = 'laura_sevilla' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival Indie de Primavera');

INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, c.id, 'alli estaremos! con camiseta del grupo y todo jajaja', NOW() - INTERVAL '8 hours'
FROM usuario u, chat c WHERE u.username = 'sara_mm' AND c.evento_id = (SELECT id FROM evento WHERE nombre = 'Festival Indie de Primavera');

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
-- CHATS PRIVADOS ENTRE AMIGOS
-- ============================================================

-- Chat privado: carlos_garcia <-> maria_lopez
INSERT INTO chat (nombre, es_grupal, fecha_creacion)
VALUES ('Chat privado', false, NOW() - INTERVAL '25 days');
INSERT INTO usuario_participa_chat (id_chat, id_usuario)
SELECT currval('chat_id_seq'), id FROM usuario WHERE username IN ('carlos_garcia', 'maria_lopez');
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'hola! al final nos vemos en el concierto de jazz?', NOW() - INTERVAL '20 days'
FROM usuario u WHERE u.username = 'carlos_garcia';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'sii yo voy fijo! quedamos alli?', NOW() - INTERVAL '19 days'
FROM usuario u WHERE u.username = 'maria_lopez';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'perfecto, a las 8 en la puerta entonces!', NOW() - INTERVAL '19 days'
FROM usuario u WHERE u.username = 'carlos_garcia';

-- Chat privado: alejandro_m <-> david_ruiz
INSERT INTO chat (nombre, es_grupal, fecha_creacion)
VALUES ('Chat privado', false, NOW() - INTERVAL '15 days');
INSERT INTO usuario_participa_chat (id_chat, id_usuario)
SELECT currval('chat_id_seq'), id FROM usuario WHERE username IN ('alejandro_m', 'david_ruiz');
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'tio vente el finde a la jam session q va a estar brutal', NOW() - INTERVAL '10 days'
FROM usuario u WHERE u.username = 'alejandro_m';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'no se si podre, estoy liadisimo con el trabajo :(', NOW() - INTERVAL '10 days'
FROM usuario u WHERE u.username = 'david_ruiz';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'vengaaa hombre, desconecta un rato q te hace falta', NOW() - INTERVAL '9 days'
FROM usuario u WHERE u.username = 'alejandro_m';

-- Chat privado: javi_rodri <-> sara_mm
INSERT INTO chat (nombre, es_grupal, fecha_creacion)
VALUES ('Chat privado', false, NOW() - INTERVAL '5 days');
INSERT INTO usuario_participa_chat (id_chat, id_usuario)
SELECT currval('chat_id_seq'), id FROM usuario WHERE username IN ('javi_rodri', 'sara_mm');
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'oye viste el festival indie? las bandas estuvieron guapisimas', NOW() - INTERVAL '4 days'
FROM usuario u WHERE u.username = 'javi_rodri';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'siiii laura toca el sabado! vamos?', NOW() - INTERVAL '4 days'
FROM usuario u WHERE u.username = 'sara_mm';
INSERT INTO mensaje (id_usuario, id_chat, contenido, fecha_envio)
SELECT u.id, currval('chat_id_seq'), 'dale, quedamos a las 11 y vamos', NOW() - INTERVAL '3 days'
FROM usuario u WHERE u.username = 'javi_rodri';

-- ============================================================
-- ACTUALIZAR ULTIMO_MENSAJE DE CADA CHAT
-- ============================================================
UPDATE chat c SET ultimo_mensaje = (
    SELECT MAX(m.fecha_envio) FROM mensaje m WHERE m.id_chat = c.id
);
