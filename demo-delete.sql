-- ============================================================
-- ELIMINAR TODOS LOS DATOS DE GROOVELINK
-- ============================================================

TRUNCATE
    mensaje,
    usuario_participa_chat,
    persona_comentario_evento,
    persona_megusta_evento,
    persona_une_evento,
    foto_evento,
    evento_aptitudes,
    evento_generos,
    persona_aptitudes,
    persona_generos,
    solicitud_amistad,
    notificacion,
    reporte,
    chat,
    empresa,
    administrador,
    persona,
    evento,
    perfil,
    usuario,
    aptitud,
    genero
CASCADE;
