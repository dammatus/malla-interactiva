-- Script para verificar y corregir la configuración de IDs en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Verificar la estructura actual de la tabla Curriculum
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Curriculum' AND table_schema = 'public';

-- Si el ID no tiene un default, lo agregamos
-- NOTA: Solo ejecutar si el resultado anterior muestra que id no tiene default

-- Opción 1: Si la tabla está vacía, podemos recrearla
-- DROP TABLE IF EXISTS "Curriculum" CASCADE;

-- Opción 2: Si hay datos, modificar la columna existente
-- ALTER TABLE "Curriculum" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verificar si hay extensión uuid-ossp habilitada
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

-- Si no está habilitada, habilitarla (requiere permisos de superusuario)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar la configuración final
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Curriculum' AND table_schema = 'public';
