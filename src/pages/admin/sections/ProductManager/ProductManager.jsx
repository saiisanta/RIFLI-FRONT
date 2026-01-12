import React, { useEffect, useState } from "react";
import useProducts from "../../../../hooks/useProducts";
import ProductHeader from "./components/ProductHeader/ProductHeader";
import ProductForm from "./components/ProductForm/ProductForm";
import ProductsTable from "./components/ProductsTable/ProductsTable";
import ProductsGrid from "./components/ProductsGrid/ProductsGrid";
import Pagination from "../../components/Pagination/Pagination";
import "./ProductManager.scss";

const ProductManager = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError
  } = useProducts();

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
  const [searchTerm, setSearchTerm] = useState("");
  const [vistaGrid, setVistaGrid] = useState(false);
  const [formOpen, setFormOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productosFiltrados = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    clearError();
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
      if (editId) {
        await updateProduct(editId, formData);
      } else {
        await createProduct(formData);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar producto:", err);
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
      await deleteProduct(id);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  if (loading && products.length === 0) {
    return (
      <div className="product-manager-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-manager">
      <ProductHeader
        totalProducts={productosFiltrados.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        vistaGrid={vistaGrid}
        onViewChange={setVistaGrid}
      />

      <ProductForm
        form={form}
        editId={editId}
        formOpen={formOpen}
        errorMsg={error}
        loading={loading}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        onToggleForm={() => setFormOpen(!formOpen)}
        onErrorClose={clearError}
      />

      <section className="products-section">
        <div className="section-header">
          <h2>Productos registrados</h2>
        </div>

        {vistaGrid ? (
          <ProductsGrid
            productos={currentItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ProductsTable
            productos={currentItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </div>
  );
};

export default ProductManager;