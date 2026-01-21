import React, { useState, useEffect } from "react";
import { useProductsSimple } from "../../hooks/useProductsSimple";
import ShopHeader from "./components/ShopHeader/ShopHeader";
import CartPage from "./components/CartPage/CartPage";
import { FiRefreshCw, FiX, FiFilter } from "react-icons/fi";
import "./shop.scss";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
    inStock: false,
  });
  const [modalProduct, setModalProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const brand = prod.Brand || prod.brand;

    if (filters.category && category?.id !== parseInt(filters.category)) {
      matches = false;
    }

    if (filters.brand && brand?.id !== parseInt(filters.brand)) {
      matches = false;
    }

    if (filters.minPrice && prod.price < parseFloat(filters.minPrice)) {
      matches = false;
    }
    if (filters.maxPrice && prod.price > parseFloat(filters.maxPrice)) {
      matches = false;
    }

    if (filters.inStock && prod.stock <= 0) {
      matches = false;
    }

    if (searchTerm.trim()) {
      const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const term = normalize(searchTerm);
      matches =
        matches &&
        (normalize(prod.name).includes(term) ||
          normalize(category?.name).includes(term) ||
          normalize(brand?.name).includes(term) ||
          normalize(prod.short_description).includes(term) ||
          normalize(prod.sku).includes(term));
    }

    return matches;
  }).sort((a, b) => {
    if (filters.sort === "price_asc") return a.price - b.price;
    if (filters.sort === "price_desc") return b.price - a.price;
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    if (filters.sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  const handleClearFilters = () => {
    setFilters({ 
      category: "", 
      brand: "",
      minPrice: "", 
      maxPrice: "", 
      sort: "",
      inStock: false 
    });
    setSearchTerm("");
  };

  const handleOpenModal = (product) => {
    setModalProduct(product);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (modalProduct?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? modalProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (modalProduct?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === modalProduct.images.length - 1 ? 0 : prev + 1
      );
    }
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

  const cartTotal = cart.reduce((acc, item) => {
    const price = item.discount_percentage > 0
      ? item.price * (1 - item.discount_percentage / 100)
      : item.price;
    return acc + item.quantity * price;
  }, 0);
  
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
        {/* Botón móvil para mostrar filtros */}
        <button 
          className="shop-mobile-filter-toggle"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <FiFilter />
          Filtros
        </button>

        {/* Sidebar de filtros */}
        <aside className={`shop-filters ${showMobileFilters ? 'show' : ''}`}>
          <div className="shop-filters-header">
            <h3>Filtros</h3>
            <button 
              className="shop-filters-close"
              onClick={() => setShowMobileFilters(false)}
            >
              <FiX />
            </button>
          </div>

          <div className="filter-group">
            <label htmlFor="f-categoria">Categoría</label>
            <select
              id="f-categoria"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-brand">Marca</label>
            <select
              id="f-brand"
              value={filters.brand}
              onChange={(e) =>
                setFilters({ ...filters, brand: e.target.value })
              }
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
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
              <option value="">Relevancia</option>
              <option value="price_asc">Precio: Menor a mayor</option>
              <option value="price_desc">Precio: Mayor a menor</option>
              <option value="name">Nombre: A-Z</option>
              <option value="newest">Más recientes</option>
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

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              />
              <span>Solo productos en stock</span>
            </label>
          </div>

          <button className="btn-clear-filters" onClick={handleClearFilters}>
            Limpiar filtros
          </button>
        </aside>

        {/* Contenido principal */}
        <div className="shop-container">
          <div className="shop-controls">
            <div className="results-info">
              <strong>{filtered.length}</strong> producto{filtered.length !== 1 ? "s" : ""}{" "}
              {searchTerm || filters.category || filters.brand ? "encontrado" : "disponible"}{filtered.length !== 1 ? "s" : ""}
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
                ? (prod.price * (1 - prod.discount_percentage / 100))
                : prod.price
              
              const category = prod.Category || prod.category;
              const brand = prod.Brand || prod.brand;

              return (
                <div key={prod.id} className="product-card">
                  {hasDiscount && (
                    <div className="product-discount-badge">
                      -{prod.discount_percentage}%
                    </div>
                  )}
                  
                  <div className="product-image-container">
                    <img
                      src={prod.main_image ? `http://localhost:4001${prod.main_image}` : "/api/images/placeholder.png"}
                      alt={prod.name}
                      loading="lazy"
                      className="product-image"
                      onError={(e) => {
                        if (!e.currentTarget.dataset.fallback) {
                          e.currentTarget.src = "/api/images/placeholder.png";
                          e.currentTarget.dataset.fallback = "true";
                        }
                      }}
                    />
                  </div>

                  <div className="product-info">
                    <div className="product-meta">
                      {brand && (
                        <span className="product-brand">{brand.name}</span>
                      )}
                      {category && (
                        <span className="product-category">{category.name}</span>
                      )}
                    </div>
                    
                    <h3 className="product-title">{prod.name}</h3>
                    
                    {prod.short_description && (
                      <p className="product-description">{prod.short_description}</p>
                    )}

                    <div className="product-price-container">
                      {hasDiscount ? (
                        <>
                          <p className="product-price-original">${prod.price}</p>
                          <p className="product-price">${discountedPrice}</p>
                        </>
                      ) : (
                        <p className="product-price">${discountedPrice}</p>
                      )}
                    </div>

                    {prod.stock <= 0 ? (
                      <p className="product-out-of-stock">Sin stock</p>
                    ) : prod.stock <= prod.min_stock ? (
                      <p className="product-low-stock">¡Solo quedan {prod.stock} unidades!</p>
                    ) : null}
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-detalles"
                      onClick={() => handleOpenModal(prod)}
                    >
                      Detalles
                    </button>
                    <button 
                      className="btn-comprar" 
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

          {filtered.length === 0 && (
            <div className="no-results">
              <p>No se encontraron productos con los filtros aplicados</p>
              <button onClick={handleClearFilters} className="btn-primary">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del producto */}
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
              <div className="modal-images">
                <div className="modal-image-wrapper">
                  {modalProduct.images && modalProduct.images.length > 1 && (
                    <>
                      <button 
                        className="modal-image-nav modal-image-prev"
                        onClick={handlePrevImage}
                        aria-label="Imagen anterior"
                      >
                        <p>‹</p>
                      </button>
                      <button 
                        className="modal-image-nav modal-image-next"
                        onClick={handleNextImage}
                        aria-label="Imagen siguiente"
                      >
                        <p>›</p>
                      </button>
                    </>
                  )}
                  <img
                    src={
                      modalProduct.images && modalProduct.images.length > 0
                        ? `http://localhost:4001${modalProduct.images[currentImageIndex]}`
                        : modalProduct.main_image
                        ? `http://localhost:4001${modalProduct.main_image}`
                        : "/api/images/placeholder.png"
                    }
                    alt={modalProduct.name}
                    className="modal-image-main"
                    onError={(e) => {
                      e.currentTarget.src = "http://localhost:4001/images/placeholder.png";
                    }}
                  />
                </div>

                {modalProduct.images && modalProduct.images.length > 1 && (
                  <div className="modal-image-thumbnails">
                    {modalProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:4001${img}`}
                        alt={`${modalProduct.name} - imagen ${idx + 1}`}
                        className={`modal-thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        onError={(e) => {
                          e.currentTarget.src = "http://localhost:4001/images/placeholder.png";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-info">
                <div className="modal-header">
                  <div className="modal-meta">
                    {(modalProduct.Brand || modalProduct.brand) && (
                      <span className="modal-brand">
                        {(modalProduct.Brand || modalProduct.brand).name}
                      </span>
                    )}
                    {(modalProduct.Category || modalProduct.category) && (
                      <span className="modal-category">
                        {(modalProduct.Category || modalProduct.category).name}
                      </span>
                    )}
                  </div>
                  <h2>{modalProduct.name}</h2>
                  {modalProduct.sku && (
                    <p className="modal-sku">SKU: {modalProduct.sku}</p>
                  )}
                </div>

                <div className="modal-price-section">
                  {modalProduct.discount_percentage > 0 ? (
                    <>
                      <p className="modal-price-original">${modalProduct.price}</p>
                      <p className="modal-price">
                        ${(modalProduct.price * (1 - modalProduct.discount_percentage / 100))}
                      </p>
                      <span className="modal-discount">-{modalProduct.discount_percentage}%</span>
                    </>
                  ) : (
                    <p className="modal-price">${modalProduct.price}</p>
                  )}
                </div>

                <div className="modal-stock">
                  {modalProduct.stock > 0 ? (
                    <span className={modalProduct.stock <= modalProduct.min_stock ? "low-stock" : "in-stock"}>
                      {modalProduct.stock} unidades disponibles
                    </span>
                  ) : (
                    <span className="out-of-stock">Sin stock</span>
                  )}
                </div>

                {modalProduct.short_description && (
                  <p className="modal-short-description">
                    {modalProduct.short_description}
                  </p>
                )}

                {modalProduct.long_description && (
                  <div className="modal-long-description">
                    <h3>Descripción</h3>
                    <p>{modalProduct.long_description}</p>
                  </div>
                )}

                {modalProduct.specifications && Array.isArray(modalProduct.specifications) && modalProduct.specifications.length > 0 && (
                  <div className="modal-specifications">
                    <h3>Especificaciones Técnicas</h3>
                    <div className="specifications-grid">
                      {modalProduct.specifications.map((spec, idx) => {
                        const key = Object.keys(spec)[0];
                        const value = spec[key];
                        return (
                          <div key={idx} className="spec-item">
                            <span className="spec-key">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button 
                  className="modal-add-to-cart"
                  onClick={() => {
                    addToCart(modalProduct);
                    setModalProduct(null);
                  }}
                  disabled={modalProduct.stock <= 0}
                >
                  {modalProduct.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </button>
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