-- FIX STORAGE PERMISSIONS
-- The error "StorageApiError" means Supabase is blocking the FILE UPLOAD.
-- Even if the bucket is public, you need a policy to allow Uploads.

-- 1. Allow Uploads (Insert)
create policy "Allow Artisan Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'products' );

-- 2. Allow Updates (Overwrite)
create policy "Allow Artisan Updates"
on storage.objects for update
to authenticated
using ( bucket_id = 'products' );

-- 3. Allow Public Access (View)
create policy "Allow Public Viewing"
on storage.objects for select
using ( bucket_id = 'products' );
