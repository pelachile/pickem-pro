-- Create storage bucket for cached JSON files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cache',
  'cache',
  true,
  10485760, -- 10MB limit
  ARRAY['application/json']::text[]
) ON CONFLICT (id) DO NOTHING;