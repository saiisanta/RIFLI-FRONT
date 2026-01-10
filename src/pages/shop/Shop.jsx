import React, { useState } from "react";
import { useProductsSimple } from "../../hooks/useProductsSimple";
import ShopHeader from "./components/ShopHeader/ShopHeader";
import CartPage from "./components/CartPage/CartPage";
import { FiRefreshCw } from "react-icons/fi";
import "./shop.scss";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "",
    marca: "",
    priceOrder: "",
    min: "",
    max: "",
  });
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const { products, loading, error, reload } = useProductsSimple();

  const filtered = products.filter((prod) => {
    let matches = true;

    if (filters.categoria && prod.categoria !== filters.categoria) matches = false;
    if (filters.marca && prod.marca !== filters.marca) matches = false;
      if (filters.min && prod.price < parseFloat(filters.min)) matches = false;
      if (filters.max && prod.price > parseFloat(filters.max)) matches = false;

    if (searchTerm.trim()) {
      const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const term = normalize(searchTerm);
      matches =
        matches &&
        (normalize(prod.name).includes(term) ||
          normalize(prod.categoria).includes(term) ||
          normalize(prod.marca).includes(term));
    }

    return matches;
  }).sort((a, b) => {
    if (filters.priceOrder === "asc") return a.price - b.price;
    if (filters.priceOrder === "desc") return b.price - a.price;
    return 0;
  });

  const handleClearFilters = () => {
    setFilters({ categoria: "", marca: "", priceOrder: "", min: "", max: "" });
    setSearchTerm("");
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const changeQuantity = (id, delta) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading)
    return (
      <div className="shop-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );

  if (error)
    return (
      <div className="shop-error">
        <p>⚠ Error: {error}</p>
        <button onClick={reload}>Reintentar</button>
      </div>
    );

  if (!products.length)
    return (
      <div className="shop-empty">
        <p>No hay productos disponibles.</p>
        <button onClick={reload}>Recargar</button>
      </div>
    );

  return (
    <div className="shop-page-wrapper">
      <div className="shop-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      <ShopHeader cartItemCount={cartItemCount} onCartClick={() => setShowCart(true)} />

      <div className="shop-wrapper">
        <aside className="shop-filters">
          <h3>Filtros</h3>

          <div className="filter-group">
            <label htmlFor="f-categoria">Categoría</label>
            <select
              id="f-categoria"
              value={filters.categoria}
              onChange={(e) =>
                setFilters({ ...filters, categoria: e.target.value })
              }
            >
              <option value="">Todas</option>
              <option value="Cámaras">Cámaras</option>
              <option value="Cables">Cables</option>
              <option value="Herramientas">Herramientas</option>
              <option value="Durlock">Durlock</option>
              <option value="DVR">DVR</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-marca">Marca</label>
            <select
              id="f-marca"
              value={filters.marca}
              onChange={(e) => setFilters({ ...filters, marca: e.target.value })}
            >
              <option value="">Todas</option>
              <option value="Hikvision">Hikvision</option>
              <option value="DSC">DSC</option>
              <option value="Imou">Imou</option>
              <option value="Dahua">Dahua</option>
              <option value="Garnet">Garnet</option>
              <option value="Bosch">Bosch</option>
              <option value="TP-Link">TP-Link</option>
              <option value="Durlock">Durlock</option>
              <option value="Stanley">Stanley</option>
              <option value="Belkin">Belkin</option>
              <option value="Black+Decker">Black+Decker</option>
              <option value="Generic">Generic</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-priceOrder">Orden de precio</label>
            <select
              id="f-priceOrder"
              value={filters.priceOrder}
              onChange={(e) =>
                setFilters({ ...filters, priceOrder: e.target.value })
              }
            >
              <option value="">---</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Rango de precio</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Mín"
                value={filters.min}
                onChange={(e) => setFilters({ ...filters, min: e.target.value })}
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.max}
                onChange={(e) => setFilters({ ...filters, max: e.target.value })}
              />
            </div>
          </div>

          <button className="btn-clear-filters" onClick={handleClearFilters}>
            Limpiar filtros
          </button>
        </aside>

        <div className="shop-container">
          <div className="shop-controls">
            <div className="results-info">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado{filtered.length !== 1 ? "s" : ""}
            </div>
            <div className="shop-controls-right">
              <input
                className="shop-search"
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn-reload" 
                onClick={reload}
                disabled={loading}
                title="Recargar productos"
              >
                <FiRefreshCw className={loading ? "spinning" : ""} />
              </button>
            </div>
          </div>

          <div className="products-grid">
            {filtered.map((prod) => (
              <div key={prod.id} className="product-card">
                <img
                  src={`http://localhost:4001${prod.imageUrl}`}
                  alt={`Foto de ${prod.name}`}
                  loading="lazy"
                  className="product-image"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.fallback) {
                      e.currentTarget.src = "/api/images/placeholder.png";
                      e.currentTarget.dataset.fallback = "true";
                    }
                  }}
                />
                <div className="product-info">
                  <h3 className="product-title">{prod.name}</h3>
                  <p className="product-category">{prod.categoria}</p>
                  <p className="product-brand">{prod.marca}</p>
                  <p className="product-price">${prod.price}</p>
                </div>
                <div className="product-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setModalProduct(prod)}
                  >
                    Detalles
                  </button>
                  <button className="btn-primary" onClick={() => addToCart(prod)}>
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setModalProduct(null)}
            >
              &times;
            </button>
            <div className="modal-body">
              <img
                src={`http://localhost:4001${modalProduct.imageUrl}`}
                alt={modalProduct.name}
                className="modal-image"
              />
              <div className="modal-info">
                <h2>{modalProduct.name}</h2>
                <p>
                  <strong>Precio:</strong> ${modalProduct.price}
                </p>
                <p>
                  <strong>Marca:</strong> {modalProduct.marca}
                </p>
                <p>
                  <strong>Categoría:</strong> {modalProduct.categoria}
                </p>
                <p>
                  <strong>Stock:</strong>{" "}
                  {modalProduct.stock > 0 ? (
                    modalProduct.stock
                  ) : (
                    <span className="out-of-stock">Sin stock</span>
                  )}
                </p>
                <p className="modal-description">{modalProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <CartPage
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onChangeQuantity={changeQuantity}
        />
      )}
    </div>
  );
};

export default Shop;