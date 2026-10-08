import type { Metadata } from 'next';
import { ApolloProvider } from '@/components/ApolloProvider';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'GWS Wine Platform',
  description: 'Catálogo premium de vinos y licores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        <ApolloProvider>
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-wine-700">
                GWS Wine
              </Link>
              
              <nav className="flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-wine-700 transition font-medium">
                  Catálogo
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-wine-950 text-white py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-wine-200">© 2026 GWS Wine Platform. Todos los derechos reservados.</p>
              <p className="text-wine-300 text-sm mt-2">
                Catálogo de referencia. Precios sujetos a cambio sin previo aviso.
              </p>
            </div>
          </footer>
        </ApolloProvider>
      </body>
    </html>
  );
}