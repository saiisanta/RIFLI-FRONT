import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import serviceService from '../services/serviceService';

const SERVICES_KEY = ['services'];
const serviceKey = (id) => ['services', id];

export const useServices = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...SERVICES_KEY, params],
    queryFn: () =>
      serviceService
        .getServices(params)
        .then((d) => (Array.isArray(d) ? d : d.services ?? d.data ?? [])),
    staleTime: 1000 * 60 * 10,
  });

  const error = queryError?.message ?? null;

  const createMutation = useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ serviceId, serviceData }) => serviceService.updateService(serviceId, serviceData),
    onSuccess: (data, { serviceId }) =>
      queryClient.setQueriesData({ queryKey: SERVICES_KEY }, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((s) => (s.id === serviceId ? data.service ?? data : s));
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: (_, serviceId) =>
      queryClient.setQueriesData({ queryKey: SERVICES_KEY }, (prev) =>
        Array.isArray(prev) ? prev.filter((s) => s.id !== serviceId) : prev
      ),
  });

  return {
    services,
    service: null,
    loading,
    error,
    fetchServices: () => queryClient.invalidateQueries({ queryKey: SERVICES_KEY }),
    fetchServiceById: (id) =>
      queryClient.fetchQuery({
        queryKey: serviceKey(id),
        queryFn: () => serviceService.getServiceById(id),
        staleTime: 1000 * 60 * 5,
      }),
    createService: createMutation.mutateAsync,
    updateService: (id, data) => updateMutation.mutateAsync({ serviceId: id, serviceData: data }),
    deleteService: deleteMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useServices;