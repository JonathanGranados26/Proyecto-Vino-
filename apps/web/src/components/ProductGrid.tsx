'use client';

import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Award } from 'lucide-react';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      slug
      brand
      category
      price
      imageUrl
      stock
      score
      tastingNotes
    }
  }
`;

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  score?: number;
  tastingNotes?: string[];
}

// Skeleton loader premium
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream-200 animate-pulse">
      <div className="h-72 bg-cream-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-cream-200 rounded w-1/3" />
        <div className="h-5 bg-cream-200 rounded w-3/4" />
        <div className="h-5 bg-cream-200 rounded w-1/2" />
        <div className="flex justify-between pt-4 border-t border-cream-200">
          <div className="h-6 bg-cream-200 rounded w-1/4" />
          <div className="h-6 bg-cream-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// Mapeo de notas de cata a iconos
const NOTE_ICONS: Record<string, string> = {
  'vainilla': '', 'roble': '', 'frutas rojas': '', 'frutas negras': '',
  'cítricos': '', 'floral': '🌸', 'especias': '🌶️', 'chocolate': '🍫',
  'café': '☕', 'caramelo': '🍯', 'miel': '', 'tabaco': '🍂',
  'cuero': '👜', 'ahumado': '💨', 'herbal': '🌿', 'mineral': '💎',
};

export function ProductGrid() {
  const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const categories = useMemo(() => {
    if (!data?.products) return [];
    return [...new Set(data.products.map((p) => p.category))].sort();
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let filtered = data.products.filter((p) => {
      const matchesSearch = search === '' || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [data, search, categoryFilter, sortBy]);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de búsqueda y filtros - Glassmorphism */}
      <div className="glass rounded-2xl p-6 mb-12 shadow-float">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-wine-500 focus:border-transparent transition"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-wine-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-wine-700">{loading ? '...' : filteredProducts.length}</span> productos encontrados
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-cream-50/50 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-wine-500"
          >
            <option value="name">Ordenar: Nombre A-Z</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500">No se encontraron productos</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="mt-4 text-wine-700 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            filteredProducts.map((product, index) => {
              const isRecommended = (product.score && product.score >= 90) || product.stock < 5;
              const topNotes = product.tastingNotes?.slice(0, 3) || [];

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <article className="shadow-float group bg-white rounded-2xl overflow-hidden border border-cream-200 h-full flex flex-col">
                      {/* Imagen */}
                      <div className="relative h-72 overflow-hidden bg-cream-100">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            Sin imagen
                          </div>
                        )}
                        
                        {/* Overlay con notas de cata */}
                        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/90 via-wine-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <div className="text-white">
                            <p className="text-xs uppercase tracking-wider text-gold-300 mb-2">{product.category}</p>
                            {topNotes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {topNotes.map((note, i) => (
                                  <span key={i} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                    {NOTE_ICONS[note.toLowerCase()] || '•'} {note}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge de categoría */}
                        <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold text-wine-700 uppercase tracking-wide">
                          {product.category}
                        </div>

                        {/* Badge de puntaje */}
                        {product.score && (
                          <div className="absolute top-4 right-4 bg-gold-500 text-wine-950 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ {product.score}
                          </div>
                        )}

                        {/* Badge Sommelier */}
                        {isRecommended && (
                          <div className="absolute bottom-4 left-4 right-4 glass-dark px-3 py-2 rounded-lg flex items-center gap-2 text-white text-xs">
                            <Award className="w-4 h-4 text-gold-400" />
                            <span className="font-medium">Recomendado por el Sommelier</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-sm text-gray-500 font-medium mb-1">{product.brand}</p>
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-wine-700 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 border-t border-cream-200 flex items-center justify-between">
                          <span className="text-2xl font-bold text-wine-700">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            product.stock > 0 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {product.stock > 0 ? '✓ Disponible' : 'Agotado'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}