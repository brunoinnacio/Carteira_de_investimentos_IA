# Bolsa Cheia

**Plataforma educacional de investimentos** para iniciantes brasileiros —
explica, sem palavras difíceis, *onde* e *como* investir em FIIs, ações de
dividendos e renda fixa. Reúne carteira pessoal com sincronização na nuvem,
importação direta do extrato da B3, calculadoras, simuladores e um radar de
oportunidades com cotações ao vivo.

> Conteúdo **educacional**, não recomendação de investimento (em conformidade
> com a postura exigida pela CVM). Todas as classificações seguem regras fixas
> e transparentes.

**Stack:** Next.js 16 (App Router, Server Actions) · React 19 · TypeScript ·
Tailwind CSS 4 · Supabase (Auth + Postgres com RLS) · SheetJS (XLSX) ·
Yahoo Finance (cotações) · Vercel (deploy + Analytics + Speed Insights).

---

## Destaques técnicos

- **Carteira multi-ativos com sincronização na nuvem.** Usuário anônimo usa
  `localStorage`; ao criar conta, a carteira passa a viver no Postgres com
  **Row Level Security** (cada pessoa só lê/escreve as próprias posições).
  Sessões anônima e logada são isoladas para evitar vazamento de dados em
  dispositivos compartilhados.
- **Importador do extrato da B3.** Faz parse tolerante de XLSX/CSV de dois
  relatórios distintos — **Movimentação** e **Posição** — cobrindo Ações,
  FIIs, Renda Fixa e COE. Detecta o formato automaticamente.
- **Estimativa de renda baseada no mercado.** Quando o extrato não traz o
  provento, heurísticas estimam a taxa anual a partir do nome do produto
  (ex.: `% CDI`, `IPCA+`, `SELIC`, prefixado) e do tipo de ativo, com opção
  de ajuste manual inline.
- **Cotações ao vivo** via rota de API própria (`/api/cotacoes`) que consome o
  Yahoo Finance — P/VP, P/L e Dividend Yield calculados em tempo real.
- **Modo simulação ("R$ 100 mil").** Carteira de exemplo diversificada para o
  visitante experimentar a plataforma sem cadastro, com selo de simulação.
- **SEO de verdade:** `sitemap.ts`, `robots.ts`, OpenGraph dinâmico
  (`ImageResponse`), JSON-LD (`Article`/`FAQPage`), conteúdo *cornerstone* e
  verificação do Google Search Console.
- **Segurança:** headers HTTP (HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy), `poweredByHeader: false`, segredos
  fora do client (service role apenas em Server Actions) e auditado sem chaves
  no histórico do git.

## Funcionalidades

### Carteira & dados
- `/carteira` — adicionar/editar/remover ativos (FIIs, ações, renda fixa) com
  máscara monetária BR, gráfico de alocação (donut) e KPIs; persistência local
  (anônimo) ou na nuvem (logado). Inclui **modo simulação** e filtros.
- `/importacao` — upload do extrato da B3 (Movimentação ou Posição) com painel
  de diagnóstico técnico.
- `/calendario` — projeção mensal de proventos a partir da carteira.

### Ferramentas
- `/radar` — classificador "caro ou barato?" que alterna entre **FII**
  (P/VP, DY, Yield on Cost) e **Ação** (P/L, DY, YoC).
- `/oportunidades` — explorador com abas **FIIs** e **Ações de dividendos**,
  filtros objetivos e cotação ao vivo.
- `/calculadora-renda` — quanto investir para viver de renda passiva.
- `/bola-de-neve` — projeção de aporte + reinvestimento ao longo do tempo.
- `/aluguel-vs-fii` — comparador imóvel próprio vs cota de FII.

### Conteúdo educacional
- `/aprender`, `/guias`, `/glossario`, `/tipos-de-investimento`, `/kit`
  (kit grátis do investidor iniciante com planilha e checklist).

### Conta
- Autenticação completa via Supabase: `/cadastro`, `/entrar`,
  `/esqueci-senha`, `/redefinir-senha`, e perfil em `/perfil`.
- Landing com lista de espera (`/`) persistida no Supabase.

## Arquitetura

```
src/
├── app/                 # rotas (App Router) + Server Actions em app/actions
│   ├── api/cotacoes/    # proxy de cotações (Yahoo Finance)
│   └── ...              # páginas (carteira, radar, oportunidades, guias...)
├── components/          # UI reutilizável (inputs com máscara, gráficos, menus)
├── data/                # bases curadas: fiis.ts, acoes.ts, guias.ts, trilha.ts
└── lib/                 # carteira (hook + modelo), supabase, cotações, SEO
supabase/                # SQL das tabelas (waitlist, carteira_posicoes + RLS)
```

## Pré-requisitos

- Node.js 20+ (no Windows há uma cópia portátil em `../node-portable/` usada
  pelo `dev.cmd`).
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

Veja [.env.example](./.env.example). As principais:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Server Actions, **nunca expor no client**)
- `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION`,
  `NEXT_PUBLIC_AFFILIATE_URL` (opcionais)

### Setup do Supabase

1. Em **Authentication → Providers**, habilite *Email*.
2. Em **Authentication → URL Configuration**, defina o Site URL e adicione
   `/auth/callback` em *Redirect URLs*.
3. No **SQL Editor**, rode os scripts de [`supabase/`](./supabase):
   `waitlist` (lista de espera) e
   [`carteira_posicoes.sql`](./supabase/carteira_posicoes.sql) (carteira na
   nuvem com RLS).

## Deploy

Pronto para Vercel. Configure as mesmas variáveis em **Project Settings →
Environment Variables** (Production/Preview/Development). `@vercel/analytics`
e `@vercel/speed-insights` já estão integrados.

## Scripts úteis

- `scripts/list_waitlist.mjs` — lista os emails cadastrados (lê `.env.local`).
- `scripts/smoke_waitlist.py` — smoke test e2e do formulário (requer
  `playwright`).

## Licença

Projeto pessoal/portfólio. Conteúdo educacional — veja o
[aviso legal](./src/app/aviso-legal/page.tsx).
