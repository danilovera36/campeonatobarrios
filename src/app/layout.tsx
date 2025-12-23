import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campeonato de Barrios - Alfredo 'Tente' Zulueta",
  description: "Sistema de gestión del campeonato de barrios más importante de la comunidad",
  keywords: ["campeonato", "barrios", "fútbol", "Alfredo Tente Zulueta", "deporte comunitario"],
  authors: [{ name: "Administración del Campeonato" }],
  icons: {
    icon: "https://z-cdn-media.chatglm.cn/files/9762e0d7-3720-4822-bec4-981f4c288b4c_barrios1.png?auth_key=1793125091-719f88f95e6548caa32dc0e3635cd0ea-0-205829fa5d7910d1f5d91314dbf220ee",
    shortcut: "https://z-cdn-media.chatglm.cn/files/9762e0d7-3720-4822-bec4-981f4c288b4c_barrios1.png?auth_key=1793125091-719f88f95e6548caa32dc0e3635cd0ea-0-205829fa5d7910d1f5d91314dbf220ee",
    apple: "https://z-cdn-media.chatglm.cn/files/9762e0d7-3720-4822-bec4-981f4c288b4c_barrios1.png?auth_key=1793125091-719f88f95e6548caa32dc0e3635cd0ea-0-205829fa5d7910d1f5d91314dbf220ee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
