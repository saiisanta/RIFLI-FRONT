import React from 'react';
import { Bank2 } from 'react-bootstrap-icons';
import './BankAccountHeader.scss';

const BankAccountHeader = () => {
  return (
    <header className="ba-header">
      <div className="ba-header-left">
        <h1>
          <Bank2 size={28} />
          Cuenta Bancaria
        </h1>
        <p className="ba-header-subtitle">
          Configurá los datos de transferencia que verán los clientes al pagar
        </p>
      </div>
    </header>
  );
};

export default BankAccountHeader;