import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import GradientBackground from "@/components/GradientBackground";
import SmoothScrolling from "@/components/SmoothScrolling";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Airpods Nariño",
  description: "Audífonos y accesorios Apple con garantía real en Pasto y todo Nariño.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#03050b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // next-themes sets data-theme before paint, so the server markup differs on purpose
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Orbitron:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <SmoothScrolling>
            <GradientBackground />
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScrolling>
        </Providers>
      </body>
    </html>
  );
}
