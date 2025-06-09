import React, { useEffect, useState } from "react";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando productos…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No hay productos disponibles.</p>;

  return (
    <>
      {/* ─── Section Top Divider ─── */}
      <section className="shop-section">
        <div className="section-top-divider"></div>
      </section>

      {/* ─── Grid de Productos ─── */}
      <div className="shop-container">
        {products.map((prod) => (
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
            <h3 className="shop-title">{prod.name}</h3>
            <p className="shop-subinfo">
              <strong>Marca:</strong> {prod.marca}
            </p>
            <p className="shop-price">${prod.price.toFixed(2)}</p>

            {/* ==== Botones ==== */}
            <div className="shop-actions">
              <button
                className="btn-details"
                onClick={() => setModalProduct(prod)}
              >
                Ver detalles
              </button>
              <button
                className="btn-add"
                onClick={() => {/* lógica añadir al carrito */ }}
              >
                + Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==== Modal de detalles ==== */}
      {modalProduct && (
        <div className="modal-overlay" onClick={() => setModalProduct(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
                <p><strong>Precio:</strong> ${modalProduct.price.toFixed(2)}</p>
                <p><strong>Marca:</strong> {modalProduct.marca}</p>
                <p><strong>Categoría:</strong> {modalProduct.categoria}</p>
                <p className="shop-stock">
                <strong>Stock: </strong>
                  {modalProduct.stock > 0
                    ? `${modalProduct.stock}`
                    : <span className="out-of-stock">Sin stock</span>
                  }
                </p>
                <p className="modal-description">{modalProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
