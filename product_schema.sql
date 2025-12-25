-- Create Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price numeric not null,
  currency text default 'INR',
  category text,
  images text[], -- Array of image URLs
  inventory_count integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies

-- Public can view all products
create policy "Public can view products"
  on public.products for select
  using ( true );

-- Artisans can insert their own products
create policy "Artisans can create products"
  on public.products for insert
  with check ( auth.uid() = artisan_id );

-- Artisans can update their own products
create policy "Artisans can update own products"
  on public.products for update
  using ( auth.uid() = artisan_id );

-- Artisans can delete their own products
create policy "Artisans can delete own products"
  on public.products for delete
  using ( auth.uid() = artisan_id );

-- Storage Bucket Setup (Manually create this)
-- Bucket Name: 'products'
-- Public: YES
