# Setup rápido: comentários permanentes para todos

## 1) Criar projeto no Supabase
- Acesse: https://supabase.com
- Crie um projeto novo.

## 2) Criar tabela `reviews`
No SQL Editor do Supabase, rode:

```sql
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 80),
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 3 and 1000),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Public can read reviews"
on public.reviews
for select
using (true);

create policy "Public can insert reviews"
on public.reviews
for insert
with check (true);
```

## 3) Pegar URL e chave pública
No Supabase:
- Project Settings -> API
- Copie:
  - Project URL
  - anon public key

## 4) Colocar as credenciais no site
Abra `index.html` e encontre o bloco:

```html
<script>
    window.REVIEWS_DB_CONFIG = {
        supabaseUrl: '',
        supabaseAnonKey: ''
    };
</script>
```

Preencha com seus valores reais.

## 5) Publicar
Após publicar, qualquer comentário enviado será salvo no banco e ficará visível para todos os visitantes.

## Observação
"Para sempre" depende do projeto Supabase continuar ativo e dentro do plano/limites da conta.
