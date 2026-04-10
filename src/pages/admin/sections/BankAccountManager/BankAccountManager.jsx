import React from 'react';
import useBankAccount from '../../../../hooks/useBankAccount';
import useApiError from '../../../../hooks/useApiError';
import RateLimitToast from '../../../../components/RateLimitToast/RateLimitToast';
import BankAccountHeader from './components/BankAccountHeader/BankAccountHeader';
import BankAccountForm from './components/BankAccountForm/BankAccountForm';
import BankAccountCard from './components/BankAccountCard/BankAccountCard';
import './BankAccountManager.scss';

const BankAccountManager = () => {
  const { account, loading, error, createBankAccount, updateBankAccount, toggleBankAccount, clearError } = useBankAccount();

  const { generalError, rateLimitError, handleApiError, clearApiError, clearRateLimitError } = useApiError();

  const handleSubmit = async (formData) => {
    clearApiError();
    try {
      if (account) { await updateBankAccount(formData); } else { await createBankAccount(formData); }
    } catch (err) { handleApiError(err); }
  };

  const handleToggle = async () => {
    clearApiError();
    try { await toggleBankAccount(); }
    catch (err) { handleApiError(err); }
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
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />
      <div className="ba-manager">
        <BankAccountHeader />
        <BankAccountForm
          account={account}
          loading={loading}
          errorMsg={generalError || error}
          onSubmit={handleSubmit}
          onErrorClose={() => { clearError(); clearApiError(); }}
        />
        {account && <BankAccountCard account={account} loading={loading} onToggle={handleToggle} />}
      </div>
    </>
  );
};

export default BankAccountManager;