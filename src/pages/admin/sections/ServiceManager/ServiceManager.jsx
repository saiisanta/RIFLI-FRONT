import React, { useState, useEffect } from 'react';
import useServices from '../../../../hooks/useServices';
import useApiError from '../../../../hooks/useApiError';
import RateLimitToast from '../../../../components/RateLimitToast/RateLimitToast';
import ServicesHeader from './components/ServicesHeader/ServicesHeader';
import ServicesForm from './components/ServicesForm/ServicesForm';
import ServicesTable from './components/ServicesTable/ServicesTable';
import ServicesGrid from './components/ServicesGrid/ServicesGrid';
import Pagination from '../../components/Pagination/Pagination';
import './ServiceManager.scss';

const ServiceManager = () => {
  const { services, loading, error, createService, updateService, deleteService, clearError } = useServices();

  const { generalError, rateLimitError, handleApiError, clearApiError, clearRateLimitError } = useApiError();

  const [form, setForm]               = useState({ type: '', short_description: '', long_description: '' });
  const [editId, setEditId]           = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [vistaGrid, setVistaGrid]     = useState(false);
  const [formOpen, setFormOpen]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const serviciosFiltrados = services.filter((s) =>
    s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.long_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const resetForm = () => { setForm({ type: '', short_description: '', long_description: '' }); setEditId(null); setCurrentService(null); clearError(); clearApiError(); };
  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleSubmit = async (customEvent) => {
    customEvent.preventDefault();
    clearApiError();
    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('short_description', form.short_description);
    formData.append('long_description', form.long_description);
    if (customEvent.icon)         formData.append('icon', customEvent.icon);
    if (customEvent.remove_icon)  formData.append('remove_icon', 'true');
    if (customEvent.features)     formData.append('features', JSON.stringify(customEvent.features));
    if (customEvent.form_schema)  formData.append('form_schema', JSON.stringify(customEvent.form_schema));
    if (customEvent.images?.length > 0) customEvent.images.forEach((image) => formData.append('images', image));
    if (customEvent.remove_images?.length > 0) formData.append('remove_images', JSON.stringify(customEvent.remove_images));
    try {
      if (editId) { await updateService(editId, formData); } else { await createService(formData); }
      resetForm();
    } catch (err) { handleApiError(err); }
  };

  const handleEdit = (s) => { setEditId(s.id); setCurrentService(s); setForm({ type: s.type || '', short_description: s.short_description || '', long_description: s.long_description || '' }); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar servicio?')) return;
    clearApiError();
    try { await deleteService(id); }
    catch (err) { handleApiError(err); }
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = serviciosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(serviciosFiltrados.length / itemsPerPage);

  if (loading && services.length === 0) { return (<div className="service-manager-loading"><div className="spinner"></div><p>Cargando servicios...</p></div>); }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />
      <div className="service-manager">
        <ServicesHeader totalServices={serviciosFiltrados.length} searchTerm={searchTerm} onSearchChange={setSearchTerm} vistaGrid={vistaGrid} onViewChange={setVistaGrid} />
        <ServicesForm form={form} editId={editId} currentService={currentService} formOpen={formOpen} errorMsg={generalError || error} loading={loading} onFormChange={handleChange} onSubmit={handleSubmit} onCancel={resetForm} onToggleForm={() => setFormOpen(!formOpen)} onErrorClose={() => { clearError(); clearApiError(); }} />
        <section className="services-section">
          <div className="section-header"><h2>Servicios registrados</h2></div>
          {vistaGrid ? <ServicesGrid servicios={currentItems} onEdit={handleEdit} onDelete={handleDelete} /> : <ServicesTable servicios={currentItems} onEdit={handleEdit} onDelete={handleDelete} />}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </section>
      </div>
    </>
  );
};

export default ServiceManager;