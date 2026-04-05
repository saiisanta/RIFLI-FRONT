import React from 'react';
import {
  Bank2,
  ToggleOn,
  ToggleOff,
  CreditCard2Front,
  Person,
  Hash,
} from 'react-bootstrap-icons';
import './BankAccountCard.scss';

const BankAccountCard = ({ account, loading, onToggle }) => {
  const accountTypeLabel = account.account_type === 'SAVINGS' ? 'Caja de ahorro' : 'Cuenta corriente';

  return (
    <section className="ba-card-section">
      <div className="ba-card-section-header">
        <h2>
          <Bank2 size={20} />
          Cuenta configurada
        </h2>
        <button
          type="button"
          className={`ba-toggle-btn ${account.is_active ? 'active' : 'inactive'}`}
          onClick={onToggle}
          disabled={loading}
          title={account.is_active ? 'Desactivar cuenta' : 'Activar cuenta'}
        >
          {account.is_active ? (
            <>
              <ToggleOn size={22} />
              Activa
            </>
          ) : (
            <>
              <ToggleOff size={22} />
              Inactiva
            </>
          )}
        </button>
      </div>

      <div className="ba-card">
        <div className="ba-card-group">
          <div className="ba-card-group-title">
            <Bank2 size={14} />
            Datos del banco
          </div>
          <div className="ba-card-grid">
            <div className="ba-card-item">
              <span className="ba-card-label">Banco</span>
              <span className="ba-card-value">{account.bank_name}</span>
            </div>
            <div className="ba-card-item">
              <span className="ba-card-label">Tipo de cuenta</span>
              <span className="ba-card-value">{accountTypeLabel}</span>
            </div>
            <div className="ba-card-item">
              <span className="ba-card-label">Número de cuenta</span>
              <span className="ba-card-value ba-card-value--mono">{account.account_number}</span>
            </div>
          </div>
        </div>

        <div className="ba-card-group">
          <div className="ba-card-group-title">
            <CreditCard2Front size={14} />
            Transferencia
          </div>
          <div className="ba-card-grid">
            <div className="ba-card-item ba-card-item--wide">
              <span className="ba-card-label">CBU</span>
              <span className="ba-card-value ba-card-value--mono ba-card-value--highlight">{account.cbu}</span>
            </div>
            {account.alias && (
              <div className="ba-card-item">
                <span className="ba-card-label">Alias</span>
                <span className="ba-card-value ba-card-value--mono ba-card-value--highlight">{account.alias}</span>
              </div>
            )}
          </div>
        </div>

        <div className="ba-card-group">
          <div className="ba-card-group-title">
            <Person size={14} />
            Titular
          </div>
          <div className="ba-card-grid">
            <div className="ba-card-item">
              <span className="ba-card-label">Nombre</span>
              <span className="ba-card-value">{account.holder_name}</span>
            </div>
            <div className="ba-card-item">
              <span className="ba-card-label">Documento</span>
              <span className="ba-card-value ba-card-value--mono">{account.holder_document}</span>
            </div>
            <div className="ba-card-item">
              <span className="ba-card-label">CUIT</span>
              <span className="ba-card-value ba-card-value--mono">{account.holder_cuit}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankAccountCard;