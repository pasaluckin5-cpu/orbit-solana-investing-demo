create table if not exists public.wallet_portfolios (
  owner_id uuid not null references auth.users (id) on delete cascade,
  wallet_address text not null check (length(wallet_address) between 32 and 64),
  holdings jsonb not null default '[]'::jsonb check (jsonb_typeof(holdings) = 'array'),
  updated_at timestamptz not null default now(),
  primary key (owner_id, wallet_address)
);

alter table public.wallet_portfolios enable row level security;

revoke all on public.wallet_portfolios from anon;
grant select, insert, update on public.wallet_portfolios to authenticated;

create policy "Wallet owners can read their portfolios"
  on public.wallet_portfolios for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Wallet owners can create their portfolios"
  on public.wallet_portfolios for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Wallet owners can update their portfolios"
  on public.wallet_portfolios for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
