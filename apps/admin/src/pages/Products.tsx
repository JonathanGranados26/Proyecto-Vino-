import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ImportExportModal from '../components/ImportExportModal';
import { Plus, Upload, Search } from 'lucide-react';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      slug
      brand
      category
      price
      stock
      imageUrl
      isActive
      createdAt
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

export default function Products() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      alert('✅ Producto eliminado');
      refetch();
    },
    onError: (err) => alert('Error: ' + err.message),
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      deleteProduct({ variables: { id } });
    }
  };

  const products = data?.products || [];

  const filtered = products.filter((p: any) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'active' && p.isActive) ||
      (statusFilter === 'inactive' && !p.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(products.map((p: any) => p.category))].sort();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-wine-200 border-t-wine-700 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error al cargar productos</h2>
          <p className="text-red-600">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Gestiona el catálogo de productos</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              Importador/Exportador
            </button>
            <Link
              to="/products/new"
              className="px-4 py-2 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition font-medium flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Nuevo Producto
            </Link>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Producto
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Precio
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Existencias
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No se encontraron productos</p>
                        <p className="text-sm mt-1">
                          {search || categoryFilter || statusFilter
                            ? 'Intenta ajustar los filtros'
                            : 'Crea tu primer producto'}
                        </p>
                        {!search && !categoryFilter && !statusFilter && (
                          <Link
                            to="/products/new"
                            className="mt-4 px-4 py-2 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition"
                          >
                            Crear Producto
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Sin img
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm md:text-base">{product.name}</div>
                            <div className="text-xs md:text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span className="px-2 py-1 bg-wine-100 text-wine-700 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 font-medium text-gray-900 text-sm md:text-base">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm md:text-base">
                        <span
                          className={
                            product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'
                          }
                        >
                          {product.stock}
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="ml-1 text-xs">⚠️</span>
                          )}
                          {product.stock === 0 && <span className="ml-1 text-xs">❌</span>}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            product.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${product.id}/edit`}
                            className="px-3 py-1 text-wine-600 hover:text-wine-800 hover:bg-wine-50 rounded transition text-sm font-medium"
                          >
                            Editor
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer con contador */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-gray-600">
        <div>
          Mostrando <strong>{filtered.length}</strong> de{' '}
          <strong>{products.length}</strong> productos
        </div>
        {(search || categoryFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="text-wine-700 hover:text-wine-800 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Modal de Importar/Exportar */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </Layout>
  );
}