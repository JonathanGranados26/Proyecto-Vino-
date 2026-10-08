'use client';

import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from './ContactModal';
import { Info, Wine, MapPin, Award } from 'lucide-react';

const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id name slug brand category description presentation
      alcoholicDegree price currency stock country region grape
      vintage score pairing imageUrl tastingNotes
    }
  }
`;

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($category: String!, $excludeId: ID!) {
    relatedProducts(category: $category, excludeId: $excludeId, limit: 4) {
      id name slug brand price imageUrl
    }
  }
`;

type TabKey = 'descripcion' | 'notas' | 'maridaje' | 'ficha';

export default function ProductDetail() {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('descripcion');

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-wine-200 border-t-wine-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data?.productBySlug) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
        <Link href="/" className="px-6 py-3 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const product = data.productBySlug;
  const relatedProducts = relatedData?.relatedProducts || [];
  const isAvailable = product.stock > 0;

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Me interesa el producto: ${product.name}\nPrecio de referencia: $${product.price.toLocaleString()} ${product.currency}\n¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/50370087508?text=${whatsappMessage}`;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'descripcion', label: 'Descripción', icon: <Info className="w-4 h-4" /> },
    { key: 'notas', label: 'Notas de Cata', icon: <Wine className="w-4 h-4" /> },
    { key: 'maridaje', label: 'Maridaje', icon: <Award className="w-4 h-4" /> },
    { key: 'ficha', label: 'Ficha Técnica', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-wine-700 transition">Inicio</Link>
        <span>/</span>
        <span className="hover:text-wine-700 transition">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-cream-100 rounded-2xl overflow-hidden shadow-premium border border-cream-200"
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-[500px] lg:h-[650px] object-cover" />
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center text-gray-400 text-lg">
              Sin imagen disponible
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-wine-50 text-wine-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
            {product.score && (
              <span className="ml-2 inline-block px-4 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-bold">
                 {product.score}/100
              </span>
            )}
          </div>

          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h1>
          <p className="text-xl text-gray-500 mb-6 italic">{product.brand}</p>

          <div className="mb-8">
            <div className="text-5xl font-serif font-bold text-wine-700 mb-1">
              ${product.price.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              {product.currency} · Precio de referencia
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                isAvailable 
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>💬</span>
              {isAvailable ? 'Consultar por WhatsApp' : 'Producto Agotado'}
            </a>
            
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isAvailable}
              className={`w-full py-4 rounded-xl font-bold text-lg transition border-2 ${
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

          {/* Quick Specs */}
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

      {/* Tabs Section */}
      <div className="mb-20">
        <div className="border-b border-cream-200 mb-8">
          <div className="flex gap-2 overflow-x-auto">
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
                {tab.icon}
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
            {activeTab === 'descripcion' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">Descripción</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description || 'Descripción no disponible para este producto.'}
                </p>
              </div>
            )}

            {activeTab === 'notas' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">Notas de Cata</h3>
                {product.tastingNotes && product.tastingNotes.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {product.tastingNotes.map((note: string, index: number) => (
                      <span
                        key={index}
                        className="px-5 py-2 bg-wine-50 text-wine-700 rounded-full text-sm font-medium border border-wine-100"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Notas de cata no disponibles.</p>
                )}
              </div>
            )}

            {activeTab === 'maridaje' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-4">Maridaje Sugerido</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.pairing || 'Información de maridaje no disponible.'}
                </p>
              </div>
            )}

            {activeTab === 'ficha' && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-wine-900 mb-6">Ficha Técnica</h3>
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
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-cream-200 pt-16">
          <h2 className="font-serif text-4xl font-bold text-wine-900 mb-4 text-center">
            Productos Relacionados
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <article className="bg-white rounded-xl shadow-premium hover:shadow-premium-hover transition-all overflow-hidden border border-cream-200">
                  <div className="h-48 overflow-hidden bg-cream-100">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                    <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-wine-700 transition">
                      {p.name}
                    </h3>
                    <p className="text-lg font-bold text-wine-700">${p.price.toLocaleString()}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

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