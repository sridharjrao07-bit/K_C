-- 1. Create Table (IF NOT EXISTS)
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price numeric not null,
  currency text default 'INR',
  category text,
  images text[],
  inventory_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Ensure Profile Exists (Fix foreign key issues)
insert into public.profiles (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', 'artisan'
from auth.users
on conflict (id) do nothing;

-- 3. Reset RLS (Start Clean)
alter table public.products enable row level security;
drop policy if exists "Enable insert for authenticated users" on public.products;
drop policy if exists "Artisans can create products" on public.products;
drop policy if exists "Public can view products" on public.products;

-- 4. Apply Simple Policies
create policy "Public can view products"
  on public.products for select
  using ( true );

create policy "Enable insert for authenticated users"
  on public.products for insert
  to authenticated
  with check ( auth.uid() = artisan_id );

create policy "Enable update for owners"
  on public.products for update
  using ( auth.uid() = artisan_id );

create policy "Enable delete for owners"
  on public.products for delete
  using ( auth.uid() = artisan_id );

-- 5. (Optional) Uncomment to disable security if you STILL have issues
-- alter table public.products disable row level security;
