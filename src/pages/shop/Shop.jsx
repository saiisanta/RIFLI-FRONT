import React, { useState, useEffect } from "react";
import { useProductsSimple } from "../../hooks/useProductsSimple";
import ShopHeader from "./components/ShopHeader/ShopHeader";
import CartPage from "./components/CartPage/CartPage";
import { FiRefreshCw } from "react-icons/fi";
import "./shop.scss";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const { products, loading, error, reload } = useProductsSimple();

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = products.reduce((acc, prod) => {
        const category = prod.Category || prod.category;
        if (category && !acc.find(cat => cat.id === category.id)) {
          acc.push(category);
        }
        return acc;
      }, []);
      setCategories(uniqueCategories);

      // Extraer marcas únicas (soporta Brand o brand)
      const uniqueBrands = products.reduce((acc, prod) => {
        const brand = prod.Brand || prod.brand;
        if (brand && !acc.find(b => b.id === brand.id)) {
          acc.push(brand);
        }
        return acc;
      }, []);
      setBrands(uniqueBrands);
    }
  }, [products]);

  const filtered = products.filter((prod) => {
    let matches = true;

    const category = prod.Category || prod.category;
    if (filters.category && category?.id !== parseInt(filters.category)) {
      matches = false;
    }

    if (filters.minPrice && prod.price < parseFloat(filters.minPrice)) {
      matches = false;
    }
    if (filters.maxPrice && prod.price > parseFloat(filters.maxPrice)) {
      matches = false;
    }

    if (searchTerm.trim()) {
      const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const term = normalize(searchTerm);
      const brand = prod.Brand || prod.brand;
      matches =
        matches &&
        (normalize(prod.name).includes(term) ||
          normalize(category?.name).includes(term) ||
          normalize(brand?.name).includes(term) ||
          normalize(prod.short_description).includes(term));
    }

    return matches;
  }).sort((a, b) => {
    if (filters.sort === "asc") return a.price - b.price;
    if (filters.sort === "desc") return b.price - a.price;
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const handleClearFilters = () => {
    setFilters({ category: "", minPrice: "", maxPrice: "", sort: "" });
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
        <button onClick={() => reload()}>Reintentar</button>
      </div>
    );

  if (!products.length)
    return (
      <div className="shop-empty">
        <p>No hay productos disponibles.</p>
        <button onClick={() => reload()}>Recargar</button>
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
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-sort">Ordenar por</label>
            <select
              id="f-sort"
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
            >
              <option value="">---</option>
              <option value="asc">Precio: Menor a mayor</option>
              <option value="desc">Precio: Mayor a menor</option>
              <option value="name">Nombre: A-Z</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Rango de precio</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Mín"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
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
                onClick={() => reload()}
                disabled={loading}
                title="Recargar productos"
              >
                <FiRefreshCw className={loading ? "spinning" : ""} />
              </button>
            </div>
          </div>

          <div className="products-grid">
            {filtered.map((prod) => {
              const hasDiscount = prod.discount_percentage > 0;
              const discountedPrice = hasDiscount 
                ? (prod.price * (1 - prod.discount_percentage / 100)).toFixed(2)
                : prod.price;
              
              const category = prod.Category || prod.category;
              const brand = prod.Brand || prod.brand;

              return (
                <div key={prod.id} className="product-card">
                  {hasDiscount && (
                    <div className="product-discount-badge">
                      -{prod.discount_percentage}%
                    </div>
                  )}
                  <img
                    src={prod.main_image ? `http://localhost:4001${prod.main_image}` : "/api/images/placeholder.png"}
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
                    <p className="product-category">{category?.name || "Sin categoría"}</p>
                    <p className="product-brand">{brand?.name || "Sin marca"}</p>
                    <div className="product-price-container">
                      {hasDiscount ? (
                        <>
                          <p className="product-price-original">${prod.price}</p>
                          <p className="product-price">${discountedPrice}</p>
                        </>
                      ) : (
                        <p className="product-price">${prod.price}</p>
                      )}
                    </div>
                    {prod.stock <= 0 && (
                      <p className="product-out-of-stock">Sin stock</p>
                    )}
                    {prod.stock > 0 && prod.stock <= prod.min_stock && (
                      <p className="product-low-stock">¡Últimas unidades!</p>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => setModalProduct(prod)}
                    >
                      Detalles
                    </button>
                    <button 
                      className="btn-primary" 
                      onClick={() => addToCart(prod)}
                      disabled={prod.stock <= 0}
                    >
                      {prod.stock > 0 ? "Agregar" : "Sin stock"}
                    </button>
                  </div>
                </div>
              );
            })}
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
                src={modalProduct.main_image ? `http://localhost:4001${modalProduct.main_image}` : "/api/images/placeholder.png"}
                alt={modalProduct.name}
                className="modal-image"
              />
              <div className="modal-info">
                <h2>{modalProduct.name}</h2>
                <p>
                  <strong>SKU:</strong> {modalProduct.sku || "N/A"}
                </p>
                <p>
                  <strong>Precio:</strong> ${modalProduct.price}
                  {modalProduct.discount_percentage > 0 && (
                    <span className="modal-discount">
                      {" "}(-{modalProduct.discount_percentage}% = $
                      {(modalProduct.price * (1 - modalProduct.discount_percentage / 100)).toFixed(2)})
                    </span>
                  )}
                </p>
                <p>
                  <strong>Marca:</strong> {(modalProduct.Brand || modalProduct.brand)?.name || "Sin marca"}
                </p>
                <p>
                  <strong>Categoría:</strong> {(modalProduct.Category || modalProduct.category)?.name || "Sin categoría"}
                </p>
                <p>
                  <strong>Stock:</strong>{" "}
                  {modalProduct.stock > 0 ? (
                    <span className={modalProduct.stock <= modalProduct.min_stock ? "low-stock" : ""}>
                      {modalProduct.stock} unidades
                    </span>
                  ) : (
                    <span className="out-of-stock">Sin stock</span>
                  )}
                </p>
                
                {modalProduct.short_description && (
                  <p className="modal-short-description">
                    {modalProduct.short_description}
                  </p>
                )}

                {modalProduct.long_description && (
                  <p className="modal-description">{modalProduct.long_description}</p>
                )}

                {modalProduct.specifications && Array.isArray(modalProduct.specifications) && (
                  <div className="modal-specifications">
                    <h3>Especificaciones</h3>
                    {modalProduct.specifications.map((spec, idx) => (
                      <div key={idx} className="spec-group">
                        <h4>{spec.group}</h4>
                        <ul>
                          {spec.attributes?.map((attr, attrIdx) => (
                            <li key={attrIdx}>
                              <strong>{attr.key}:</strong> {attr.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
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