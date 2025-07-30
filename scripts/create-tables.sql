-- Tabla de usuarios (Supabase Auth ya maneja esto)
-- Solo necesitamos una tabla de perfiles adicional

-- Tabla de currículos
CREATE TABLE IF NOT EXISTS curriculums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de años
CREATE TABLE IF NOT EXISTS years (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  curriculum_id UUID REFERENCES curriculums(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(curriculum_id, number)
);

-- Tabla de materias
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  credits INTEGER,
  approved BOOLEAN DEFAULT FALSE,
  year_id UUID REFERENCES years(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de prerequisitos
CREATE TABLE IF NOT EXISTS prerequisites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  prerequisite_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(subject_id, prerequisite_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE years ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prerequisites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para curriculums
CREATE POLICY "Users can view own curriculums" ON curriculums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own curriculums" ON curriculums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own curriculums" ON curriculums
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own curriculums" ON curriculums
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para years
CREATE POLICY "Users can view own years" ON years
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM curriculums 
      WHERE curriculums.id = years.curriculum_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own years" ON years
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM curriculums 
      WHERE curriculums.id = years.curriculum_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own years" ON years
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM curriculums 
      WHERE curriculums.id = years.curriculum_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own years" ON years
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM curriculums 
      WHERE curriculums.id = years.curriculum_id 
      AND curriculums.user_id = auth.uid()
    )
  );

-- Políticas para subjects
CREATE POLICY "Users can view own subjects" ON subjects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM years 
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE years.id = subjects.year_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own subjects" ON subjects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM years 
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE years.id = subjects.year_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own subjects" ON subjects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM years 
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE years.id = subjects.year_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own subjects" ON subjects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM years 
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE years.id = subjects.year_id 
      AND curriculums.user_id = auth.uid()
    )
  );

-- Políticas para prerequisites
CREATE POLICY "Users can view own prerequisites" ON prerequisites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subjects 
      JOIN years ON years.id = subjects.year_id
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE subjects.id = prerequisites.subject_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own prerequisites" ON prerequisites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM subjects 
      JOIN years ON years.id = subjects.year_id
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE subjects.id = prerequisites.subject_id 
      AND curriculums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own prerequisites" ON prerequisites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM subjects 
      JOIN years ON years.id = subjects.year_id
      JOIN curriculums ON curriculums.id = years.curriculum_id
      WHERE subjects.id = prerequisites.subject_id 
      AND curriculums.user_id = auth.uid()
    )
  );

-- Funciones para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_curriculums_updated_at BEFORE UPDATE ON curriculums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_years_updated_at BEFORE UPDATE ON years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
