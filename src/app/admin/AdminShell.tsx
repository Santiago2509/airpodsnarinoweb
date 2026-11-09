"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LayoutDashboard, Package, LogOut, FileText, DollarSign } from "lucide-react";
import { Toaster } from "sonner";
import { supabase } from "@/lib/supabase";
import { useProductStore } from "@/store/useProductStore";
import LoginForm from "./LoginForm";
import styles from "./admin.module.css";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/ventas", label: "Historial", icon: FileText },
  { href: "/admin/finanzas", label: "Finanzas", icon: DollarSign },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const fetchAdminProducts = useProductStore((s) => s.fetchAdminProducts);
  const fetchTransactions = useProductStore((s) => s.fetchTransactions);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Private data is only requested once someone is signed in
  useEffect(() => {
    if (!session) return;
    fetchAdminProducts();
    fetchTransactions();
  }, [session, fetchAdminProducts, fetchTransactions]);

  const toaster = <Toaster theme="dark" position="bottom-right" richColors closeButton />;

  if (checking) {
    return <div className={styles.authLoading} data-theme="dark" aria-busy="true" />;
  }

  if (!session) {
    return (
      <div data-theme="dark">
        <LoginForm />
        {toaster}
      </div>
    );
  }

  return (
    <div className={styles.adminContainer} data-theme="dark">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <p>Admin Panel</p>
        </div>
        <nav className={styles.sidebarNav} aria-label="Panel de administración">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={styles.navLink}
              aria-current={pathname === href ? "page" : undefined}
              aria-label={label}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => supabase.auth.signOut()}
            aria-label="Cerrar sesión"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>{children}</main>
      {toaster}
    </div>
  );
}
