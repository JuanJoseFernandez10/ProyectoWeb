-- =========================================
-- MIGRACIÓN: Simplificar FotoEvento
-- =========================================
-- Elimina campos antiguos y agrega nuevos para estructura simplificada:
-- Carpeta automática: nombreEvento_idEvento (ej: purolatino_123)
-- Nombre foto: "portada", "purolatino1", "purolatino2", etc.

-- Paso 1: Eliminar columnas antiguas (si existen)
DO $$
BEGIN
    -- Eliminar orden
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'orden'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN orden CASCADE;
    END IF;

    -- Eliminar descripcion
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'descripcion'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN descripcion CASCADE;
    END IF;

    -- Eliminar fecha_subida
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'fecha_subida'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN fecha_subida CASCADE;
    END IF;

    -- Eliminar carpeta
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'carpeta'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN carpeta CASCADE;
    END IF;

    -- Eliminar numero_foto
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'numero_foto'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN numero_foto CASCADE;
    END IF;

    -- Eliminar total_fotos_carpeta
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'total_fotos_carpeta'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN total_fotos_carpeta CASCADE;
    END IF;
END $$;

-- Paso 2: Agregar columnas nuevas (si no existen)
DO $$
BEGIN
    -- Agregar es_portada si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'es_portada'
    ) THEN
        ALTER TABLE fotoevento ADD COLUMN es_portada BOOLEAN DEFAULT FALSE;
    END IF;

    -- Agregar nombre_foto si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'nombre_foto'
    ) THEN
        ALTER TABLE fotoevento ADD COLUMN nombre_foto VARCHAR(255);
    END IF;

    -- Agregar ruta_archivo si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'ruta_archivo'
    ) THEN
        ALTER TABLE fotoevento ADD COLUMN ruta_archivo VARCHAR(500);
    END IF;
END $$;

-- Si aún existe la columna foto, eliminarla porque ya no se guarda en BD
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fotoevento' AND column_name = 'foto'
    ) THEN
        ALTER TABLE fotoevento DROP COLUMN foto CASCADE;
    END IF;
END $$;

-- Paso 3: Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_fotoevento_portada ON fotoevento(codigo_evento, es_portada);
CREATE INDEX IF NOT EXISTS idx_fotoevento_nombre ON fotoevento(codigo_evento, nombre_foto);
