import React from 'react';
import { Eye, FileEarmarkText, Trash3 } from 'react-bootstrap-icons';
import Pagination from '../../../../components/Pagination/Pagination';
import './QuoteTable.scss';

const API_URL = 'http://localhost:4001';

const STATUS_CONFIG = {
  PENDING:     { label: 'Pendiente',     cls: 'yellow'  },
  QUOTED:      { label: 'Presupuestado', cls: 'blue'    },
  ACCEPTED:    { label: 'Aceptado',      cls: 'green'   },
  REJECTED:    { label: 'Rechazado',     cls: 'red'     },
  IN_PROGRESS: { label: 'En progreso',   cls: 'orange'  },
  COMPLETED:   { label: 'Completado',    cls: 'success' },
  CANCELLED:   { label: 'Cancelado',     cls: 'gray'    },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'gray' };
  return <span className={`qt-status-badge qt-status--${cfg.cls}`}>{cfg.label}</span>;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const formatCurrency = (amount) =>
  amount != null
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
    : '—';

const QuoteTable = ({
  quotes,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onOpenDetail,
  onOpenBudget,
  onDelete,
}) => {
  if (!loading && quotes.length === 0) {
    return (
      <div className="qt-empty">
        <FileEarmarkText size={40} />
        <p>No hay cotizaciones que coincidan con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="qt-wrapper">
        <table className="qt-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>PDF</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q => {
              const clientName = q.client
                ? `${q.client.first_name} ${q.client.last_name}`
                : '—';
              const serviceType = q.service?.type || q.service_type || '—';
              const canBudget = ['PENDING', 'QUOTED'].includes(q.status);

              return (
                <tr key={q.id}>
                  <td>
                    <span className="qt-quote-number">{q.quote_number}</span>
                  </td>

                  <td>
                    <div className="qt-client">
                      <span className="qt-client-name">{clientName}</span>
                      <span className="qt-client-email">{q.client?.email}</span>
                    </div>
                  </td>

                  <td>
                    <span className="qt-service-badge">{serviceType}</span>
                  </td>

                  <td>
                    <StatusBadge status={q.status} />
                  </td>

                  <td className="qt-amount">
                    {formatCurrency(q.quoted_amount)}
                  </td>

                  <td className="qt-date">
                    {formatDate(q.createdAt)}
                  </td>

                  <td>
                    {q.budget_pdf ? (
                      <a
                        href={`${API_URL}${q.budget_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="qt-pdf-link"
                        title="Ver PDF del presupuesto"
                      >
                        <FileEarmarkText size={16} />
                        PDF
                      </a>
                    ) : (
                      <span className="qt-no-pdf">—</span>
                    )}
                  </td>

                  <td>
                    <div className="qt-actions">
                      <button
                        className="qt-btn-icon qt-btn-view"
                        onClick={() => onOpenDetail(q)}
                        title="Ver detalle"
                      >
                        <Eye size={15} />
                      </button>

                      {canBudget && (
                        <button
                          className="qt-btn-icon qt-btn-budget"
                          onClick={() => onOpenBudget(q)}
                          title={q.status === 'QUOTED' ? 'Editar presupuesto' : 'Generar presupuesto'}
                        >
                          <FileEarmarkText size={15} />
                        </button>
                      )}

                      <button
                        className="qt-btn-icon qt-btn-delete"
                        onClick={() => onDelete(q.id)}
                        title="Eliminar"
                      >
                        <Trash3 size={15} />
                      </button>
                    </div>
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

export default QuoteTable;