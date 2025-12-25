-- Allow Admins to View All Verifications
create policy "Admins can view all verifications"
  on public.verifications for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Allow Admins to Update Verifications (Approve/Reject)
create policy "Admins can update verifications"
  on public.verifications for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Helper to make yourself admin (Run this line separately with your email)
-- update public.profiles set role = 'admin' where email = 'your_email@example.com';
