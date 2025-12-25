-- 1. Fix RLS Policy for Products
alter table public.products enable row level security;

drop policy if exists "Artisans can create products" on public.products;
drop policy if exists "Enable insert for authenticated users" on public.products;

create policy "Enable insert for authenticated users"
on public.products for insert
to authenticated
with check ( auth.uid() = artisan_id );

-- 2. Ensure Profile Exists (Fix for FK issues or missing profile)
-- This attempts to insert a profile for your user if it's missing
insert into public.profiles (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', 'artisan'
from auth.users
on conflict (id) do nothing;

-- 3. Grant Permissions (Just in case)
grant all on public.products to authenticated;
grant all on public.products to anon;
