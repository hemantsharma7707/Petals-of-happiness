import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/services';
import { ChevronLeft, Save, Plus, X, Upload } from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Crochet Flowers', 'Crochet Bouquets', 'Crochet Keychains',
  'Crochet Bags', 'Crochet Dolls', 'Custom Crochet', 'Gifts',
];

const emptyForm = {
  name: '', description: '', price: '', salePrice: '', category: 'Crochet Flowers',
  stock: '', customizationAvailable: false, featured: false, bestSeller: false, active: true,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      productService
        .getById(id)
        .then((res) => {
          const p = res.data.product;
          setForm({
            name: p.name, description: p.description, price: p.price,
            salePrice: p.salePrice || '', category: p.category, stock: p.stock,
            customizationAvailable: p.customizationAvailable, featured: p.featured,
            bestSeller: p.bestSeller, active: p.active,
          });
          setVariants(p.variants || []);
          setExistingImages(p.images || []);
        })
        .catch(() => { toast.error('Product not found'); navigate('/admin/products'); })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const update = (key, val) => setForm({ ...form, [key]: val });

  const addVariant = () => setVariants([...variants, { name: '', options: [''] }]);
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariantName = (i, name) => {
    const v = [...variants]; v[i].name = name; setVariants(v);
  };
  const addOption = (i) => {
    const v = [...variants]; v[i].options.push(''); setVariants(v);
  };
  const removeOption = (vi, oi) => {
    const v = [...variants]; v[vi].options = v[vi].options.filter((_, idx) => idx !== oi); setVariants(v);
  };
  const updateOption = (vi, oi, val) => {
    const v = [...variants]; v[vi].options[oi] = val; setVariants(v);
  };

  const removeExistingImage = (i) => setExistingImages(existingImages.filter((_, idx) => idx !== i));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (i) => setNewImages(newImages.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      return toast.error('Please fill all required fields');
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      if (form.salePrice) formData.append('salePrice', form.salePrice);
      formData.append('category', form.category);
      formData.append('stock', form.stock || 0);
      formData.append('customizationAvailable', form.customizationAvailable);
      formData.append('featured', form.featured);
      formData.append('bestSeller', form.bestSeller);
      formData.append('active', form.active);

      // Filter out empty variants/options
      const cleanVariants = variants
        .filter((v) => v.name.trim())
        .map((v) => ({ name: v.name, options: v.options.filter((o) => o.trim()) }));
      formData.append('variants', JSON.stringify(cleanVariants));

      if (isEdit) formData.append('existingImages', JSON.stringify(existingImages));

      newImages.forEach((file) => formData.append('images', file));

      if (isEdit) {
        await productService.update(id, formData);
        toast.success('Product updated! 🌸');
      } else {
        await productService.create(formData);
        toast.success('Product created! 🌸');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="skeleton h-8 w-48" />
        <div className="card p-6 space-y-4">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-20 w-full" />
          <div className="skeleton h-10 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="p-2 rounded-lg hover:bg-cream-200 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-serif text-2xl text-dark-400">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-serif text-lg text-dark-400">Basic Information</h2>
          <div>
            <label className="label">Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input" required placeholder="e.g., Eternal Rose Bouquet" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input resize-none" rows={4} required placeholder="Describe your product..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="input" required min="0" placeholder="999" />
            </div>
            <div>
              <label className="label">Sale Price (₹)</label>
              <input type="number" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} className="input" min="0" placeholder="Optional" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="input" min="0" placeholder="10" />
            </div>
          </div>
          <div>
            <label className="label">Category *</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <h2 className="font-serif text-lg text-dark-400">Images</h2>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-cream-200 group">
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
            {newImages.map((file, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-200 group">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-cream-300 flex items-center justify-center cursor-pointer hover:border-brand-300 transition-colors">
              <Upload size={20} className="text-dark-100" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-lg text-dark-400">Variants</h2>
            <button type="button" onClick={addVariant} className="btn-ghost btn-sm text-brand-500">
              <Plus size={14} /> Add Variant
            </button>
          </div>
          {variants.map((v, vi) => (
            <div key={vi} className="p-4 bg-cream-50 rounded-xl space-y-3">
              <div className="flex gap-2 items-center">
                <input type="text" value={v.name} onChange={(e) => updateVariantName(vi, e.target.value)} placeholder="e.g., Color, Size" className="input text-sm flex-1" />
                <button type="button" onClick={() => removeVariant(vi)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-2 ml-4">
                {v.options.map((opt, oi) => (
                  <div key={oi} className="flex gap-2 items-center">
                    <input type="text" value={opt} onChange={(e) => updateOption(vi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="input text-sm flex-1" />
                    {v.options.length > 1 && (
                      <button type="button" onClick={() => removeOption(vi, oi)} className="p-1 text-red-400">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addOption(vi)} className="text-sm text-brand-500 hover:text-brand-700 font-medium">
                  + Add Option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Flags */}
        <div className="card p-6">
          <h2 className="font-serif text-lg text-dark-400 mb-4">Settings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'bestSeller', label: 'Best Seller' },
              { key: 'customizationAvailable', label: 'Customizable' },
              { key: 'active', label: 'Active' },
            ].map((flag) => (
              <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={form[flag.key]}
                  onChange={(e) => update(flag.key, e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-300"
                />
                <span className="text-sm text-dark-200">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
