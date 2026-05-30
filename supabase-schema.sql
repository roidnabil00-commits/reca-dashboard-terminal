-- ============================================================
-- RECA Intelligence Terminal — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'premium_member'
    CHECK (role IN ('premium_member', 'client_premium', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Dashboard feeds
CREATE TABLE IF NOT EXISTS public.dashboard_feeds (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'news'
    CHECK (category IN ('news', 'industry_data', 'reca_letter')),
  content TEXT NOT NULL,
  chart_data JSONB,
  drive_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. General research library
CREATE TABLE IF NOT EXISTS public.general_researches (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  drive_link_pdf TEXT,
  drive_link_ppt TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Private reports (client-specific)
CREATE TABLE IF NOT EXISTS public.private_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  drive_link_pdf TEXT,
  drive_link_ppt TEXT,
  drive_link_csv TEXT,
  drive_link_md TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Course modules
CREATE TABLE IF NOT EXISTS public.course_modules (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'video'
    CHECK (type IN ('video', 'book')),
  description TEXT,
  source_link TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Helper: get role of current user
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles: users can read own profile; admins can read all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (get_user_role() = 'admin');

-- Dashboard feeds: all authenticated users can read
CREATE POLICY "feeds_select" ON public.dashboard_feeds
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "feeds_all_admin" ON public.dashboard_feeds
  FOR ALL USING (get_user_role() = 'admin');

-- General research: all authenticated users can read
CREATE POLICY "research_select" ON public.general_researches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "research_all_admin" ON public.general_researches
  FOR ALL USING (get_user_role() = 'admin');

-- Private reports: client sees only their own; admin sees all
CREATE POLICY "private_reports_select" ON public.private_reports
  FOR SELECT USING (
    client_id = auth.uid()
    OR get_user_role() = 'admin'
  );

CREATE POLICY "private_reports_all_admin" ON public.private_reports
  FOR ALL USING (get_user_role() = 'admin');

-- Course modules: all authenticated users can read
CREATE POLICY "courses_select" ON public.course_modules
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "courses_all_admin" ON public.course_modules
  FOR ALL USING (get_user_role() = 'admin');

-- ============================================================
-- Auto-create profile on signup (optional trigger)
-- ============================================================
-- NOTE: Since admin manually creates users, this is a safety fallback.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member'),
    'premium_member'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
