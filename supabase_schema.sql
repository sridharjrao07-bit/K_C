-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Profiles Table (Linked to Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'artisan',
  phone text,
  craft text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, craft)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'craft'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Verifications Table
create table public.verifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  id_proof_url text,
  work_sample_urls text[], -- Array of URLs
  status text default 'pending', -- pending, approved, rejected
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Verifications
alter table public.verifications enable row level security;

create policy "Users can insert their own verification"
  on public.verifications for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own verification"
  on public.verifications for select
  using ( auth.uid() = user_id );

-- Storage Bucket Setup (Run this if you can, or create manually)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
-- insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true);

-- Storage Policies
-- create policy "Authenticated users can upload documents"
--   on storage.objects for insert
--   with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );
