-- Create storage bucket for registration documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-documents', 'registration-documents', false);

-- RLS policies for registration documents bucket
CREATE POLICY "Anyone can upload registration documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'registration-documents');

CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'registration-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'registration-documents' AND public.has_role(auth.uid(), 'admin'));