"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { useProductStore } from "@/store/useProductStore";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const is3DTest = pathname === "/3d-test";
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  // Visitors only download the public catalog. The admin panel loads its own data.
  useEffect(() => {
    if (!isAdmin) fetchProducts();
  }, [isAdmin, fetchProducts]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      {!is3DTest && <Footer />}
      <FloatingWhatsApp />
    </>
  );
}
