// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { BoxArrowLeft } from "react-bootstrap-icons";
import "./adminPanel.css";

const API = "http://localhost:4001/api/products";

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
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

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data);
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
    window.scrollTo(0, 0);
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
      alert(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-top">
            <button
              className="btn-back"
              onClick={() => window.location.href = "http://localhost:5173/"}
              title="Volver al sitio"
            >
              <BoxArrowLeft size={22} className="icon" />
            </button>
            <h2 className="logo">ADMIN PANEL</h2>
          </div>

          <ul>
            <li className="active">📦 Productos</li>
            <li>📈 Estadísticas</li>
            <li>👤 Usuarios</li>
            <li>🛠 Servicios</li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <header className="dashboard-header">
            <h1>Panel de Productos</h1>
          </header>

          <section className="form-section">
            <h2>{editId ? "Editar producto" : "Agregar producto"}</h2>
            {errorMsg && <div className="error-box">{errorMsg}</div>}
            <form onSubmit={handleSubmit} className="form-grid">
              <label>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange} required />

              <label>Precio</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required />

              <label>Categoría</label>
              <input name="categoria" value={form.categoria} onChange={handleChange} required />

              <label>Marca</label>
              <input name="marca" value={form.marca} onChange={handleChange} required />

              <label>Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required />

              <label>Imagen</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />

              <div className="form-buttons">
                <button type="submit">{editId ? "Guardar" : "Agregar"}</button>
                {editId && <button type="button" onClick={resetForm} id="cancel">Cancelar</button>}
              </div>
            </form>
          </section>

          <section className="table-section">
            <h2>Productos cargados</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.marca}</td>
                    <td>${p.price}</td>
                    <td>{p.categoria}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button onClick={() => handleEdit(p)}>✏️</button>
                      <button onClick={() => handleDelete(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
