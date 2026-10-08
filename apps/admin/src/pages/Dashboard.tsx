import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      stock
      category
      isActive
    }
  }
`;

export default function Dashboard() {
  const { data, loading } = useQuery(GET_PRODUCTS);

  const products = data?.products || [];
  const active = products.filter((p: any) => p.isActive).length;
  const totalValue = products.reduce((sum: number, p: any) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p: any) => p.stock < 10).length;

  const stats = [
    { label: 'Total Productos', value: products.length, icon: '', color: 'bg-wine-100 text-wine-700' },
    { label: 'Activos', value: active, icon: '✅', color: 'bg-green-100 text-green-700' },
    { label: 'Stock Bajo', value: lowStock, icon: '⚠️', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Valor Inventario', value: `$${totalValue.toLocaleString()}`, icon: '💰', color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general del inventario</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${stat.color}`}>
                {stat.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link to="/products/new" className="block w-full px-4 py-3 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition text-center font-medium">
              ➕ Nuevo Producto
            </Link>
            <Link to="/products" className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center font-medium">
               Ver Catálogo
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Productos con Stock Bajo</h2>
          {lowStock === 0 ? (
            <p className="text-gray-500">✅ Todo el inventario está bien</p>
          ) : (
            <ul className="space-y-2">
              {products
                .filter((p: any) => p.stock < 10)
                .slice(0, 5)
                .map((p: any) => (
                  <li key={p.id} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">{p.name}</span>
                    <span className="text-red-600 font-medium text-sm">{p.stock} unid.</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}