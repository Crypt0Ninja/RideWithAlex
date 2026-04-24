-- Row Level Security for time_slots + bookings
-- Strategy:
--   - time_slots: public read (booking UI lists available slots); only service_role writes
--   - bookings:   anon can INSERT (guest books); only service_role reads/updates/deletes
--   - service_role bypasses RLS by default; explicit policies are defensive

ALTER TABLE "time_slots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "time_slots_public_select"
  ON "time_slots"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "time_slots_service_role_all"
  ON "time_slots"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bookings_public_insert"
  ON "bookings"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "bookings_service_role_all"
  ON "bookings"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
