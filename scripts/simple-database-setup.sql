-- Verificar si las tablas existen y crearlas solo si no existen

-- Tabla Curriculum
CREATE TABLE IF NOT EXISTS "Curriculum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- Tabla Year
CREATE TABLE IF NOT EXISTS "Year" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- Tabla Subject
CREATE TABLE IF NOT EXISTS "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "credits" INTEGER,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "yearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- Tabla Prerequisite
CREATE TABLE IF NOT EXISTS "Prerequisite" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "prerequisiteId" TEXT NOT NULL,
    CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("id")
);

-- Crear índices únicos (solo si no existen)
DO $$ BEGIN
    CREATE UNIQUE INDEX "Year_curriculumId_number_key" ON "Year"("curriculumId", "number");
EXCEPTION WHEN duplicate_table THEN
    -- Índice ya existe, continuar
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX "Prerequisite_subjectId_prerequisiteId_key" ON "Prerequisite"("subjectId", "prerequisiteId");
EXCEPTION WHEN duplicate_table THEN
    -- Índice ya existe, continuar
END $$;

-- Crear foreign keys (solo si no existen)
DO $$ BEGIN
    ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    -- Constraint ya existe, continuar
END $$;

DO $$ BEGIN
    ALTER TABLE "Year" ADD CONSTRAINT "Year_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    -- Constraint ya existe, continuar
END $$;

DO $$ BEGIN
    ALTER TABLE "Subject" ADD CONSTRAINT "Subject_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    -- Constraint ya existe, continuar
END $$;

DO $$ BEGIN
    ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    -- Constraint ya existe, continuar
END $$;

DO $$ BEGIN
    ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    -- Constraint ya existe, continuar
END $$;
