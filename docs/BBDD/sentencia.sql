-- =========================================
-- TABLA BASE DE USUARIO
-- =========================================
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    rol VARCHAR(20) NOT NULL -- Enum: ROLE_USER, ROLE_EMPRESA, ROLE_ADMIN
);

-- =========================================
-- PERSONA
-- =========================================
CREATE TABLE persona (
    id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    premium BOOLEAN NOT NULL DEFAULT FALSE
);

-- =========================================
-- EMPRESA
-- =========================================
CREATE TABLE empresa (
    id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    direccion VARCHAR(255) NOT NULL
);

-- =========================================
-- ADMINISTRADOR
-- =========================================
CREATE TABLE administrador (
    id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    cargo VARCHAR(40)
);

-- =========================================
-- PERFIL DE USUARIO
-- =========================================
CREATE TABLE perfil (
    id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    descripcion TEXT,
    foto_perfil BYTEA,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CHATS Y MENSAJES
-- =========================================
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    es_grupal BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_mensaje TIMESTAMP
);

CREATE TABLE usuario_participa_chat (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_chat INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_chat)
);

CREATE TABLE mensaje (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_chat INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- EVENTOS Y FOTOS
-- =========================================
CREATE TABLE eventos (
    codigo SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_final DATE NOT NULL,
    publicado INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE foto_evento (
    id SERIAL PRIMARY KEY,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    foto BYTEA,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- APTITUDES Y GENEROS
-- =========================================
CREATE TABLE aptitud (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE genero (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE persona_aptitudes (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES persona(id) ON DELETE CASCADE,
    id_aptitud INTEGER NOT NULL REFERENCES aptitud(id) ON DELETE CASCADE
);

CREATE TABLE eventos_aptitudes (
    id SERIAL PRIMARY KEY,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    id_aptitud INTEGER NOT NULL REFERENCES aptitud(id) ON DELETE CASCADE
);

CREATE TABLE persona_generos (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES persona(id) ON DELETE CASCADE,
    id_genero INTEGER NOT NULL REFERENCES genero(id) ON DELETE CASCADE
);

CREATE TABLE eventos_generos (
    id SERIAL PRIMARY KEY,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    id_genero INTEGER NOT NULL REFERENCES genero(id) ON DELETE CASCADE
);

-- =========================================
-- COMENTARIOS Y ASISTENCIA
-- =========================================
CREATE TABLE persona_comentario_evento (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES persona(id) ON DELETE CASCADE,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    megustas INTEGER DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE persona_une_evento (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES persona(id) ON DELETE CASCADE,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- REPORTES
-- =========================================
CREATE TABLE reporte (
    id SERIAL PRIMARY KEY,
    id_reportero INTEGER REFERENCES usuario(id) ON DELETE SET NULL,
    tipo_contenido VARCHAR(20) NOT NULL,
    id_contenido INTEGER NOT NULL,
    motivo TEXT NOT NULL,
    detalle_adicional TEXT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revisado_por INTEGER REFERENCES administrador(id) ON DELETE SET NULL,
    estado VARCHAR(15) DEFAULT 'pendiente',
    fecha_revision TIMESTAMP
);

-- =========================================
-- INDICES
-- =========================================
CREATE INDEX idx_eventos_nombre ON eventos(nombre);
CREATE INDEX idx_eventos_ubicacion ON eventos(ubicacion);
CREATE INDEX idx_eventos_fecha_inicio ON eventos(fecha_inicio);
CREATE INDEX idx_chat_ultimo_mensaje ON chat(ultimo_mensaje DESC);
CREATE INDEX idx_reporte_estado ON reporte(estado);
CREATE INDEX idx_reporte_tipo ON reporte(tipo_contenido);