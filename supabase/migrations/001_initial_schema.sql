-- Matsnap Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- haircut_library: all styles with matching rules
-- ============================================
CREATE TABLE public.haircut_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  why_it_works JSONB NOT NULL DEFAULT '{}',
  example_image_urls TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  face_shape_matches TEXT[] NOT NULL DEFAULT '{}',
  hair_type_matches TEXT[] NOT NULL DEFAULT '{}',
  avoid_face_shapes TEXT[] NOT NULL DEFAULT '{}',
  avoid_hair_types TEXT[] NOT NULL DEFAULT '{}',
  maintenance_level INTEGER NOT NULL DEFAULT 3 CHECK (maintenance_level BETWEEN 1 AND 5),
  vibe_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- submissions: user scan + questionnaire data
-- ============================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  selfie_url TEXT,
  face_shape TEXT NOT NULL,
  jaw_width REAL,
  cheekbone_width REAL,
  forehead_width REAL,
  face_length REAL,
  face_length_to_width_ratio REAL,
  jaw_to_cheekbone_ratio REAL,
  forehead_to_cheekbone_ratio REAL,
  questionnaire_answers JSONB NOT NULL DEFAULT '{}',
  recommended_haircut_ids UUID[] NOT NULL DEFAULT '{}',
  recommendation_scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- selections: user's chosen haircuts
-- ============================================
CREATE TABLE public.selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  haircut_id UUID NOT NULL REFERENCES public.haircut_library(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(submission_id, haircut_id)
);

-- Indexes
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_selections_submission_id ON public.selections(submission_id);
CREATE INDEX idx_selections_user_id ON public.selections(user_id);
CREATE INDEX idx_haircut_library_face_shapes ON public.haircut_library USING GIN(face_shape_matches);

-- RLS
ALTER TABLE public.haircut_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;

-- haircut_library: anyone can read
CREATE POLICY "haircut_library_select" ON public.haircut_library
  FOR SELECT USING (true);

-- submissions: users can read/insert their own
CREATE POLICY "submissions_select_own" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "submissions_insert_own" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- selections: users can read/insert their own
CREATE POLICY "selections_select_own" ON public.selections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "selections_insert_own" ON public.selections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
