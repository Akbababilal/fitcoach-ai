-- ============================================================
-- FitCoach AI - Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER CHECK (age >= 10 AND age <= 120),
  height_cm NUMERIC(5,1) CHECK (height_cm >= 50 AND height_cm <= 300),
  weight_kg NUMERIC(5,1) CHECK (weight_kg >= 20 AND weight_kg <= 500),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT CHECK (
    activity_level IN (
      'sedentary',
      'lightly_active',
      'moderately_active',
      'very_active',
      'extremely_active'
    )
  ) DEFAULT 'moderately_active',
  goal TEXT CHECK (
    goal IN ('lose_weight', 'maintain', 'gain_muscle', 'bulk')
  ) DEFAULT 'maintain',
  experience_level TEXT CHECK (
    experience_level IN ('beginner', 'intermediate', 'advanced')
  ) DEFAULT 'beginner',
  language TEXT CHECK (language IN ('tr', 'en')) DEFAULT 'tr',
  daily_calorie_target INTEGER,
  daily_protein_target INTEGER,
  daily_carb_target INTEGER,
  daily_fat_target INTEGER,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- MEALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  meal_type TEXT CHECK (
    meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')
  ) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- MEAL ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.meal_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  quantity NUMERIC(8,2) NOT NULL DEFAULT 100,
  unit TEXT CHECK (unit IN ('g', 'ml', 'piece', 'serving')) DEFAULT 'g',
  calories NUMERIC(8,1) NOT NULL DEFAULT 0,
  protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- WEIGHT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  weight_kg NUMERIC(5,1) NOT NULL CHECK (weight_kg >= 20 AND weight_kg <= 500),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

-- ============================================================
-- WORKOUT PLANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  duration_weeks INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT TRUE,
  plan_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- AI CHAT HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module TEXT CHECK (module IN ('nutrition', 'workout')) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER ai_chat_updated_at
  BEFORE UPDATE ON public.ai_chat_history
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'language', 'tr')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Meals policies
CREATE POLICY "Users can view own meals"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

-- Meal items policies (access through meals)
CREATE POLICY "Users can view own meal items"
  ON public.meal_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meal items"
  ON public.meal_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal items"
  ON public.meal_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal items"
  ON public.meal_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- Weight logs policies
CREATE POLICY "Users can view own weight logs"
  ON public.weight_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs"
  ON public.weight_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs"
  ON public.weight_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs"
  ON public.weight_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Workout plans policies
CREATE POLICY "Users can view own workout plans"
  ON public.workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans"
  ON public.workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout plans"
  ON public.workout_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout plans"
  ON public.workout_plans FOR DELETE
  USING (auth.uid() = user_id);

-- AI chat history policies
CREATE POLICY "Users can view own chat history"
  ON public.ai_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON public.ai_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat history"
  ON public.ai_chat_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON public.meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON public.workout_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_ai_chat_user_module ON public.ai_chat_history(user_id, module);
