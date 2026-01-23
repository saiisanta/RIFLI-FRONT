import React, { useEffect, useState } from "react";
import useProducts from "../../../../hooks/useProducts";
import useCategories from "../../../../hooks/useCategories";
import useBrands from "../../../../hooks/useBrands";
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
    clearError,
  } = useProducts();

  const { categories, fetchCategories } = useCategories();
  const { brands, fetchBrands } = useBrands();

  const [form, setForm] = useState({
    name: "",
    short_description: "",
    long_description: "",
    price: "",
    category_id: "",
    brand_id: "",
    stock: "",
    min_stock: "5",
    discount_percentage: "0",
    sku: "",
    specifications: "",
    main_image: null,
  });
  const [editId, setEditId] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vistaGrid, setVistaGrid] = useState(false);
  const [formOpen, setFormOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  const productosFiltrados = products.filter((p) => {
    const category = p.Category || p.category;
    const brand = p.Brand || p.brand;

    return (
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const resetForm = () => {
    setForm({
      name: "",
      short_description: "",
      long_description: "",
      price: "",
      category_id: "",
      brand_id: "",
      stock: "",
      min_stock: "5",
      discount_percentage: "0",
      sku: "",
      specifications: "",
      main_image: null,
    });
    setEditId(null);
    setCurrentProduct(null);
    clearError();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (customEvent) => {
    customEvent.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category_id", form.category_id);
    formData.append("brand_id", form.brand_id);
    formData.append("stock", form.stock);
    formData.append("min_stock", form.min_stock || "5");
    formData.append("discount_percentage", form.discount_percentage || "0");

    if (form.sku) formData.append("sku", form.sku);
    if (form.short_description)
      formData.append("short_description", form.short_description);
    if (form.long_description)
      formData.append("long_description", form.long_description);

    if (customEvent.specifications) {
      formData.append("specifications", customEvent.specifications);
    }

    if (customEvent.images && customEvent.images.length > 0) {
      customEvent.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    if (customEvent.remove_images && customEvent.remove_images.length > 0) {
      formData.append("remove_images", JSON.stringify(customEvent.remove_images));
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
    const category = p.Category || p.category;
    const brand = p.Brand || p.brand;

    setEditId(p.id);
    setCurrentProduct(p);
    setForm({
      name: p.name || "",
      short_description: p.short_description || "",
      long_description: p.long_description || "",
      price: p.price || "",
      category_id: category?.id || p.category_id || "",
      brand_id: brand?.id || p.brand_id || "",
      stock: p.stock || "",
      min_stock: p.min_stock || "5",
      discount_percentage: p.discount_percentage || "0",
      sku: p.sku || "",
      specifications: p.specifications ? JSON.stringify(p.specifications) : "",
      main_image: null,
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  const currentItems = productosFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
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
        currentProduct={currentProduct}
        formOpen={formOpen}
        errorMsg={error}
        loading={loading}
        categories={categories}
        brands={brands}
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