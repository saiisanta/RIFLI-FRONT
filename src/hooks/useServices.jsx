import { useState, useCallback} from 'react';
import serviceService from '../services/serviceService';

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchServices = useCallback(async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const data = await serviceService.getServices(params);
        setServices(data.services || data.data || []);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar servicios');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const fetchServiceById = useCallback(async (serviceId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await serviceService.getServiceById(serviceId);
        setService(data.service || data);
        return data;
      } catch (err) {
        setError(err.message || 'Error al cargar servicio');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const createService = useCallback(async (serviceData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await serviceService.createService(serviceData);
        setServices((prev) => [data.service || data, ...prev]);
        return data;
      } catch (err) {
        setError(err.message || 'Error al crear servicio');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const updateService = useCallback(async (serviceId, serviceData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await serviceService.updateService(serviceId, serviceData);
        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? data.service || data : s))
        );
        return data;
      } catch (err) {
        setError(err.message || 'Error al actualizar servicio');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const deleteService = useCallback(async (serviceId) => {
      try {
        setLoading(true);
        setError(null);
        await serviceService.deleteService(serviceId);
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
        return true;
      } catch (err) {
        setError(err.message || 'Error al eliminar servicio');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const clearError = useCallback(() => {
      setError(null);
    }, []);
  
    return {
      services,
      service,
      loading,
      error,
      fetchServices,
      fetchServiceById,
      createService,
      updateService,
      deleteService,
      clearError,
    };
  };
  
  export default useServices;