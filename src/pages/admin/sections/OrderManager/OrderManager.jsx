import React from 'react';
import './OrderManager.scss';

const OrderManager = () => {
  return (
    <div className="order-manager-placeholder">
      <div className="order-manager-placeholder-content">
        <div className="order-manager-placeholder-icon">📦</div>
        <h2>Gestión de Pedidos</h2>
        <p>Esta sección estará disponible próximamente.</p>
        <p className="order-manager-placeholder-description">
          Aquí podrás administrar todos los pedidos de clientes, ver estados de envío, gestionar devoluciones y más.
        </p>
      </div>
    </div>
  );
};

export default OrderManager;