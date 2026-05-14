
-- Create a new public storage bucket named "portfolio-images"
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public viewing of images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Policy to allow authenticated users (or service role) to insert/upload images
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images');

