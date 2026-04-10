import React, { useState, useEffect } from 'react';
import useCategories from '../../../../hooks/useCategories';
import useApiError from '../../../../hooks/useApiError';
import RateLimitToast from '../../../../components/RateLimitToast/RateLimitToast';
import CategoryHeader from './components/CategoryHeader/CategoryHeader';
import CategoryForm from './components/CategoryForm/CategoryForm';
import CategoryTable from './components/CategoryTable/CategoryTable';
import CategoryGrid from './components/CategoryGrid/CategoryGrid';
import Pagination from '../../components/Pagination/Pagination';
import './CategoryManager.scss';

const CategoryManager = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, clearError } = useCategories();

  const { generalError, rateLimitError, handleApiError, clearApiError, clearRateLimitError } = useApiError();

  const [form, setForm]               = useState({ name: '', description: '', icon: null });
  const [editId, setEditId]           = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [vistaGrid, setVistaGrid]     = useState(false);
  const [formOpen, setFormOpen]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const itemsPerPage = 10;

  const categoriasFiltradas = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }; }, []);

  const resetForm = () => { setForm({ name: '', description: '', icon: null }); setEditId(null); if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); } clearError(); clearApiError(); };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'icon' && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, icon: file }));
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearApiError();
    const formData = new FormData();
    formData.append('name', form.name);
    if (form.description) formData.append('description', form.description);
    if (form.icon) formData.append('icon', form.icon);
    try {
      if (editId) { await updateCategory(editId, formData); } else { await createCategory(formData); }
      resetForm();
    } catch (err) { handleApiError(err); }
  };

  const handleEdit = (c) => { setEditId(c.id); setForm({ name: c.name || '', description: c.description || '', icon: null }); setImagePreview(c.icon ? `http://localhost:4001${c.icon}` : null); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar categoría?')) return;
    clearApiError();
    try { await deleteCategory(id); }
    catch (err) { handleApiError(err); }
  };

  const handleRemoveImage = () => { setForm((prev) => ({ ...prev, icon: null })); if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); } };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = categoriasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(categoriasFiltradas.length / itemsPerPage);

  if (loading && categories.length === 0) { return (<div className="category-manager-loading"><div className="spinner"></div><p>Cargando categorías...</p></div>); }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />
      <div className="category-manager">
        <CategoryHeader totalCategories={categoriasFiltradas.length} searchTerm={searchTerm} onSearchChange={setSearchTerm} vistaGrid={vistaGrid} onViewChange={setVistaGrid} />
        <CategoryForm form={form} editId={editId} formOpen={formOpen} errorMsg={generalError || error} loading={loading} imagePreview={imagePreview} onFormChange={handleChange} onSubmit={handleSubmit} onCancel={resetForm} onRemoveImage={handleRemoveImage} onToggleForm={() => setFormOpen(!formOpen)} onErrorClose={() => { clearError(); clearApiError(); }} />
        <section className="categories-section">
          <div className="section-header"><h2>Categorías registradas</h2></div>
          {vistaGrid ? <CategoryGrid categorias={currentItems} onEdit={handleEdit} onDelete={handleDelete} /> : <CategoryTable categorias={currentItems} onEdit={handleEdit} onDelete={handleDelete} />}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </section>
      </div>
    </>
  );
};

export default CategoryManager;