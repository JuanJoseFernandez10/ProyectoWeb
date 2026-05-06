-- =========================================
-- RESET COMPLETO DE LA BBDD
-- =========================================
-- Ejecuta este script antes de cargar seed.sql si quieres vaciar todo.

TRUNCATE TABLE
    reporte,
    chat,
    evento,
    aptitud,
    genero,
    usuario
RESTART IDENTITY CASCADE;