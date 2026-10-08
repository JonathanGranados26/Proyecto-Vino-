'use client';

import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import { Info, Wine, MapPin, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';

// ============================================
// QUERIES DE GRAPHQL
// ============================================

const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      brand
      category
      description
      presentation
      alcoholicDegree
      price
      currency
      stock
      country
      region
      grape
      vintage
      score
      pairing
      imageUrl
      images
      tastingNotes
    }
  }
`;

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($category: String!, $excludeId: ID!) {
    relatedProducts(category: $category, excludeId: $excludeId, limit: 4) {
      id
      name
      slug
      brand
      price
      imageUrl
    }
  }
`;

// ============================================
// TIPOS
// ============================================

type TabKey = 'descripcion' | 'notas' | 'maridaje' | 'ficha';

// Mapeo de notas de cata a iconos visuales
const NOTE_ICONS: Record<string, string> = {
  'vainilla': '🌼',
  'roble': '🪵',
  'frutas rojas': '🍒',
  'frutas negras': '🫐',
  'cítricos': '🍋',
  'floral': '🌸',
  'especias': '🌶️',
  'chocolate': '🍫',
  'café': '☕',
  'caramelo': '',
  'miel': '',
  'tabaco': '🍂',
  'cuero': '👜',
  'ahumado': '💨',
  'herbal': '🌿',
  'mineral': '💎',
  'frutal': '🍇',
  'terroso': '',
  'vegetal': '',
  'pimienta': '️',
  'madera': '',
  'frutos secos': '🥜',
  'fruta madura': '🍑',
  'fruta fresca': '🍓',
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ProductDetail() {
  // ============================================
  // TODOS LOS HOOKS AL INICIO (ANTES DE CUALQUIER RETURN)
  // ============================================
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('descripcion');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Queries
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const { data: relatedData } = useQuery(GET_RELATED_PRODUCTS, {
    variables: {
      category: data?.productBySlug?.category,
      excludeId: data?.productBySlug?.id,
    },
    skip: !data?.productBySlug,
  });

  // ============================================
  // MEMOS Y CÁLCULOS (DESPUÉS DE LOS HOOKS, ANTES DE LOS RETURNS)
  // ============================================

  // Combinar imágenes (principal + galería)
  const allImages: string[] = useMemo(() => {
    if (!data?.productBySlug) return [];

    const images = [
      data.productBySlug.imageUrl,
      ...(data.productBySlug.images || []),
    ].filter(Boolean) as string[];

    return images;
  }, [data]);

  const currentImage = allImages[selectedImageIndex] || data?.productBySlug?.imageUrl;
  const isAvailable = data?.productBySlug?.stock > 0;

  // Schema.org JSON-LD para SEO
  const productSchema = useMemo(() => {
    if (!data?.productBySlug) return null;

    const product = data.productBySlug;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || '',
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: isAvailable
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'GWS Wine Platform',
        },
      },
      image: currentImage || '',
      aggregateRating: product.score
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.score,
            bestRating: 100,
            worstRating: 0,
          }
        : undefined,
      additionalProperty: [
        product.grape && { '@type': 'PropertyValue', name: 'Cepa', value: product.grape },
        product.vintage && { '@type': 'PropertyValue', name: 'Añada', value: product.vintage },
        product.country && { '@type': 'PropertyValue', name: 'País', value: product.country },
        product.region && { '@type': 'PropertyValue', name: 'Región', value: product.region },
        product.alcoholicDegree && {
          '@type': 'PropertyValue',
          name: 'Grado Alcohólico',
          value: `${product.alcoholicDegree}% vol.`,
        },
      ].filter(Boolean),
    };
  }, [data, isAvailable, currentImage]);

  // Mensaje de WhatsApp
  const whatsappMessage = useMemo(() => {
    if (!data?.productBySlug) return '';
    const product = data.productBySlug;
    return encodeURIComponent(
      `¡Hola! Me interesa el producto: ${product.name}\n` +
      `Precio de referencia: $${product.price.toLocaleString()} ${product.currency}\n` +
      `¿Podrían darme más información sobre disponibilidad y detalles?`
    );
  }, [data]);

  const whatsappUrl = `https://wa.me/50370087508?text=${whatsappMessage}`;

  // Tabs de información
  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'descripcion', label: 'Descripción', icon: Info },
  { key: 'notas', label: 'Notas de Cata', icon: Wine },
  { key: 'maridaje', label: 'Maridaje', icon: Award },
  { key: 'ficha', label: 'Ficha Técnica', icon: MapPin },
  ];

  // Funciones de navegación de imágenes
  const goToNextImage = () => {
    if (allImages.length === 0) return;
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrevImage = () => {
    if (allImages.length === 0) return;
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // ============================================
  // RETURNS TEMPRANOS (DESPUÉS DE TODOS LOS HOOKS)
  // ============================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-cream-200 rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 bg-wine-700 rounded-full animate-fill-up" />
        </div>
      </div>
    );
  }

  if (error || !data?.productBySlug) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">
          Producto no encontrado
        </h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos encontrar el producto que buscas.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // ============================================
  // RENDERIZADO PRINCIPAL
  // ============================================

  const product = data.productBySlug;
  const relatedProducts = relatedData?.relatedProducts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Schema.org JSON-LD para SEO */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-wine-700 transition">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-wine-700 transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* ============================================
          SECCIÓN PRINCIPAL: IMAGEN + INFO
          ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Galería de Imágenes */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Imagen principal */}
          <div className="relative bg-cream-100 rounded-2xl overflow-hidden shadow-float border border-cream-200 mb-4">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-[500px] lg:h-[650px] object-cover cursor-zoom-in transition-transform duration-500"
                onClick={() => setIsLightboxOpen(true)}
              />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center text-gray-400 text-lg">
                Sin imagen disponible
              </div>
            )}

            {/* Controles de navegación (solo si hay más de 1 imagen) */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-wine-700" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition shadow-lg"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-wine-700" />
                </button>

                {/* Indicador de posición */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedImageIndex === index
                      ? 'border-wine-700 shadow-lg'
                      : 'border-cream-200 hover:border-wine-300'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Información del Producto */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          {/* Badges superiores */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="inline-block px-4 py-1 bg-wine-50 text-wine-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
            {product.score && (
              <span className="inline-block px-4 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-bold animate-pulse-gold">
                ⭐ {product.score}/100
              </span>
            )}
          </div>

          {/* Título y marca */}
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-xl text-gray-500 mb-6 italic">{product.brand}</p>

          {/* Precio */}
          <div className="mb-8">
            <div className="text-5xl font-serif font-bold text-wine-700 mb-1">
              ${product.price.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              {product.currency} · Precio de referencia
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 mb-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-shine flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                isAvailable
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span></span>
              {isAvailable ? 'Consultar por WhatsApp' : 'Producto Agotado'}
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isAvailable}
              className={`btn-shine w-full py-4 rounded-xl font-bold text-lg transition border-2 ${
                isAvailable
                  ? 'border-wine-700 text-wine-700 hover:bg-wine-50'
                  : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✉️ Contactar Vendedor
            </button>

            <p className="text-center text-sm text-gray-500">
              {isAvailable ? '✅ Disponible en tienda física' : '❌ Temporalmente agotado'}
            </p>
          </div>

          {/* Especificaciones rápidas */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Presentación</p>
              <p className="font-semibold text-gray-900">{product.presentation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Grado Alcohólico</p>
              <p className="font-semibold text-gray-900">{product.alcoholicDegree}% vol.</p>
            </div>
            {product.country && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">País</p>
                <p className="font-semibold text-gray-900">{product.country}</p>
              </div>
            )}
            {product.vintage && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Añada</p>
                <p className="font-semibold text-gray-900">{product.vintage}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ============================================
          TABS DE INFORMACIÓN DETALLADA
          ============================================ */}
      <div className="mb-20">
        <div className="border-b border-cream-200 mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-wine-700 text-wine-700'
                    : 'border-transparent text-gray-500 hover:text-wine-700'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-premium border border-cream-200 min-h-[200px]"
          >
            {/* Tab: Descripción */}
            {activeTab === 'descripcion' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg drop-cap">
                  {product.description || 'Descripción no disponible para este producto.'}
                </p>
              </div>
            )}

            {/* Tab: Notas de Cata */}
            {activeTab === 'notas' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">
                  Notas de Cata
                </h3>
                {product.tastingNotes && product.tastingNotes.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {product.tastingNotes.map((note: string, index: number) => (
                      <span
                        key={index}
                        className="px-5 py-2 bg-wine-50 text-wine-700 rounded-full text-sm font-medium border border-wine-100 hover:scale-105 transition-transform cursor-default"
                      >
                        {NOTE_ICONS[note.toLowerCase()] || '•'} {note}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Notas de cata no disponibles.</p>
                )}
              </div>
            )}

            {/* Tab: Maridaje */}
            {activeTab === 'maridaje' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">
                  Maridaje Sugerido
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg drop-cap">
                  {product.pairing || 'Información de maridaje no disponible.'}
                </p>
              </div>
            )}

            {/* Tab: Ficha Técnica */}
            {activeTab === 'ficha' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-6">
                  Ficha Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Nombre', value: product.name },
                    { label: 'Marca / Bodega', value: product.brand },
                    { label: 'Categoría', value: product.category },
                    { label: 'Cepa', value: product.grape || 'No especificada' },
                    { label: 'Añada', value: product.vintage?.toString() || 'No especificada' },
                    { label: 'País de Origen', value: product.country || 'No especificado' },
                    { label: 'Región', value: product.region || 'No especificada' },
                    { label: 'Presentación', value: product.presentation },
                    { label: 'Grado Alcohólico', value: `${product.alcoholicDegree}% vol.` },
                    { label: 'Puntaje', value: product.score ? `${product.score}/100` : 'No puntuado' },
                  ].map((item, i) => (
                    <div key={i} className="border-b border-cream-200 pb-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================
          PRODUCTOS RELACIONADOS
          ============================================ */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-cream-200 pt-16">
          <h2 className="font-serif text-4xl font-bold text-wine-900 mb-4 text-center">
            Productos Relacionados
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <article className="bg-white rounded-xl shadow-float transition-all overflow-hidden border border-cream-200">
                  <div className="h-48 overflow-hidden bg-cream-100">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                    <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-wine-700 transition">
                      {p.name}
                    </h3>
                    <p className="text-lg font-bold text-wine-700">
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ============================================
          LIGHTBOX (Vista ampliada de imagen)
          ============================================ */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navegación en lightbox */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            {/* Imagen ampliada */}
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de contacto por email */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        productPrice={product.price}
        currency={product.currency}
      />
    </div>
  );
}