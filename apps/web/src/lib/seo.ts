export const SEO_CONFIG = {
  siteName: 'GWS Wine Platform',
  siteUrl: 'http://localhost:3000',
  defaultTitle: 'GWS Wine Platform | Catálogo Premium de Vinos y Licores',
  defaultDescription: 'Descubre nuestra selección premium de vinos y licores de todo el mundo. Catálogo completo con notas de cata, maridaje y precios de referencia.',
  defaultImage: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&q=80',
  locale: 'es_SV',
  twitterHandle: '@gwswine',
};

export function generateProductMetadata(product: {
  name: string;
  brand: string;
  category: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  slug: string;
}) {
  const title = `${product.name} | ${product.brand} - GWS Wine`;
  const description = product.description 
    ? `${product.description.substring(0, 155)}...`
    : `${product.name} de ${product.brand}. Categoría: ${product.category}. Precio: $${product.price} ${product.currency}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product',
      url: `${SEO_CONFIG.siteUrl}/products/${product.slug}`,
      images: [
        {
          url: product.imageUrl || SEO_CONFIG.defaultImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl || SEO_CONFIG.defaultImage],
    },
  };
}