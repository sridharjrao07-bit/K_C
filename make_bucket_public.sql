-- FORCE BUCKET TO BE PUBLIC
-- Changing RLS isn't enough; the bucket itself must be flagged as "public"
-- so that getPublicUrl() works.

update storage.buckets
set public = true
where id = 'products';

-- Verify it happened
select id, name, public from storage.buckets where id = 'products';
