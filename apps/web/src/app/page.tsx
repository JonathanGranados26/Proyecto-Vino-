import HeroSection from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { SEO_CONFIG } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Catálogo premium de vinos y licores de todo el mundo. Descubre nuestra selección exclusiva.',
};

// Schema.org JSON-LD para la organización
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_CONFIG.siteName,
  url: SEO_CONFIG.siteUrl,
  logo: `${SEO_CONFIG.siteUrl}/logo.png`,
  description: SEO_CONFIG.defaultDescription,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+503-7008-7508',
    contactType: 'customer service',
    email: 'axelbarrientos031@gmail.com',
    areaServed: 'SV',
    availableLanguage: 'Spanish',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SV',
  },
};

export default function Home() {
  return (
    <div>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <HeroSection />
      
      <section id="catalogo" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-gold-600 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            Nuestra Selección
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-wine-900 mb-6">
            Catálogo Completo
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto" />
        </div>

        <ProductGrid />
      </section>
    </div>
  );
}