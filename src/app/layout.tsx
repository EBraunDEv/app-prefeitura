import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'semantic-ui-css/semantic.min.css'

import { UserProvider } from "@/contexts/UserContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cidade Conectada",
  description: "App de gerenciamento de serviços públicos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
<UserProvider>
      <body className={inter.className}>{children}</body>
  </UserProvider>
    </html>
  );
}
