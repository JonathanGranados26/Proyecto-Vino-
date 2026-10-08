'use client';

import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

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
}

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

    // Ordenamiento
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [data, search, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-12 h-12 border-4 border-wine-200 border-t-wine-700 rounded-full animate-spin" />
        <p className="text-xl text-gray-600 mt-4">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-2xl shadow-premium p-6 mb-12 border border-cream-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-wine-500 focus:border-transparent transition"
            />
          </div>

          {/* Filtro de categoría */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl focus:ring-2 focus:ring-wine-500 focus:border-transparent transition appearance-none cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ordenamiento y contador */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-wine-700">{filteredProducts.length}</span> productos encontrados
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:ring-2 focus:ring-wine-500"
          >
            <option value="name">Ordenar: Nombre A-Z</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
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
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link href={`/products/${product.slug}`}>
                <article className="group bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-hover transition-all duration-500 border border-cream-200 h-full flex flex-col">
                  {/* Imagen con zoom */}
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
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="text-white">
                        <p className="text-xs uppercase tracking-wider text-gold-300 mb-1">{product.category}</p>
                        <p className="text-sm">{product.brand}</p>
                      </div>
                    </div>

                    {/* Badge de categoría */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-wine-700 uppercase tracking-wide">
                      {product.category}
                    </div>

                    {/* Badge de puntaje */}
                    {product.score && (
                      <div className="absolute top-4 right-4 bg-gold-500 text-wine-950 px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ {product.score}
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
          ))}
        </div>
      )}
    </div>
  );
}