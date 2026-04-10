import React, { useState, useEffect } from 'react';
import useBrands from '../../../../hooks/useBrands';
import useApiError from '../../../../hooks/useApiError';
import RateLimitToast from '../../../../components/RateLimitToast/RateLimitToast';
import BrandHeader from './components/BrandHeader/BrandHeader';
import BrandForm from './components/BrandForm/BrandForm';
import BrandTable from './components/BrandTable/BrandTable';
import BrandGrid from './components/BrandGrid/BrandGrid';
import Pagination from '../../components/Pagination/Pagination';
import './BrandManager.scss';

const BrandManager = () => {
  const { brands, loading, error, createBrand, updateBrand, deleteBrand, clearError } = useBrands();

  const { generalError, rateLimitError, handleApiError, clearApiError, clearRateLimitError } = useApiError();

  const [form, setForm]               = useState({ name: '', logo_url: null });
  const [editId, setEditId]           = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [vistaGrid, setVistaGrid]     = useState(false);
  const [formOpen, setFormOpen]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const itemsPerPage = 10;

  const marcasFiltradas = brands.filter((b) =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }; }, []);

  const resetForm = () => { setForm({ name: '', logo_url: null }); setEditId(null); if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); } clearError(); clearApiError(); };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo_url' && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, logo_url: file }));
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
    if (form.logo_url) formData.append('logo_url', form.logo_url);
    try {
      if (editId) { await updateBrand(editId, formData); } else { await createBrand(formData); }
      resetForm();
    } catch (err) { handleApiError(err); }
  };

  const handleEdit = (b) => { setEditId(b.id); setForm({ name: b.name || '', logo_url: null }); setImagePreview(b.logo_url ? `http://localhost:4001${b.logo_url}` : null); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar marca?')) return;
    clearApiError();
    try { await deleteBrand(id); }
    catch (err) { handleApiError(err); }
  };

  const handleRemoveImage = () => { setForm((prev) => ({ ...prev, logo_url: null })); if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); } };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = marcasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(marcasFiltradas.length / itemsPerPage);

  if (loading && brands.length === 0) { return (<div className="brand-manager-loading"><div className="spinner"></div><p>Cargando marcas...</p></div>); }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />
      <div className="brand-manager">
        <BrandHeader totalBrands={marcasFiltradas.length} searchTerm={searchTerm} onSearchChange={setSearchTerm} vistaGrid={vistaGrid} onViewChange={setVistaGrid} />
        <BrandForm form={form} editId={editId} formOpen={formOpen} errorMsg={generalError || error} loading={loading} imagePreview={imagePreview} onFormChange={handleChange} onSubmit={handleSubmit} onCancel={resetForm} onRemoveImage={handleRemoveImage} onToggleForm={() => setFormOpen(!formOpen)} onErrorClose={() => { clearError(); clearApiError(); }} />
        <section className="brands-section">
          <div className="section-header"><h2>Marcas registradas</h2></div>
          {vistaGrid ? <BrandGrid marcas={currentItems} onEdit={handleEdit} onDelete={handleDelete} /> : <BrandTable marcas={currentItems} onEdit={handleEdit} onDelete={handleDelete} />}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </section>
      </div>
    </>
  );
};

export default BrandManager;