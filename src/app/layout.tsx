import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import GradientBackground from "@/components/GradientBackground";
import SmoothScrolling from "@/components/SmoothScrolling";

export const metadata = {
  title: "Airpods Nariño",
  description: "Los mejores audífonos al mejor precio en Nariño",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Orbitron:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SmoothScrolling>
          <GradientBackground />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SmoothScrolling>
      </body>
    </html>
  );
}
