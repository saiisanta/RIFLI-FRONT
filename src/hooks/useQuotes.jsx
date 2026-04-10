import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import quoteService from '../services/quoteService';

const QUOTES_KEY = ['quotes'];

export const useQuotes = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data: quotes = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...QUOTES_KEY, params],
    queryFn: () =>
      quoteService.getQuotes(params).then((d) => (Array.isArray(d) ? d : d.quotes ?? d.data ?? [])),
    staleTime: 1000 * 60 * 2,
  });

  const error = queryError?.message ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUOTES_KEY });

  const patchQuote = (quoteId, patch) =>
    queryClient.setQueriesData({ queryKey: QUOTES_KEY }, (prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((q) => (q.id === quoteId ? { ...q, ...patch } : q));
    });

  const createMutation = useMutation({
    mutationFn: quoteService.createQuote,
    onSuccess: invalidate,
  });

  const acceptMutation = useMutation({
    mutationFn: quoteService.acceptQuote,
    onSuccess: (data, quoteId) =>
      patchQuote(quoteId, { status: 'ACCEPTED', accepted_at: data.accepted_at }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ quoteId, reason }) => quoteService.rejectQuote(quoteId, reason),
    onSuccess: (_, { quoteId }) => patchQuote(quoteId, { status: 'REJECTED' }),
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({ quoteId, file, paymentType }) =>
      quoteService.uploadPaymentProof(quoteId, file, paymentType),
    onSuccess: (data, { quoteId, paymentType }) => {
      const patch =
        paymentType === 'deposit'
          ? { deposit_proof_url: data.proof_url, deposit_payment_status: 'PROOF_UPLOADED' }
          : { final_proof_url: data.proof_url,   final_payment_status:   'PROOF_UPLOADED' };
      patchQuote(quoteId, patch);
    },
  });

  const addBudgetMutation = useMutation({
    mutationFn: ({ quoteId, budgetData }) => quoteService.addBudget(quoteId, budgetData),
    onSuccess: (data, { quoteId }) => patchQuote(quoteId, data.quote ?? data),
  });

  const uploadBudgetPdfMutation = useMutation({
    mutationFn: ({ quoteId, pdfBlob }) => quoteService.uploadBudgetPdf(quoteId, pdfBlob),
    onSuccess: (data, { quoteId }) => patchQuote(quoteId, { budget_pdf: data.pdf_url }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ quoteId, status, extra }) => quoteService.updateStatus(quoteId, status, extra),
    onSuccess: (data, { quoteId }) => patchQuote(quoteId, data),
  });

  const reviewProofMutation = useMutation({
    mutationFn: ({ quoteId, paymentType, action, reason }) =>
      quoteService.reviewProof(quoteId, paymentType, action, reason),
    onSuccess: (data, { quoteId }) => patchQuote(quoteId, data),
  });

  const deleteMutation = useMutation({
    mutationFn: quoteService.deleteQuote,
    onSuccess: (_, quoteId) =>
      queryClient.setQueriesData({ queryKey: QUOTES_KEY }, (prev) =>
        Array.isArray(prev) ? prev.filter((q) => q.id !== quoteId) : prev
      ),
  });

  return {
    quotes,
    quote: null,
    loading,
    error,
    fetchQuotes: invalidate,
    fetchQuoteById: quoteService.getQuoteById,
    createQuote: createMutation.mutateAsync,
    acceptQuote: acceptMutation.mutateAsync,
    rejectQuote: (id, reason = '') => rejectMutation.mutateAsync({ quoteId: id, reason }),
    uploadPaymentProof: (id, file, type) =>
      uploadProofMutation.mutateAsync({ quoteId: id, file, paymentType: type }),
    addBudget: (id, data) => addBudgetMutation.mutateAsync({ quoteId: id, budgetData: data }),
    uploadBudgetPdf: (id, blob) => uploadBudgetPdfMutation.mutateAsync({ quoteId: id, pdfBlob: blob }),
    updateStatus: (id, status, extra = {}) =>
      updateStatusMutation.mutateAsync({ quoteId: id, status, extra }),
    reviewProof: (id, type, action, reason = '') =>
      reviewProofMutation.mutateAsync({ quoteId: id, paymentType: type, action, reason }),
    deleteQuote: deleteMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useQuotes;