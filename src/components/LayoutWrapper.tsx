"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { useProductStore } from "@/store/useProductStore";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const is3DTest = pathname === "/3d-test";
  const { fetchProducts, fetchTransactions } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, [fetchProducts, fetchTransactions]);

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && !is3DTest && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
    </>
  );
}
