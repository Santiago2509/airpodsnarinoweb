-- =====================================================================
-- Mejoras del panel de administración — Airpods Nariño
-- =====================================================================
-- QUÉ HACE
--   1. Agrega la columna "category" a los productos (AirPods, cargadores,
--      cables, estuches, Apple Watch, otros).
--   2. Crea dos funciones para que cada movimiento se guarde en UN solo paso:
--        - register_transaction: registra la venta/garantía/devolución y
--          actualiza el stock al mismo tiempo. Si no hay stock suficiente,
--          no guarda nada.
--        - delete_transaction: borra un movimiento y devuelve el stock
--          como estaba antes.
--      Sin esto, el panel sigue funcionando, pero en dos pasos.
--
-- CÓMO CORRERLO
--   Supabase > SQL Editor > New query > pega todo este archivo > Run.
--   Se puede correr varias veces sin problema.
--
-- IMPORTANTE
--   Este archivo NO cambia permisos. El panel sigue abierto sin contraseña.
-- =====================================================================

-- 1. Categoría de producto --------------------------------------------
alter table public.products add column if not exists category text;

-- If visitors already have column-level access (seguridad.sql), let them read it too
do $$
begin
  if exists (
    select 1 from information_schema.column_privileges
    where table_schema = 'public' and table_name = 'products' and grantee = 'anon'
  ) then
    execute 'grant select (category) on public.products to anon';
  end if;
end $$;

-- 2. Registrar un movimiento y ajustar el stock en un solo paso ---------
create or replace function public.register_transaction(
  p_product_id public.products.id%type,
  p_product_name text,
  p_quantity integer,
  p_price numeric,
  p_type text,
  p_notes text default null
)
returns void
language plpgsql
as $$
declare
  v_stock integer;
  v_cost numeric;
  v_change integer;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'CANTIDAD_INVALIDA';
  end if;

  -- Lock the product row so two sales at once cannot both use the same stock
  select stock, coalesce(cost_price, 0)
    into v_stock, v_cost
    from public.products
   where id = p_product_id
   for update;

  if not found then
    raise exception 'PRODUCTO_NO_EXISTE';
  end if;

  if p_type in ('sale', 'warranty') then
    if v_stock < p_quantity then
      raise exception 'STOCK_INSUFICIENTE';
    end if;
    v_change := -p_quantity;
  elsif p_type = 'return' then
    v_change := p_quantity;
  else
    raise exception 'TIPO_INVALIDO';
  end if;

  insert into public.transactions
    (product_id, product_name, quantity, cost_at_transaction, price_at_transaction, total_amount, type, notes)
  values
    (p_product_id, p_product_name, p_quantity, v_cost, p_price, p_price * p_quantity, p_type, p_notes);

  update public.products
     set stock = stock + v_change
   where id = p_product_id;
end;
$$;

-- 3. Borrar un movimiento y devolver el stock ---------------------------
create or replace function public.delete_transaction(
  p_id public.transactions.id%type
)
returns void
language plpgsql
as $$
declare
  v_tx public.transactions%rowtype;
begin
  select * into v_tx from public.transactions where id = p_id for update;
  if not found then
    raise exception 'MOVIMIENTO_NO_EXISTE';
  end if;

  delete from public.transactions where id = p_id;

  -- Undo the stock change (the product may have been deleted since)
  update public.products
     set stock = greatest(0, stock + case
           when v_tx.type in ('sale', 'warranty') then v_tx.quantity
           when v_tx.type = 'return' then -v_tx.quantity
           else 0 end)
   where id = v_tx.product_id;
end;
$$;
