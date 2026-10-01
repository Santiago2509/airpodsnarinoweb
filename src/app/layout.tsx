import { Montserrat, Orbitron } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import GradientBackground from "@/components/GradientBackground";
import SmoothScrolling from "@/components/SmoothScrolling";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-orbitron",
});

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
      <body className={`${montserrat.variable} ${orbitron.variable}`}>
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
