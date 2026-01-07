import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BoxArrowLeft, 
  Plus, 
  Pencil, 
  Trash3, 
  X,
  Search,
  Grid3x3Gap,
  ListUl,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "react-bootstrap-icons";
import "./adminPanel.scss";

const API = "http://localhost:4001/api/products";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoria: "",
    marca: "",
    stock: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vistaGrid, setVistaGrid] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formOpen, setFormOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    const filtrados = productos.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProductosFiltrados(filtrados);
    setCurrentPage(1);
  }, [searchTerm, productos]);

  const cargarProductos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      categoria: "",
      marca: "",
      stock: "",
      image: null,
    });
    setEditId(null);
    setErrorMsg("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.errors?.[0]?.msg || "Error");
      cargarProductos();
      resetForm();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...p, image: null });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      cargarProductos();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button
            className="btn-back"
            onClick={() => navigate("/")}
            title="Volver al sitio"
          >
            <BoxArrowLeft size={20} />
          </button>
          {sidebarOpen && <h2 className="logo">ADMIN</h2>}
        </div>

        {sidebarOpen && (
          <nav className="sidebar-nav">
            <ul>
              <li className="active">Productos</li>
              <li>Estadísticas</li>
              <li>Usuarios</li>
              <li>Servicios</li>
            </ul>
          </nav>
        )}

        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Panel de Productos</h1>
            <p className="subtitle">{productosFiltrados.length} productos en total</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="view-toggle">
              <button 
                className={!vistaGrid ? 'active' : ''}
                onClick={() => setVistaGrid(false)}
                title="Vista de lista"
              >
                <ListUl size={18} />
              </button>
              <button 
                className={vistaGrid ? 'active' : ''}
                onClick={() => setVistaGrid(true)}
                title="Vista de cuadrícula"
              >
                <Grid3x3Gap size={18} />
              </button>
            </div>
          </div>
        </header>

        <section className={`form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
          <div className="section-header">
            <h2>
              <Plus size={24} />
              {editId ? "Editar producto" : "Agregar nuevo producto"}
            </h2>
            <div className="header-buttons">
              {editId && (
                <button className="btn-cancel" onClick={resetForm}>
                  <X size={20} />
                  Cancelar
                </button>
              )}
              <button 
                className="btn-toggle-form"
                onClick={() => setFormOpen(!formOpen)}
                title={formOpen ? "Ocultar formulario" : "Mostrar formulario"}
              >
                {formOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          <div className="form-content">
            {errorMsg && (
              <div className="alert alert-error">
                {errorMsg}
                <button onClick={() => setErrorMsg("")}><X size={16} /></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del producto</label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Ej: Laptop HP"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Marca</label>
                  <input 
                    name="marca" 
                    value={form.marca} 
                    onChange={handleChange}
                    placeholder="Ej: HP" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  placeholder="Describe las características del producto..."
                  rows="4"
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (ARS)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <input 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={handleChange}
                    placeholder="Ej: Electrónica"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Stock disponible</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={form.stock} 
                    onChange={handleChange}
                    placeholder="0"
                    required 
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Imagen del producto</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleChange}
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="file-input-label">
                    {form.image ? form.image.name : "Seleccionar imagen..."}
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                <Plus size={20} />
                {editId ? "Guardar cambios" : "Agregar producto"}
              </button>
            </form>
          </div>
        </section>

        <section className="products-section">
          <div className="section-header">
            <h2>Productos registrados</h2>
          </div>

          {vistaGrid ? (
            <div className="products-grid">
              {currentItems.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-card-header">
                    <span className="product-badge">{p.categoria}</span>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="btn-icon btn-edit"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="btn-icon btn-delete"
                        title="Eliminar"
                      >
                        <Trash3 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="product-card-body">
                    <h3>{p.name}</h3>
                    <p className="product-marca">{p.marca}</p>
                    <div className="product-card-footer">
                      <span className="product-price">${p.price}</span>
                      <span className="product-stock">Stock: {p.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((p) => (
                    <tr key={p.id}>
                      <td className="product-name">{p.name}</td>
                      <td>{p.marca}</td>
                      <td className="product-price">${p.price}</td>
                      <td>
                        <span className="badge">{p.categoria}</span>
                      </td>
                      <td>
                        <span className={`stock-badge ${p.stock < 10 ? 'low' : ''}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEdit(p)}
                            className="btn-icon btn-edit"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="btn-icon btn-delete"
                            title="Eliminar"
                          >
                            <Trash3 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="pagination-info">
                Página {currentPage} de {totalPages}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}