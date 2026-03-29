import React, { useEffect, useState, useCallback } from 'react';
import useQuotes from '../../../../hooks/useQuotes';
import QuoteHeader from './components/QuoteHeader/QuoteHeader';
import QuoteTable from './components/QuoteTable/QuoteTable';
import QuoteDetailModal from './components/QuoteDetailModal/QuoteDetailModal';
import BudgetGeneratorModal from './components/BudgetGeneratorModal/BudgetGeneratorModal';
import './QuoteManager.scss';

const QuoteManager = () => {
  const {
    quotes,
    loading,
    error,
    fetchQuotes,
    updateStatus,
    reviewProof,
    deleteQuote,
    addBudget,
    uploadBudgetPdf,
    clearError,
  } = useQuotes();

  const [searchTerm,      setSearchTerm]      = useState('');
  const [statusFilter,    setStatusFilter]     = useState('');
  const [currentPage,     setCurrentPage]      = useState(1);
  const [selectedQuote,   setSelectedQuote]    = useState(null);
  const [showDetailModal, setShowDetailModal]  = useState(false);
  const [showBudgetModal, setShowBudgetModal]  = useState(false);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  // ── Filtering ──────────────────────────────────────────────

  const filtered = quotes.filter(q => {
    const clientName = `${q.client?.first_name || ''} ${q.client?.last_name || ''}`.toLowerCase();
    const search     = searchTerm.toLowerCase();
    const matchSearch =
      q.quote_number?.toLowerCase().includes(search) ||
      clientName.includes(search) ||
      q.service_type?.toLowerCase().includes(search) ||
      (q.service?.type || '').toLowerCase().includes(search);
    const matchStatus = statusFilter ? q.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const totalPages    = Math.ceil(filtered.length / itemsPerPage);
  const currentItems  = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── Handlers ──────────────────────────────────────────────

  const handleOpenDetail = useCallback((quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedQuote(null);
  }, []);

  const handleOpenBudget = useCallback((quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(false);
    setShowBudgetModal(true);
  }, []);

  const handleCloseBudget = useCallback(() => {
    setShowBudgetModal(false);
    setSelectedQuote(null);
  }, []);

  // After budget is saved — refresh and optionally re-open detail
  const handleBudgetSaved = useCallback((updatedQuote) => {
    setShowBudgetModal(false);
    setSelectedQuote(updatedQuote);
    setShowDetailModal(true);
  }, []);

const handleUpdateStatus = useCallback(async (quoteId, status, rejectionReason) => {
  try {
    await updateStatus(quoteId, status, {
      ...(rejectionReason && { rejection_reason: rejectionReason }),
    });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
  }
}, [updateStatus]);

  const handleReviewProof = useCallback(async (quoteId, paymentType, action, reason = '') => {
    try {
      await reviewProof(quoteId, paymentType, action, reason);
    } catch (err) {
      console.error('Error al revisar comprobante:', err);
    }
  }, [reviewProof]);

  const handleDelete = useCallback(async (quoteId) => {
    if (!window.confirm('¿Eliminar esta cotización? Esta acción no se puede deshacer.')) return;
    try {
      await deleteQuote(quoteId);
      handleCloseDetail();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  }, [deleteQuote, handleCloseDetail]);

  // ── Loading skeleton ──────────────────────────────────────

  if (loading && quotes.length === 0) {
    return (
      <div className="quote-manager-loading">
        <div className="spinner" />
        <p>Cargando cotizaciones...</p>
      </div>
    );
  }

  return (
    <div className="quote-manager">
      <QuoteHeader
        total={filtered.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        quotes={quotes}
      />

      {error && (
        <div className="quote-manager-error">
          {error}
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <section className="quote-manager-section">
        <div className="section-header">
          <h2>Cotizaciones registradas</h2>
        </div>

        <QuoteTable
          quotes={currentItems}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onOpenDetail={handleOpenDetail}
          onOpenBudget={handleOpenBudget}
          onDelete={handleDelete}
        />
      </section>

      {showDetailModal && selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={handleCloseDetail}
          onOpenBudget={() => handleOpenBudget(selectedQuote)}
          onUpdateStatus={handleUpdateStatus}
          onReviewProof={handleReviewProof}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      {showBudgetModal && selectedQuote && (
        <BudgetGeneratorModal
          quote={selectedQuote}
          onClose={handleCloseBudget}
          onSaved={handleBudgetSaved}
          addBudget={addBudget}
          uploadBudgetPdf={uploadBudgetPdf}
          loading={loading}
        />
      )}
    </div>
  );
};

export default QuoteManager;