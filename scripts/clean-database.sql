-- Script para limpiar todos los datos de la base de datos
-- CUIDADO: Este script eliminará TODOS los datos de currículos, años, materias y prerequisitos

-- Eliminar prerequisitos
DELETE FROM "Prerequisite";

-- Eliminar materias
DELETE FROM "Subject";

-- Eliminar años
DELETE FROM "Year";

-- Eliminar currículos
DELETE FROM "Curriculum";

-- Opcional: Resetear las secuencias de IDs (si usas IDs incrementales)
-- ALTER SEQUENCE "Curriculum_id_seq" RESTART WITH 1;
-- ALTER SEQUENCE "Year_id_seq" RESTART WITH 1;
-- ALTER SEQUENCE "Subject_id_seq" RESTART WITH 1;
-- ALTER SEQUENCE "Prerequisite_id_seq" RESTART WITH 1;

-- Verificar que todo esté limpio
SELECT 'Curriculums' as tabla, COUNT(*) as registros FROM "Curriculum"
UNION ALL
SELECT 'Years' as tabla, COUNT(*) as registros FROM "Year"
UNION ALL
SELECT 'Subjects' as tabla, COUNT(*) as registros FROM "Subject"
UNION ALL
SELECT 'Prerequisites' as tabla, COUNT(*) as registros FROM "Prerequisite";
