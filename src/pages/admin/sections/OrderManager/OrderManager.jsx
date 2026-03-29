import React, { useEffect, useState, useCallback, useRef } from 'react';
import useOrders from '../../../../hooks/useOrders';
import OrderDetailModal from './components/OrderDetailModal/OrderDetailModal';
import Pagination from '../../components/Pagination/Pagination';
import { Search, Eye, Truck } from 'react-bootstrap-icons';
import './OrderManager.scss';

const API_URL = import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 15;
const DEBOUNCE_MS    = 400;

// ── Status configs ────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: '',                label: 'Todos los estados' },
  { value: 'PENDING_PAYMENT', label: 'Esperando pago' },
  { value: 'PROCESSING',      label: 'En proceso' },
  { value: 'SHIPPED',         label: 'Enviado' },
  { value: 'DELIVERED',       label: 'Entregado' },
  { value: 'CANCELLED',       label: 'Cancelado' },
  { value: 'REFUNDED',        label: 'Reembolsado' },
];

const ORDER_STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Esperando pago',  cls: 'yellow' },
  PAID:            { label: 'Pagado',           cls: 'success'},
  PROCESSING:      { label: 'En proceso',       cls: 'blue'   },
  SHIPPED:         { label: 'Enviado',          cls: 'orange' },
  DELIVERED:       { label: 'Entregado',        cls: 'success'},
  CANCELLED:       { label: 'Cancelado',        cls: 'red'    },
  REFUNDED:        { label: 'Reembolsado',      cls: 'gray'   },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING_PROOF:  { label: 'Sin comprobante',   cls: 'gray'   },
  PROOF_UPLOADED: { label: 'Comprobante subido', cls: 'yellow' },
  APPROVED:       { label: 'Pagado',            cls: 'success'},
  REJECTED:       { label: 'Rechazado',         cls: 'red'    },
  PAID:           { label: 'Pagado',            cls: 'success'},
};

const SHIPPING_STATUS_CONFIG = {
  PENDING:  { label: 'Sin cotizar',   cls: 'yellow' },
  QUOTED:   { label: 'Cotizado',      cls: 'blue'   },
  ACCEPTED: { label: 'Aceptado',      cls: 'success'},
  REJECTED: { label: 'Rechazado',     cls: 'red'    },
};

// ── Helpers ───────────────────────────────────────────────────

const StatusBadge = ({ status, config }) => {
  const cfg = config[status] || { label: status, cls: 'gray' };
  return <span className={`om-badge om-badge--${cfg.cls}`}>{cfg.label}</span>;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const formatCurrency = (amount) =>
  amount != null
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(amount))
    : '—';

// ── Header ────────────────────────────────────────────────────

const OrderHeader = ({ total, search, onSearchChange, statusFilter, onStatusFilterChange, orders, fetching }) => {
  const countByStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <header className="om-header">
      <div className="om-header-left">
        <h1>Panel de Pedidos</h1>
        <p className="om-header-sub">{total} pedido{total !== 1 ? 's' : ''} en total</p>
      </div>

      <div className="om-header-actions">
        <div className="om-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por número, cliente o email..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="om-select-wrapper">
          <select value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)}>
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}{s.value && countByStatus[s.value] ? ` (${countByStatus[s.value]})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

// ── Table ─────────────────────────────────────────────────────

const OrderTable = ({ orders, loading, currentPage, totalPages, onPageChange, onOpenDetail }) => {
  if (!loading && orders.length === 0) {
    return (
      <div className="om-empty">
        <Truck size={38} />
        <p>No hay pedidos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <>
      <div className="om-table-wrapper">
        <table className="om-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Envío</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const client     = order.customer || order.client || order.User;
              const clientName = client ? `${client.first_name} ${client.last_name}` : '—';

              return (
                <tr key={order.id}>
                  <td>
                    <span className="om-order-num">{order.order_number || `#${order.id}`}</span>
                  </td>

                  <td>
                    <div className="om-client">
                      <span className="om-client-name">{clientName}</span>
                      <span className="om-client-email">{client?.email}</span>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={order.status}           config={ORDER_STATUS_CONFIG}    />
                  </td>

                  <td>
                    <StatusBadge status={order.payment_status || 'PENDING_PROOF'} config={PAYMENT_STATUS_CONFIG} />
                  </td>

                  <td>
                    <StatusBadge status={order.shipping_status || 'PENDING'}      config={SHIPPING_STATUS_CONFIG} />
                  </td>

                  <td className="om-amount">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="om-date">
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    <button
                      className="om-btn-view"
                      onClick={() => onOpenDetail(order)}
                      title="Ver detalle"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

// ── Main ──────────────────────────────────────────────────────

const OrderManager = () => {
  const {
    orders, loading, error, pagination,
    fetchOrders, setShippingCost, reviewProof, updateOrderStatus, clearError,
  } = useOrders();

  // Filters
  const [search,       setSearch]       = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const searchTimer = useRef(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(val), DEBOUNCE_MS);
  };

  const load = useCallback((page = 1) => {
    fetchOrders({ page, limit: ITEMS_PER_PAGE, status: statusFilter });
    setCurrentPage(page);
  }, [fetchOrders, statusFilter]);

  useEffect(() => { load(1); }, [statusFilter]);

  // Client-side search
  const filtered = orders.filter(o => {
    if (!debouncedSearch) return true;
    const s = debouncedSearch.toLowerCase();
    const client = o.customer || o.client || o.User;
    const clientName = `${client?.first_name || ''} ${client?.last_name || ''}`.toLowerCase();
    return (
      (o.order_number || '').toLowerCase().includes(s) ||
      clientName.includes(s) ||
      (client?.email || '').toLowerCase().includes(s)
    );
  });

  // ── Handlers para modal ───────────────────────────────────

  const handleSetShipping = useCallback(async (orderId, data) => {
    return await setShippingCost(orderId, data);
  }, [setShippingCost]);

  const handleReviewProof = useCallback(async (orderId, reviewData) => {
    return await reviewProof(orderId, reviewData);
  }, [reviewProof]);

  const handleUpdateStatus = useCallback(async (orderId, statusData) => {
    return await updateOrderStatus(orderId, statusData);
  }, [updateOrderStatus]);

  // ── Loading ───────────────────────────────────────────────

  if (loading && orders.length === 0) {
    return (
      <div className="om-loading">
        <div className="spinner" />
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="order-manager">

      <OrderHeader
        total={pagination.total || orders.length}
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        orders={orders}
        fetching={loading}
      />

      {error && (
        <div className="om-error-banner">
          {error}
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <section className="om-section-wrapper">
        <div className="om-section-header">
          <h2>Pedidos registrados</h2>
          {loading && orders.length > 0 && (
            <span className="om-fetching">
              <span className="spinner-sm" /> Actualizando…
            </span>
          )}
        </div>

        <OrderTable
          orders={filtered}
          loading={loading}
          currentPage={currentPage}
          totalPages={pagination.total_pages || 0}
          onPageChange={page => load(page)}
          onOpenDetail={setSelectedOrder}
        />
      </section>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSetShipping={handleSetShipping}
          onReviewProof={handleReviewProof}
          onUpdateStatus={handleUpdateStatus}
          loading={loading}
        />
      )}

    </div>
  );
};

export default OrderManager;