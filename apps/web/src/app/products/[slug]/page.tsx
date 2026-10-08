import ProductDetail from '@/components/ProductDetail';
import { SEO_CONFIG } from '@/lib/seo';
import type { Metadata } from 'next';

// Esta función se ejecuta en el servidor para generar metadatos dinámicos
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // IMPORTANT: Await params en Next.js 15
  const { slug } = await params;

  // Fetch del producto desde la API
  const res = await fetch(`https://pci-weights-tommy-ashley.trycloudflare.com/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetProductBySlug($slug: String!) {
          productBySlug(slug: $slug) {
            name
            brand
            category
            description
            price
            currency
            imageUrl
            slug
          }
        }
      `,
      variables: { slug }, // ← Ahora usamos slug directamente
    }),
    next: { revalidate: 3600 }, // Cache por 1 hora
  });

  const data = await res.json();
  const product = data?.data?.productBySlug;

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe en nuestro catálogo.',
    };
  }

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
      type: 'article', // ← Cambiar de 'product' a 'article' (válidos en Next.js)
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
    alternates: {
      canonical: `${SEO_CONFIG.siteUrl}/products/${product.slug}`,
    },
  };
}

export default function ProductPage() {
  return <ProductDetail />;
}