'use client';

import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($category: String!, $excludeId: ID!, $limit: Int) {
    relatedProducts(category: $category, excludeId: $excludeId, limit: $limit) {
      id
      name
      slug
      brand
      price
      imageUrl
    }
  }
`;

interface RelatedProductsProps {
  category: string;
  excludeId: string;
}

export function RelatedProducts({ category, excludeId }: RelatedProductsProps) {
  const { loading, error, data } = useQuery(GET_RELATED_PRODUCTS, {
    variables: { category, excludeId, limit: 4 },
  });

  if (loading) return null;
  if (error || !data?.relatedProducts.length) return null;

  return (
    <div className="border-t border-gray-200 pt-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Productos Relacionados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.relatedProducts.map((product: any) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-48 overflow-hidden bg-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-wine-700 transition">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-wine-700">
                ${product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}