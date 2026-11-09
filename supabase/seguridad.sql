-- =====================================================================
-- Seguridad de la base de datos de Airpods Nariño
-- =====================================================================
-- QUÉ HACE
--   * Los visitantes (rol "anon") solo pueden LEER productos activos,
--     y solo las columnas públicas (nunca cost_price ni precios mayoristas).
--   * Las transacciones (ventas, costos, ganancias) solo las ve el admin.
--   * Solo el admin puede crear, editar o borrar productos, registrar
--     ventas y subir o borrar fotos.
--
-- ANTES DE CORRERLO
--   1. En Supabase > Authentication > Users, crea el usuario admin
--      (correo + contraseña). Ese es el login de /admin.
--   2. En Authentication > Sign In / Providers, DESACTIVA "Allow new users
--      to sign up", para que nadie más pueda crearse una cuenta.
--   3. Si el correo del admin no es narinoairpods@gmail.com, cámbialo abajo
--      en la función is_admin().
--   4. Revisa Authentication > Policies (tablas products y transactions) y
--      Storage > Policies (bucket product-images). Borra las políticas viejas
--      que den acceso a todos (por ejemplo "Enable all access" o "true"):
--      las políticas se suman, así que una abierta anula todo lo de abajo.
--
-- CÓMO CORRERLO
--   Supabase > SQL Editor > New query > pega todo este archivo > Run.
--   Se puede correr varias veces sin problema.
-- =====================================================================

-- ¿Quién es admin? Cambia o agrega correos aquí.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'narinoairpods@gmail.com'
  );
$$;

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (status = 'active' or public.is_admin());

drop policy if exists "Admin manages products" on public.products;
create policy "Admin manages products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Visitors only get the public columns
revoke select on public.products from anon;
grant select (id, name, description, price, image_url, images, stock, status, created_at)
  on public.products to anon;

-- ---------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------
alter table public.transactions enable row level security;

drop policy if exists "Admin manages transactions" on public.transactions;
create policy "Admin manages transactions"
  on public.transactions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke all on public.transactions from anon;

-- ---------------------------------------------------------------------
-- Storage: product photos (bucket "product-images")
-- Anyone can view the photos; only the admin can upload or delete them.
-- ---------------------------------------------------------------------
drop policy if exists "Admin uploads product images" on storage.objects;
create policy "Admin uploads product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin updates product images" on storage.objects;
create policy "Admin updates product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin deletes product images" on storage.objects;
create policy "Admin deletes product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
