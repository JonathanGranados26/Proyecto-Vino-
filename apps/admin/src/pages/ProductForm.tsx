import { useState, useRef } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

// 👇 URL de la API (cambiar según entorno)
const API_URL = import.meta.env.VITE_API_REST_URL || 'http://localhost:4000';

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) { id name }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) { id name }
  }
`;

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id name brand category description presentation alcoholicDegree
      price currency stock country region imageUrl images tastingNotes
    }
  }
`;

const CATEGORIES = ['WHISKY', 'RON', 'TEQUILA', 'VINO', 'VODKA', 'GIN', 'LICOR', 'CERVEZA'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', brand: '', category: 'WHISKY', description: '', presentation: '',
    alcoholicDegree: 0, price: 0, currency: 'MXN', stock: 0, country: '',
    region: '', imageUrl: '', images: [] as string[], tastingNotes: '',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { data } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !isEdit,
    onCompleted: (data) => {
      const p = data.product;
      setForm({
        name: p.name || '', brand: p.brand || '', category: p.category || 'WHISKY',
        description: p.description || '', presentation: p.presentation || '',
        alcoholicDegree: p.alcoholicDegree || 0, price: p.price || 0,
        currency: p.currency || 'MXN', stock: p.stock || 0, country: p.country || '',
        region: p.region || '', imageUrl: p.imageUrl || '',
        images: p.images || [],
        tastingNotes: p.tastingNotes?.join(', ') || '',
      });
    },
  });

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => { alert('✅ Producto creado'); navigate('/products'); },
    onError: (err) => alert('Error: ' + err.message),
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => { alert('✅ Producto actualizado'); navigate('/products'); },
    onError: (err) => alert('Error: ' + err.message),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setUploading(true);

    const token = localStorage.getItem('admin_token');
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.match(/image\/(jpg|jpeg|png|webp|gif)/)) {
          setUploadError(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`La imagen ${file.name} supera los 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        // 👇 AQUÍ SE USA LA VARIABLE DE ENTORNO
        const response = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) throw new Error(`Error al subir ${file.name}`);

        const result = await response.json();
        newImages.push(result.url);
      }

      setForm((prev) => {
        const updatedImages = [...prev.images, ...newImages];
        const newImageUrl = prev.imageUrl || (prev.images.length === 0 && newImages.length > 0 ? newImages[0] : prev.imageUrl);

        return {
          ...prev,
          images: updatedImages,
          imageUrl: newImageUrl,
        };
      });

      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir imágenes');
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const removedUrl = prev.images[index];
      const newImages = prev.images.filter((_, i) => i !== index);

      const newImageUrl = prev.imageUrl === removedUrl
        ? (newImages.length > 0 ? newImages[0] : '')
        : prev.imageUrl;

      return {
        ...prev,
        images: newImages,
        imageUrl: newImageUrl,
      };
    });
  };

  const setAsMainImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrl: prev.images[index],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      ...form,
      alcoholicDegree: Number(form.alcoholicDegree),
      price: Number(form.price),
      stock: Number(form.stock),
      tastingNotes: form.tastingNotes.split(',').map((n) => n.trim()).filter(Boolean),
    };

    if (isEdit) {
      updateProduct({ variables: { input: { id, ...input } } });
    } else {
      createProduct({ variables: { input } });
    }
  };

  const loading = creating || updating;

  return (
    <Layout>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4 md:space-y-6">
        {/* Galería de Imágenes */}
        <div className="border-b pb-4 md:pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Galería de Imágenes</h2>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
              {form.images.map((img, index) => (
                <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 flex-wrap p-2">
                    <button
                      type="button"
                      onClick={() => setAsMainImage(index)}
                      className="px-2 py-1 bg-wine-700 text-white text-xs rounded hover:bg-wine-800"
                      title="Establecer como imagen principal"
                    >
                      Principal
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      Eliminar
                    </button>
                  </div>

                  {form.imageUrl === img && (
                    <div className="absolute top-2 left-2 bg-gold-500 text-wine-950 px-2 py-1 rounded text-xs font-bold">
                      ⭐ Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-6 md:py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-wine-500 hover:bg-wine-50 transition flex flex-col items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-4 border-wine-200 border-t-wine-700 rounded-full animate-spin" />
                <span className="text-gray-600 text-sm md:text-base">Subiendo imágenes...</span>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 font-medium text-sm md:text-base">Haz clic para subir imágenes</span>
                <span className="text-xs text-gray-500">JPG, PNG, WEBP, GIF • Máximo 5MB por imagen</span>
              </>
            )}
          </button>

          {uploadError && (
            <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm">{uploadError}</div>
          )}
        </div>

        {/* Campos del producto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <input
              required
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Presentación *</label>
            <input
              required
              placeholder="750 ml"
              value={form.presentation}
              onChange={(e) => setForm({ ...form, presentation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN) *</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input
              required
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grado alcohólico (%)</label>
            <input
              type="number"
              step="0.1"
              value={form.alcoholicDegree}
              onChange={(e) => setForm({ ...form, alcoholicDegree: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas de cata (separadas por coma)</label>
            <input
              placeholder="ahumado, vainilla, frutas secas"
              value={form.tastingNotes}
              onChange={(e) => setForm({ ...form, tastingNotes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full md:w-auto px-6 py-3 bg-wine-700 text-white rounded-lg hover:bg-wine-800 transition font-medium disabled:opacity-50 text-base"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-base"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}