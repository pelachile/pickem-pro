-- Set up storage policies for cache bucket
CREATE POLICY "Public read access on cache bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'cache');

CREATE POLICY "Service role can manage cache files" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'cache');