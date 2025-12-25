-- MASTER REPAIR SCRIPT
-- Run this block entirely to fix missing tables.

-- 1. Create Profiles Table (If it was missing, products creation would fail)
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

-- 3. Ensure YOUR User Profile Exists
insert into public.profiles (id, email, full_name, role)
select id, email, raw_user_meta_data->>'full_name', 'artisan'
from auth.users
on conflict (id) do nothing;

-- 4. Reset Permissions (Open everything for testing)
alter table public.products enable row level security;
alter table public.profiles enable row level security;

-- Drop old policies to avoid conflicts
drop policy if exists "Public view products" on public.products;
drop policy if exists "Artisan insert products" on public.products;
drop policy if exists "Public view profiles" on public.profiles;

-- Create Open Policies
create policy "Public view products" on public.products for select using (true);
create policy "Artisan insert products" on public.products for insert with check (auth.uid() = artisan_id);
create policy "Public view profiles" on public.profiles for select using (true);
