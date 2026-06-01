-- ============================================================
-- Carteira na nuvem (FII Brasil)
--
-- Rode UMA vez no Supabase:
--   Dashboard -> SQL Editor -> New query -> cole tudo -> Run.
--
-- Cria a tabela que guarda a carteira de cada usuario logado, com
-- Row Level Security (RLS): cada pessoa so enxerga/edita as proprias
-- posicoes. Usuarios anonimos continuam usando o navegador (localStorage).
-- ============================================================

create table if not exists public.carteira_posicoes (
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  quantidade numeric not null default 0,
  preco_medio numeric not null default 0,
  provento_mensal_por_cota numeric not null default 0,
  classe text not null default 'fii',
  nome text,
  updated_at timestamptz not null default now(),
  primary key (user_id, ticker)
);

-- Para quem ja tinha criado a tabela antes da carteira multi-ativos:
alter table public.carteira_posicoes
  add column if not exists classe text not null default 'fii';
alter table public.carteira_posicoes
  add column if not exists nome text;

alter table public.carteira_posicoes enable row level security;

-- Politicas idempotentes (pode rodar de novo sem erro).
drop policy if exists "carteira_select_own" on public.carteira_posicoes;
create policy "carteira_select_own"
  on public.carteira_posicoes for select
  using (auth.uid() = user_id);

drop policy if exists "carteira_insert_own" on public.carteira_posicoes;
create policy "carteira_insert_own"
  on public.carteira_posicoes for insert
  with check (auth.uid() = user_id);

drop policy if exists "carteira_update_own" on public.carteira_posicoes;
create policy "carteira_update_own"
  on public.carteira_posicoes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "carteira_delete_own" on public.carteira_posicoes;
create policy "carteira_delete_own"
  on public.carteira_posicoes for delete
  using (auth.uid() = user_id);
