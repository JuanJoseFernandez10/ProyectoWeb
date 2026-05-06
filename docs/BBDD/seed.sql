-- =========================================
-- SEED DE DESARROLLO
-- =========================================

-- Usuarios base (especificando IDs explícitamente para JOINED inheritance)
INSERT INTO usuario (id, username, email, password, rol, fecha_creacion) VALUES
    (1, 'juan', 'juan@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_USER', '2026-04-01 10:00:00'),
    (2, 'maria', 'maria@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_USER', '2026-04-02 10:00:00'),
    (3, 'carlos', 'carlos@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_USER', '2026-04-03 10:00:00'),
    (4, 'sofia', 'sofia@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_USER', '2026-04-04 10:00:00'),
    (5, 'company_1', 'company1@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_EMPRESA', '2026-04-05 10:00:00'),
    (6, 'company_2', 'company2@local.dev', '$2a$10$slYQmyNdGzin7olVwCH1Be7DimH7wb9DFR0SqFlQWXGsfvxiO2Za.', 'ROLE_EMPRESA', '2026-04-06 10:00:00');

-- Personas (JOINED child table - mismo ID que usuario)
INSERT INTO persona (id, premium) VALUES
    (1, false),
    (2, true),
    (3, false),
    (4, true);

-- Empresas (JOINED child table - mismo ID que usuario)
INSERT INTO empresa (id, direccion) VALUES
    (5, 'Calle Principal 123, Madrid'),
    (6, 'Avenida Central 456, Barcelona');

-- Géneros
INSERT INTO genero (id, nombre) VALUES
    (1, 'Indie'),
    (2, 'Electrónica'),
    (3, 'Rock'),
    (4, 'Urbana'),
    (5, 'Pop'),
    (6, 'Jazz');

-- Aptitudes
INSERT INTO aptitud (id, nombre) VALUES
    (1, 'Conciertos'),
    (2, 'Fiesta'),
    (3, 'Networking'),
    (4, 'Afterwork'),
    (5, 'Taller'),
    (6, 'Conferencia');

-- Perfiles (1:1 con usuario, mismo ID)
INSERT INTO perfil (id, descripcion, fecha_actualizacion) VALUES
    (1, 'Amante de la música indie', '2026-04-01 12:00:00'),
    (2, 'DJ profesional y productor', '2026-04-02 12:00:00'),
    (3, 'Rockero de corazón', '2026-04-03 12:00:00'),
    (4, 'Explorador de música urbana', '2026-04-04 12:00:00');

-- Eventos (publicado es FK a usuario)
INSERT INTO evento (id, nombre, ubicacion, descripcion, fecha_inicio, fecha_final, publicado, fecha_creacion) VALUES
    (1, 'Indie Sunset Session', 'Madrid', 'Tarde de bandas emergentes y plan chill para arrancar el finde.', '2026-06-14', '2026-06-14', 5, '2026-05-01 18:00:00'),
    (2, 'Electro Rooftop Night', 'Valencia', 'Sesión electrónica en azotea con DJs invitados y buen ambiente.', '2026-06-21', '2026-06-21', 6, '2026-05-02 19:00:00'),
    (3, 'Rock & Friends Live', 'Sevilla', 'Concierto íntimo con zona para grupos y after para conocerse.', '2026-07-05', '2026-07-05', 5, '2026-05-03 20:00:00'),
    (4, 'Urban Beats Meetup', 'Barcelona', 'Encuentro urbano con música, conversación y gente nueva.', '2026-06-29', '2026-06-29', 6, '2026-05-04 18:30:00'),
    (5, 'Afterwork Pop Session', 'Bilbao', 'Plan tranquilo para salir del trabajo y terminar con música.', '2026-07-11', '2026-07-11', 5, '2026-05-05 18:15:00'),
    (6, 'Night Groove Club', 'Málaga', 'Sesión nocturna para cerrar la semana con pista y amigos.', '2026-07-18', '2026-07-18', 6, '2026-05-06 21:00:00');

-- Evento-Aptitudes (NOMBRES EXACTOS: id_evento, id_aptitud)
INSERT INTO evento_aptitudes (id_evento, id_aptitud) VALUES
    (1, 1), (2, 2), (3, 1), (4, 3), (5, 4), (6, 2);

-- Evento-Géneros (NOMBRES EXACTOS: id_evento, id_genero)
INSERT INTO evento_generos (id_evento, id_genero) VALUES
    (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 2);

-- Persona-Aptitudes (NOMBRES EXACTOS: id_usuario, id_aptitud)
INSERT INTO persona_aptitudes (id_usuario, id_aptitud) VALUES
    (1, 1), (1, 2), (2, 2), (2, 3), (3, 1), (3, 4), (4, 3), (4, 4);

-- Persona-Géneros (NOMBRES EXACTOS: id_usuario, id_genero)
INSERT INTO persona_generos (id_usuario, id_genero) VALUES
    (1, 1), (1, 3), (2, 2), (2, 4), (3, 3), (3, 5), (4, 2), (4, 4);

-- Personas Me Gusta Evento (NOMBRES EXACTOS: id_usuario, codigo_evento)
INSERT INTO persona_megusta_evento (id_usuario, codigo_evento, fecha_megusta) VALUES
    (1, 1, '2026-05-02 08:00:00'),
    (2, 1, '2026-05-02 08:05:00'),
    (3, 1, '2026-05-02 08:10:00'),
    (4, 1, '2026-05-02 08:15:00'),
    (1, 2, '2026-05-03 09:00:00'),
    (2, 2, '2026-05-03 09:05:00'),
    (3, 2, '2026-05-03 09:10:00'),
    (2, 3, '2026-05-04 09:15:00'),
    (3, 3, '2026-05-04 09:20:00'),
    (4, 3, '2026-05-04 09:25:00'),
    (1, 4, '2026-05-05 09:30:00'),
    (4, 4, '2026-05-05 09:35:00'),
    (3, 5, '2026-05-06 09:40:00'),
    (4, 5, '2026-05-06 09:45:00'),
    (1, 6, '2026-05-06 09:50:00');

-- Personas Une Evento (NOMBRES EXACTOS: id_usuario, codigo_evento)
INSERT INTO persona_une_evento (id_usuario, codigo_evento, fecha_inscripcion) VALUES
    (1, 1, '2026-05-02 10:00:00'),
    (2, 1, '2026-05-03 10:00:00'),
    (1, 2, '2026-05-04 11:00:00'),
    (3, 2, '2026-05-04 11:30:00'),
    (4, 2, '2026-05-05 12:00:00'),
    (2, 3, '2026-05-05 13:00:00'),
    (1, 4, '2026-05-05 13:30:00'),
    (4, 4, '2026-05-05 14:00:00'),
    (3, 5, '2026-05-06 15:00:00'),
    (2, 6, '2026-05-06 15:30:00');

-- Comentarios de Evento (NOMBRES EXACTOS: id_usuario, codigo_evento)
INSERT INTO persona_comentario_evento (id_usuario, codigo_evento, texto, megustas, fecha) VALUES
    (1, 1, 'Muy buen ambiente, la mejor sesión del mes', 3, '2026-05-02 20:00:00'),
    (2, 1, 'Excelente propuesta, volvería sin dudarlo', 2, '2026-05-02 21:00:00'),
    (3, 2, 'La mejor fiesta electrónica del año', 5, '2026-05-03 23:00:00'),
    (4, 3, 'Rock en vivo como debe ser', 4, '2026-05-05 22:00:00');