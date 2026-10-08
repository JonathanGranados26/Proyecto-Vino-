'use client';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    description?: string;
    price: number;
    currency: string;
    stock: number;
    grape?: string;
    vintage?: number;
    score?: number;
    country?: string;
    region?: string;
    presentation: string;
    alcoholicDegree: number;
    pairing?: string;
    tastingNotes?: string[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const handleAddToCart = () => {
    // Placeholder para Fase 2 (Carrito)
    alert('Carrito de compras en desarrollo (Fase 2)');
  };

  return (
    <div className="flex flex-col">
      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1 bg-wine-50 text-wine-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {product.category}
        </span>
        {product.score && (
          <span className="ml-2 inline-block px-4 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold">
            ⭐ {product.score}/100
          </span>
        )}
      </div>
      
      {/* Title & Brand */}
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
        {product.name}
      </h1>
      
      <p className="text-xl text-gray-500 mb-6">{product.brand}</p>

      {/* Price */}
      <div className="text-4xl font-bold text-wine-700 mb-8">
        ${product.price.toLocaleString()} <span className="text-lg text-gray-500 font-normal">{product.currency}</span>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          {product.description}
        </p>
      )}

      {/* Tasting Notes */}
      {product.tastingNotes && product.tastingNotes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Notas de Cata
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.tastingNotes.map((note: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-wine-50 hover:text-wine-700 transition"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
        {product.grape && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cepa</p>
            <p className="font-semibold text-gray-900">{product.grape}</p>
          </div>
        )}
        {product.vintage && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Añada</p>
            <p className="font-semibold text-gray-900">{product.vintage}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Presentación</p>
          <p className="font-semibold text-gray-900">{product.presentation}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Grado Alcohólico</p>
          <p className="font-semibold text-gray-900">{product.alcoholicDegree}% vol.</p>
        </div>
        {product.country && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">País</p>
            <p className="font-semibold text-gray-900">{product.country}</p>
          </div>
        )}
        {product.region && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Región</p>
            <p className="font-semibold text-gray-900">{product.region}</p>
          </div>
        )}
        {product.pairing && (
          <div className="col-span-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Maridaje</p>
            <p className="font-semibold text-gray-900">{product.pairing}</p>
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
            product.stock > 0
              ? 'bg-wine-700 text-white hover:bg-wine-800 hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? ' Agregar al Carrito' : 'Producto Agotado'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">
          {product.stock > 0 ? `✅ ${product.stock} unidades disponibles` : '❌ Sin stock'}
        </p>
      </div>
    </div>
  );
}