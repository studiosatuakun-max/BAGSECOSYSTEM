-- ============================================================
-- Migration 03: Dispatch Inbox System
-- Cross-divisi messaging dengan file attachments
-- ============================================================

-- ── Table: dispatches ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dispatches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_division TEXT NOT NULL
                CHECK (from_division IN (
                  'stasiun', 'armada', 'keuangan', 'hr', 'legal',
                  'pemasaran', 'skid', 'horeca', 'industrial', 'pwa', 'admin'
                )),
  to_division   TEXT NOT NULL
                CHECK (to_division IN (
                  'stasiun', 'armada', 'keuangan', 'hr', 'legal',
                  'pemasaran', 'skid', 'horeca', 'industrial', 'pwa', 'admin'
                )),
  subject       TEXT NOT NULL,
  body          TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'Normal'
                CHECK (priority IN ('Normal', 'High', 'Urgent')),
  status        TEXT NOT NULL DEFAULT 'Unread'
                CHECK (status IN ('Unread', 'Read', 'In_Review', 'Resolved')),
  sent_by       UUID REFERENCES auth.users(id),
  sent_by_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER dispatches_updated_at
  BEFORE UPDATE ON dispatches
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Index untuk query inbox per divisi
CREATE INDEX IF NOT EXISTS dispatches_to_division_idx ON dispatches(to_division, created_at DESC);
CREATE INDEX IF NOT EXISTS dispatches_from_division_idx ON dispatches(from_division, created_at DESC);

-- ── RLS: dispatches ───────────────────────────────────────────
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;

-- SELECT: User bisa lihat inbox divisinya ATAU outbox yang dia kirim
CREATE POLICY "dispatches_select"
  ON dispatches FOR SELECT
  USING (
    -- Super admin bisa lihat semua
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR
    -- User bisa lihat dispatch yang ditujukan ke divisinya
    to_division = (auth.jwt() -> 'app_metadata' ->> 'division')
    OR
    -- User bisa lihat dispatch yang dia kirim
    sent_by = auth.uid()
  );

-- INSERT: Semua user yang login bisa kirim dispatch
CREATE POLICY "dispatches_insert"
  ON dispatches FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND sent_by = auth.uid()
    -- Divisi pengirim harus sesuai dengan divisi user
    AND from_division = (auth.jwt() -> 'app_metadata' ->> 'division')
  );

-- UPDATE: Hanya penerima (ubah status) atau pengirim yang bisa update
CREATE POLICY "dispatches_update"
  ON dispatches FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR to_division = (auth.jwt() -> 'app_metadata' ->> 'division')
    OR sent_by = auth.uid()
  );

-- DELETE: Hanya super_admin
CREATE POLICY "dispatches_delete"
  ON dispatches FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );


-- ── Table: dispatch_files ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS dispatch_files (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_id      UUID NOT NULL REFERENCES dispatches(id) ON DELETE CASCADE,
  file_name        TEXT NOT NULL,
  storage_path     TEXT NOT NULL,  -- path di Supabase Storage bucket 'dispatch-attachments'
  file_size_bytes  BIGINT,
  mime_type        TEXT,
  uploaded_by      UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dispatch_files_dispatch_id_idx ON dispatch_files(dispatch_id);

-- ── RLS: dispatch_files ───────────────────────────────────────
ALTER TABLE dispatch_files ENABLE ROW LEVEL SECURITY;

-- SELECT: Hanya jika user punya akses ke dispatch terkait
CREATE POLICY "dispatch_files_select"
  ON dispatch_files FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
    OR EXISTS (
      SELECT 1 FROM dispatches d
      WHERE d.id = dispatch_id
      AND (
        d.to_division = (auth.jwt() -> 'app_metadata' ->> 'division')
        OR d.sent_by = auth.uid()
      )
    )
  );

-- INSERT: Hanya pengirim dispatch yang bisa upload file
CREATE POLICY "dispatch_files_insert"
  ON dispatch_files FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM dispatches d
      WHERE d.id = dispatch_id AND d.sent_by = auth.uid()
    )
  );

-- DELETE: Hanya uploader atau super_admin
CREATE POLICY "dispatch_files_delete"
  ON dispatch_files FOR DELETE
  USING (
    uploaded_by = auth.uid()
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin'
  );
