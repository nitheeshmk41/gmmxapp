-- ─────────────────────────────────────────────────────────────────
-- GMMX – Supabase Row Level Security Policies
-- Run this SQL in your Supabase SQL Editor after running migrations
-- ─────────────────────────────────────────────────────────────────

-- Helper: Get the gym_id of the currently authenticated user
CREATE OR REPLACE FUNCTION get_user_gym_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT gym_id FROM users WHERE id = auth.uid()
$$;

-- Helper: Get the role of the currently authenticated user
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT role::TEXT FROM users WHERE id = auth.uid()
$$;

-- ─────────────────────────────────────────────────────────────────
-- GYMS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gym_owners_read_own_gym"
  ON gyms FOR SELECT
  USING (id = get_user_gym_id() OR get_user_role() = 'super_admin');

CREATE POLICY "gym_owners_update_own_gym"
  ON gyms FOR UPDATE
  USING (id = get_user_gym_id() AND get_user_role() = 'gym_owner');

CREATE POLICY "super_admin_all_gyms"
  ON gyms FOR ALL
  USING (get_user_role() = 'super_admin');

CREATE POLICY "public_gym_by_subdomain"
  ON gyms FOR SELECT
  USING (true); -- Public for website routing, filtered in app layer

-- ─────────────────────────────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own"
  ON users FOR SELECT
  USING (id = auth.uid() OR get_user_role() = 'super_admin');

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "gym_owner_read_gym_users"
  ON users FOR SELECT
  USING (gym_id = get_user_gym_id() AND get_user_role() IN ('gym_owner', 'super_admin'));

-- ─────────────────────────────────────────────────────────────────
-- BRANCHES TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "branches_gym_isolation"
  ON branches FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────────────
-- MEMBERS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_gym_isolation"
  ON members FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────────────
-- LEADS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_gym_isolation"
  ON leads FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- Public insert for join form on gym website
CREATE POLICY "leads_public_insert"
  ON leads FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────
-- MEMBERSHIP_PLANS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_gym_isolation"
  ON membership_plans FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- Public read for gym website plan display
CREATE POLICY "plans_public_read"
  ON membership_plans FOR SELECT
  USING (is_active = true);

-- ─────────────────────────────────────────────────────────────────
-- PAYMENTS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_gym_isolation"
  ON payments FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────────────
-- ATTENDANCE TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_gym_isolation"
  ON attendance FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────────────
-- TRAINERS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainers_gym_isolation"
  ON trainers FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- Public read for gym website trainer display
CREATE POLICY "trainers_public_read"
  ON trainers FOR SELECT
  USING (is_active = true);

-- ─────────────────────────────────────────────────────────────────
-- WEBSITE_SETTINGS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "website_gym_isolation"
  ON website_settings FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- Public read for published sites
CREATE POLICY "website_public_read"
  ON website_settings FOR SELECT
  USING (is_published = true);

-- ─────────────────────────────────────────────────────────────────
-- DOMAINS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "domains_gym_isolation"
  ON domains FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────────────
-- SUBSCRIPTIONS TABLE
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_gym_isolation"
  ON subscriptions FOR ALL
  USING (gym_id = get_user_gym_id() OR get_user_role() = 'super_admin');
