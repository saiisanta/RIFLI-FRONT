import React, { useEffect } from 'react';
import useBankAccount from '../../../../hooks/useBankAccount';
import BankAccountHeader from './components/BankAccountHeader/BankAccountHeader';
import BankAccountForm from './components/BankAccountForm/BankAccountForm';
import BankAccountCard from './components/BankAccountCard/BankAccountCard';
import './BankAccountManager.scss';

const BankAccountManager = () => {
  const {
    account,
    loading,
    error,
    fetchBankAccount,
    createBankAccount,
    updateBankAccount,
    toggleBankAccount,
    clearError,
  } = useBankAccount();

  useEffect(() => {
    fetchBankAccount();
  }, [fetchBankAccount]);

  const handleSubmit = async (formData) => {
    try {
      if (account) {
        await updateBankAccount(formData);
      } else {
        await createBankAccount(formData);
      }
    } catch (err) {
      console.error('Error al guardar cuenta bancaria:', err);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleBankAccount();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  if (loading && !account) {
    return (
      <div className="ba-manager-loading">
        <div className="spinner" />
        <p>Cargando cuenta bancaria...</p>
      </div>
    );
  }

  return (
    <div className="ba-manager">
      <BankAccountHeader />

      <BankAccountForm
        account={account}
        loading={loading}
        errorMsg={error}
        onSubmit={handleSubmit}
        onErrorClose={clearError}
      />

      {account && (
        <BankAccountCard
          account={account}
          loading={loading}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
};

export default BankAccountManager;