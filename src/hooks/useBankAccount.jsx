import { useState, useCallback } from 'react';
import bankAccountService from '../services/bankAccountService';

const useBankAccount = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBankAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.getBankAccount();
      setAccount(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cargar la cuenta bancaria');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBankAccount = useCallback(async (accountData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.createBankAccount(accountData);
      setAccount(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al crear la cuenta bancaria');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBankAccount = useCallback(async (accountData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.updateBankAccount(accountData);
      setAccount(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al actualizar la cuenta bancaria');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBankAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.toggleBankAccount();
      if (data.account) setAccount(data.account);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cambiar el estado de la cuenta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearState = useCallback(() => {
    setAccount(null);
    setError(null);
  }, []);

  return {
    account,
    loading,
    error,
    fetchBankAccount,
    createBankAccount,
    updateBankAccount,
    toggleBankAccount,
    clearError,
    clearState,
  };
};

export default useBankAccount;