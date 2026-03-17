# ProyectoWeb
GrooveLink es una aplicación web enfocada en la conexión entre usuarios a través de la música. El proyecto combina interfaz interactiva, gestión de usuarios y lógica del lado del cliente para crear una experiencia dinámica y social. Desarrollado como parte de mi aprendizaje en desarrollo web.

# Estructura de la Base de Datos

Esta aplicación utiliza **PostgreSQL** como motor de base de datos. El diseño está pensado para una plataforma que combina funcionalidades de red social, eventos y networking (tipo "meetup" o comunidad con perfiles personales y empresariales).

## Resumen general

- Usuarios con **3 roles** principales: `ROLE_USER` (persona), `ROLE_EMPRESA`, `ROLE_ADMIN`
- Perfiles diferenciados para personas y empresas
- Sistema de **chats** (individuales y grupales)
- Publicación y gestión de **eventos** (con fotos, aptitudes y géneros/músicas)
- Relación muchos-a-muchos entre usuarios/eventos y aptitudes/géneros
- Sistema de **asistencia** a eventos
- Comentarios con likes en eventos
- Sistema básico de **reportes** con revisión por administradores

## Tablas principales y propósito

| Tabla                        | Propósito principal                              | Clave destacada                     |
|------------------------------|--------------------------------------------------|--------------------------------------|
| `usuario`                    | Tabla base de autenticación y roles              | `username` UNIQUE, `rol`             |
| `persona`                    | Extensión para usuarios tipo persona (premium)   | 1:1 con usuario                      |
| `empresa`                    | Extensión para cuentas de empresa                | 1:1 con usuario                      |
| `administrador`              | Extensión para administradores                   | 1:1 con usuario                      |
| `perfil`                     | Datos públicos del perfil (foto, descripción)    | 1:1 con usuario                      |
| `chat` + `usuario_participa_chat` + `mensaje` | Sistema de mensajería (1:1 y grupal)   | Último mensaje para ordenar chats    |
| `eventos`                    | Eventos creados por usuarios                     | `publicado` → quién lo creó          |
| `foto_evento`                | Galería de imágenes por evento                   | `orden` para controlar visualización |
| `aptitud` / `genero`         | Catálogos reutilizables (habilidades, estilos musicales, etc.) | `nombre` UNIQUE               |
| `*_aptitudes` / `*_generos`  | Relaciones muchos-a-muchos                       | —                                    |
| `persona_comentario_evento`  | Comentarios en eventos + contador de likes      | `megustas`                           |
| `persona_une_evento`         | Registro de asistencia / "me apunto"             | —                                    |
| `reporte`                    | Sistema de denuncias moderadas por admins        | `estado`: pendiente / revisado / etc |

## Decisiones de diseño importantes

- **Herencia de tablas** (1:1) para diferenciar `persona`, `empresa` y `administrador` → permite agregar campos específicos sin romper la tabla `usuario`.
- Uso de **SERIAL** para IDs autoincrementales en la mayoría de tablas.
- **ON DELETE CASCADE** en casi todas las relaciones → si se borra un usuario o evento, se eliminan sus datos dependientes (fotos, mensajes, inscripciones, etc.).
- **BYTEA** para almacenar fotos directamente en la base (alternativa: usar URLs a S3/minio en producción).
- Campos de auditoría (`fecha_creacion`, `fecha_actualizacion`, etc.) en casi todas las entidades relevantes.
- Índices creados en columnas que se usan frecuentemente en filtros y ordenamiento (`nombre`, `ubicacion`, `fecha_inicio`, `ultimo_mensaje`, etc.).

