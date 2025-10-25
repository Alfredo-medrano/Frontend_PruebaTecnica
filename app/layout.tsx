import type { Metadata } from "next";
// REMOVIDO: import { Inter } from "next/font/google"; // <-- Eliminamos la línea que causa el error
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// REMOVIDO: const inter = Inter({ subsets: ["latin"] }); // <-- Eliminamos la inicialización

export const metadata: Metadata = {
  title: "To-Do App - Prueba Técnica",
  description: "Gestor de tareas con Next.js y Laravel API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* CORRECCIÓN: Se elimina el uso de la variable 'inter' y se añade una clase para una fuente genérica segura (sans-serif) */}
      <body className={`font-sans bg-gray-100`}> 
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}