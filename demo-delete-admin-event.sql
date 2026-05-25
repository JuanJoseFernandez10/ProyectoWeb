-- ============================================================
-- ELIMINAR EL EVENTO DEL ADMIN (Jam Session de Rock)
-- y todos sus datos relacionados
-- ============================================================

DO $$
DECLARE
    v_evento_id BIGINT;
BEGIN
    -- Obtener ID del evento
    SELECT id INTO v_evento_id FROM evento WHERE nombre = 'Jam Session de Rock';
    
    IF v_evento_id IS NULL THEN
        RAISE NOTICE 'El evento no existe';
        RETURN;
    END IF;

    -- Eliminar mensajes del chat del evento
    DELETE FROM mensaje WHERE id_chat IN (
        SELECT id FROM chat WHERE evento_id = v_evento_id
    );

    -- Eliminar participantes del chat
    DELETE FROM usuario_participa_chat WHERE id_chat IN (
        SELECT id FROM chat WHERE evento_id = v_evento_id
    );

    -- Eliminar el chat del evento
    DELETE FROM chat WHERE evento_id = v_evento_id;

    -- Eliminar comentarios
    DELETE FROM persona_comentario_evento WHERE codigo_evento = v_evento_id;

    -- Eliminar asistentes
    DELETE FROM persona_une_evento WHERE codigo_evento = v_evento_id;

    -- Eliminar likes
    DELETE FROM persona_megusta_evento WHERE codigo_evento = v_evento_id;

    -- Eliminar fotos
    DELETE FROM foto_evento WHERE codigo_evento = v_evento_id;

    -- Eliminar relaciones con aptitudes y géneros
    DELETE FROM evento_aptitudes WHERE id_evento = v_evento_id;
    DELETE FROM evento_generos WHERE id_evento = v_evento_id;

    -- Eliminar el evento
    DELETE FROM evento WHERE id = v_evento_id;

    RAISE NOTICE 'Evento eliminado correctamente';
END $$;
