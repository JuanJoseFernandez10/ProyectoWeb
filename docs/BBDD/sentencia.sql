-- Tabla para usuarios normales (personas y empresas) para herencia
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Perfil de usuario
CREATE TABLE perfil (
    id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    descripcion TEXT,
    ruta_foto_perfil VARCHAR(255),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Persona
CREATE TABLE persona (
    premium BOOLEAN NOT NULL DEFAULT FALSE
) INHERITS (usuario);

-- Empresa
CREATE TABLE empresa (
    direccion VARCHAR(255) NOT NULL
) INHERITS (usuario);

-- Administrador 
CREATE TABLE administrador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    cargo VARCHAR(40),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chats
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    es_grupal BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_mensaje TIMESTAMP
);

-- Participantes en chat
CREATE TABLE usuario_participa_chat (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_chat INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_chat)
);

-- Mensajes en chat
CREATE TABLE mensaje (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    id_chat INTEGER NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eventos
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

-- Galería de fotos de eventos
CREATE TABLE foto_evento (
    id SERIAL PRIMARY KEY,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    ruta_foto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aptitudes
CREATE TABLE aptitudes (
    nombre VARCHAR(50) PRIMARY KEY
);

-- Géneros
CREATE TABLE generos (
    nombre VARCHAR(50) PRIMARY KEY
);

-- Aptitudes de eventos
CREATE TABLE eventos_aptitudes (
    codigo_evento INTEGER REFERENCES eventos(codigo) ON DELETE CASCADE,
    nombre_aptitud VARCHAR(50) REFERENCES aptitudes(nombre) ON DELETE CASCADE,
    PRIMARY KEY (codigo_evento, nombre_aptitud)
);

-- Aptitudes de personas
CREATE TABLE persona_aptitudes (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    nombre_aptitud VARCHAR(50) REFERENCES aptitudes(nombre) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, nombre_aptitud)
);

-- Géneros de eventos
CREATE TABLE eventos_generos (
    codigo_evento INTEGER REFERENCES eventos(codigo) ON DELETE CASCADE,
    nombre_genero VARCHAR(50) REFERENCES generos(nombre) ON DELETE CASCADE,
    PRIMARY KEY (codigo_evento, nombre_genero)
);

-- Géneros de personas
CREATE TABLE persona_generos (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    nombre_genero VARCHAR(50) REFERENCES generos(nombre) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, nombre_genero)
);

-- Comentarios en eventos
CREATE TABLE persona_comentario_evento (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    megustas INTEGER DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, codigo_evento)
);

-- Asistencia a eventos
CREATE TABLE persona_une_evento (
    id_usuario INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    codigo_evento INTEGER NOT NULL REFERENCES eventos(codigo) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, codigo_evento)
);

-- Sistema de reportes 
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

-- Índices
CREATE INDEX idx_eventos_nombre ON eventos(nombre);
CREATE INDEX idx_eventos_ubicacion ON eventos(ubicacion);
CREATE INDEX idx_eventos_fecha_inicio ON eventos(fecha_inicio);
CREATE INDEX idx_chat_ultimo_mensaje ON chat(ultimo_mensaje DESC);
CREATE INDEX idx_reporte_estado ON reporte(estado);
CREATE INDEX idx_reporte_tipo ON reporte(tipo_contenido);