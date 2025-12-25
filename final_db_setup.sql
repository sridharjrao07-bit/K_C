-- FINAL SETUP SCRIPT
-- Please run ALL of this code. Do not skip any lines.

-- 1. Create Profiles Table (Required for Products to exist)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  craft text,
  phone text,
  role text default 'artisan',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Products Table
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

-- 3. Fix Missing Profile Data (Syncs Auth Users to Profiles)
insert into public.profiles (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', 'artisan'
from auth.users
on conflict (id) do nothing;

-- 4. Set Permissions (Allow Everything for now)
alter table public.products enable row level security;
alter table public.profiles enable row level security;

-- Clear old policies
drop policy if exists "Everything Open Products" on public.products;
drop policy if exists "Everything Open Profiles" on public.profiles;

-- Create new open policies
create policy "Everything Open Products" on public.products for all using (true) with check (true);
create policy "Everything Open Profiles" on public.profiles for all using (true) with check (true);
