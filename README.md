# Bolsa Cheia

Plataforma web para investidores em Fundos Imobiliários (FIIs) brasileiros:
calculadoras de aporte, simulador "bola de neve", comparador
aluguel-vs-FII, radar de oportunidades, carteira pessoal com importação
direta do extrato da B3 e calendário projetado de proventos.

Stack: **Next.js 16** (App Router) + **Tailwind CSS** + **Supabase**
(Auth + Postgres) + **SheetJS** para parse de XLSX.

## Funcionalidades

- **Landing + lista de espera** (`/`) — captura de email persistida no
  Supabase.
- **Autenticação** — cadastro, login, recuperação e redefinição de
  senha via Supabase Auth (`/entrar`, `/cadastro`, `/esqueci-senha`,
  `/redefinir-senha`).
- **Calculadoras**
  - `/calculadora-renda` — quanto preciso investir para uma renda alvo.
  - `/bola-de-neve` — projeção de aporte + reinvestimento ao longo do tempo.
  - `/aluguel-vs-fii` — comparador imóvel próprio vs cota de FII.
- **Carteira**
  - `/carteira` — adicionar/editar/remover FIIs manualmente (persistido em
    `localStorage`). Inputs com máscara monetária BR e validação rigorosa
    de ticker (`XXXX11`).
  - `/importacao` — upload do extrato XLSX/CSV de Movimentação da B3, com
    parser tolerante a múltiplos formatos e painel de diagnóstico técnico.
  - `/calendario` — projeção de 12 meses de proventos com base na carteira.
  - `/radar` — classificador de oportunidades por P/VP, DY e YoC.

## Pré-requisitos

- Node.js 20+ (o repositório vem com uma cópia portátil em
  `../node-portable/` usada pelo `dev.cmd` no Windows).
- Conta no [Supabase](https://supabase.com) (free tier basta).

## Setup local

```bash
git clone https://github.com/brunoinnacio/fiibrasil.git
cd fiibrasil
npm install
cp .env.example .env.local      # preencha com as chaves do seu projeto Supabase
npm run dev                     # http://localhost:3000
```

No Windows, com Node portátil, basta executar `dev.cmd`.

### Variáveis de ambiente

Veja [.env.example](./.env.example). As chaves obrigatórias são:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server actions, **nunca expor no client**)

### Setup do Supabase

1. Em **Authentication → Providers**, habilite *Email*.
2. Em **Authentication → URL Configuration**, defina o Site URL
   (`http://localhost:3000` em dev; seu domínio em prod) e adicione
   `/auth/callback` em *Redirect URLs*.
3. Crie a tabela `waitlist` (usada pela landing):

   ```sql
   create table public.waitlist (
     id uuid primary key default gen_random_uuid(),
     email text not null unique,
     source text,
     created_at timestamptz not null default now()
   );
   alter table public.waitlist enable row level security;
   ```

## Deploy

Pronto para Vercel. Configure as mesmas variáveis em
**Project Settings → Environment Variables** e habilite *Production*,
*Preview* e *Development* conforme necessário.

## Scripts úteis

- `scripts/list_waitlist.mjs` — lista os emails cadastrados (lê
  `.env.local`).
- `scripts/smoke_waitlist.py` — smoke test e2e do formulário em produção
  (requer `playwright`).
