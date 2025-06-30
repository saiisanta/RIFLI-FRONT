import React, { useEffect, useState } from "react";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoria: "",
    marca: "",
    priceOrder: "",
    min: "",
    max: "",
  });
  const [modalProduct, setModalProduct] = useState(null);
  const [modalCheckout, setModalCheckout] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);

  // Función para eliminar producto
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Función para cambiar cantidad
  const changeQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  useEffect(() => {
    fetch("http://localhost:4001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let temp = [...products];
    if (filters.categoria) temp = temp.filter(p => p.categoria === filters.categoria);
    if (filters.marca) temp = temp.filter(p => p.marca === filters.marca);
    if (filters.min) {
      const minVal = parseFloat(filters.min);
      if (!isNaN(minVal)) temp = temp.filter(p => p.price >= minVal);
    }
    if (filters.max) {
      const maxVal = parseFloat(filters.max);
      if (!isNaN(maxVal)) temp = temp.filter(p => p.price <= maxVal);
    }
    if (filters.priceOrder === "asc") temp.sort((a, b) => a.price - b.price);
    else if (filters.priceOrder === "desc") temp.sort((a, b) => b.price - a.price);

    const normalize = (str) =>
      str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (searchTerm.trim() !== "") {
      const term = normalize(searchTerm);
      temp = temp.filter(p =>
        normalize(p.name).includes(term) ||
        normalize(p.categoria).includes(term) ||
        normalize(p.marca).includes(term)
      );
    }

    setFiltered(temp);
  }, [filters, searchTerm, products]);

  const handleClearFilters = () => {
    setFilters({ categoria: "", marca: "", priceOrder: "", min: "", max: "" });
    setSearchTerm("");
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleCheckoutNext = () => {
    if (checkoutStep < 3) setCheckoutStep(checkoutStep + 1);
    else setModalCheckout(false); // cerrar modal al finalizar
  };

  if (loading) return <p>Cargando productos…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No hay productos disponibles.</p>;

  return (
    <>
      <div className="shop-header" id="shop">
        <div className="shop-logo-wrapper">
          <img
            className="shop-logo"
            src="./src/assets/img/rifli/icono_rifli.png"
            alt="Logo"
          />
        </div>
      </div>

      <div className="shop-wrapper">
        <aside className="shop-filters">
          <h3>Filtros</h3>
          {/* filtros */}
          <label htmlFor="f-categoria">Categoría:</label>
          <select
            id="f-categoria"
            value={filters.categoria}
            onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="Cámaras">Cámaras</option>
            <option value="Cables">Cables</option>
            <option value="Herramientas">Herramientas</option>
            <option value="Durlock">Durlock</option>
            <option value="DVR">DVR</option>
          </select>

          <label htmlFor="f-marca">Marca:</label>
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

          <label htmlFor="f-priceOrder">Orden de precio:</label>
          <select
            id="f-priceOrder"
            value={filters.priceOrder}
            onChange={(e) => setFilters({ ...filters, priceOrder: e.target.value })}
          >
            <option value="">---</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>

          <label>Rango de precio:</label>
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

          <button className="btn-clear-filters" onClick={handleClearFilters}>
            Limpiar filtros
          </button>

          {/* CARRITO DE COMPRAS */}
          <div className="cart-section">
            <h3>Carrito</h3>
            {cart.length === 0 ? (
              <p>No hay productos.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            <p><strong>Total: ${cartTotal.toFixed(2)}</strong></p>

            <div className="btns-cart">
              {cart.length > 0 && (
                <button className="btn-cart-details btn-details" onClick={() => setShowCartModal(true)}>
                  Ver carrito
                </button>
              )}
              {cart.length > 0 && (
                <button className="btn-add" onClick={() => { setModalCheckout(true); setCheckoutStep(1); }}>
                  Comprar
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* PRODUCTOS */}
        <div className="shop-container">
          <div className="results-search-wrapper">
            <div className="results-info">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </div>
            <input
              className="shop-search"
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filtered.map((prod) => (
            <div key={prod.id} className="shop-card">
              <img
                src={`http://localhost:4001${prod.imageUrl}`}
                alt={`Foto de ${prod.name}`}
                loading="lazy"
                className="shop-image"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallback) {
                    e.currentTarget.src = "/api/images/placeholder.png";
                    e.currentTarget.dataset.fallback = "true";
                  }
                }}
              />
              <h3 className="shop-title">{prod.categoria} - {prod.name}</h3>
              <p className="shop-subinfo"><strong>Marca:</strong> {prod.marca}</p>
              <p className="shop-price">${prod.price.toFixed(2)}</p>
              <div className="shop-actions">
                <button className="btn-details" onClick={() => setModalProduct(prod)}>Detalles</button>
                <button className="btn-add" onClick={() => addToCart(prod)}>+ Agregar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PRODUCTO */}
      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalProduct(null)}>&times;</button>
            <div className="modal-body">
              <img
                src={`http://localhost:4001${modalProduct.imageUrl}`}
                alt={modalProduct.name}
                className="modal-image"
              />
              <div className="modal-info">
                <h2>{modalProduct.name}</h2>
                <p><strong>Precio:</strong> ${modalProduct.price.toFixed(2)}</p>
                <p><strong>Marca:</strong> {modalProduct.marca}</p>
                <p><strong>Categoría:</strong> {modalProduct.categoria}</p>
                <p className="shop-stock">
                  <strong>Stock:</strong> {modalProduct.stock > 0 ? modalProduct.stock : <span className="out-of-stock">Sin stock</span>}
                </p>
                <p className="modal-description">{modalProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLES DEL CARRITO */}
      {showCartModal && (
        <div className="modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="modal-content cart-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCartModal(false)}>&times;</button>
            <h2>Detalles del carrito</h2>
            <div className="cart-details-grid">
              {cart.map((item) => (
                <div key={item.id} className="cart-details-card">
                  <img
                    src={`http://localhost:4001${item.imageUrl}`}
                    alt={item.name}
                    className="cart-details-img"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.src = "/api/images/placeholder.png";
                        e.currentTarget.dataset.fallback = "true";
                      }
                    }}
                  />
                  <div className="cart-details-info">
                    <h4>{item.name}</h4>
                    <p><strong>Marca:</strong> {item.marca}</p>
                    <p><strong>Precio:</strong> ${item.price.toFixed(2)}</p>
                    <div className="cart-details-controls">
                      <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                    </div>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* MODAL CHECKOUT */}
      {modalCheckout && (
        <div className="modal-overlay" onClick={() => setModalCheckout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalCheckout(false)}>&times;</button>
            <div className="modal-body" style={{ flexDirection: 'column' }}>
              <h2>Paso {checkoutStep} de 3</h2>
              {checkoutStep === 1 && (
                <p>📄 Datos del usuario (Nombre, email, dirección guardada...)</p>
              )}
              {checkoutStep === 2 && (
                <p>🚚 Selecciona un método de envío (retiro, envío a domicilio...)</p>
              )}
              {checkoutStep === 3 && (
                <p>💳 Método de pago (Tarjeta, efectivo, transferencia...)</p>
              )}
              <button className="btn-add" onClick={handleCheckoutNext}>
                {checkoutStep === 3 ? "Finalizar compra" : "Siguiente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
