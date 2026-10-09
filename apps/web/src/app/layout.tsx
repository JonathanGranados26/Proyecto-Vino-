import type { Metadata } from 'next';
import { ApolloProvider } from '@/components/ApolloProvider';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import { SEO_CONFIG } from '@/lib/seo';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: '%s | GWS Wine',
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: ['vinos', 'licores', 'whisky', 'ron', 'tequila', 'El Salvador', 'catálogo premium', 'bebidas alcohólicas'],
  authors: [{ name: 'GWS Wine Platform' }],
  creator: 'GWS Wine',
  publisher: 'GWS Wine Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SEO_CONFIG.locale,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: SEO_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: 'GWS Wine Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [SEO_CONFIG.defaultImage],
    creator: SEO_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'TU_GOOGLE_VERIFICATION_CODE', // Reemplazar con código de Google Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-cream-50 font-sans text-gray-900">
        <ApolloProvider>
          {/* Header Glassmorphism */}
          <header className="glass sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-3xl font-serif font-bold text-wine-700 tracking-tight hover:scale-105 transition-transform">
                GWS Wine
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-gray-700 hover:text-wine-700 transition font-medium relative group">
                  Catálogo
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full" />
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-wine-700 transition font-medium relative group">
                  Contacto
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full" />
                </Link>
              </nav>
            </div>
          </header>

          <main className="min-h-screen">{children}</main>

          {/* Bottom Nav Móvil */}
          <BottomNav />

          {/* Footer */}
          <footer className="bg-wine-950 text-white py-16 mt-20 pb-24 md:pb-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 text-gold-400">GWS Wine</h3>
                  <p className="text-wine-200 text-sm">Selección premium de vinos y licores de todo el mundo.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gold-300">Explorar</h4>
                  <ul className="space-y-2 text-sm text-wine-200">
                    <li><Link href="/" className="hover:text-white transition">Catálogo</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition">Contacto</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gold-300">Contacto</h4>
                  <ul className="space-y-2 text-sm text-wine-200">
                    <li>📞 +503 7008 7508</li>
                    <li>✉️ axelbarrientos031@gmail.com</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-gold-300">Horario</h4>
                  <ul className="space-y-2 text-sm text-wine-200">
                    <li>Lun - Vie: 9:00 - 18:00</li>
                    <li>Sáb: 10:00 - 14:00</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-wine-800 pt-8 text-center text-sm text-wine-300">
                <p>© 2026 GWS Wine Platform. Todos los derechos reservados.</p>
                <p className="mt-2 text-xs">Catálogo de referencia. Precios sujetos a cambio sin previo aviso.</p>
              </div>
            </div>
          </footer>
        </ApolloProvider>
      </body>
    </html>
  );
}