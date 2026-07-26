DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_seller_application_approved'
  ) THEN
    CREATE TRIGGER on_seller_application_approved
      BEFORE UPDATE ON public.seller_applications
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_seller_application_approved();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can upload files to their own uploads folder'
  ) THEN
    CREATE POLICY "Users can upload files to their own uploads folder"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can view their own uploaded files'
  ) THEN
    CREATE POLICY "Users can view their own uploaded files"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can update their own uploaded files'
  ) THEN
    CREATE POLICY "Users can update their own uploaded files"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
      )
      WITH CHECK (
        bucket_id = 'uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Users can delete their own uploaded files'
  ) THEN
    CREATE POLICY "Users can delete their own uploaded files"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'uploads'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;