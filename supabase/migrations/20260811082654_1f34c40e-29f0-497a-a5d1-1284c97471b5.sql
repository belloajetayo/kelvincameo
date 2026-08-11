CREATE TABLE public.site_images (
  key TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site images are publicly readable"
  ON public.site_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Staff can insert site images"
  ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update site images"
  ON public.site_images FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete site images"
  ON public.site_images FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can read site image files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-images' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can upload site image files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can update site image files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'site-images' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can delete site image files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.is_staff(auth.uid()));