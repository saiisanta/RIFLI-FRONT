import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const validateField = useCallback((name, value) => {
      const rules = validationRules[name];
      if (!rules) return '';
  
      if (rules.required && !value) {
        return rules.required.message || 'Este campo es requerido';
      }
  
      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message || `Mínimo ${rules.minLength.value} caracteres`;
      }
  
      if (rules.maxLength && value.length > rules.maxLength.value) {
        return rules.maxLength.message || `Máximo ${rules.maxLength.value} caracteres`;
      }
  
      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message || 'Formato inválido';
      }
  
      if (rules.validate && typeof rules.validate === 'function') {
        return rules.validate(value, values);
      }
  
      return '';
    }, [validationRules, values]);
  
    const validateForm = useCallback(() => {
      const newErrors = {};
      let isValid = true;
  
      Object.keys(validationRules).forEach((name) => {
        const error = validateField(name, values[name]);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      });
  
      setErrors(newErrors);
      return isValid;
    }, [values, validateField, validationRules]);
  
    const handleChange = useCallback((e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
  
      setValues((prev) => ({ ...prev, [name]: newValue }));
  
      if (touched[name]) {
        const error = validateField(name, newValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }, [touched, validateField]);
  
    const handleBlur = useCallback((e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
  
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }, [values, validateField]);
  
    const setValue = useCallback((name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    }, []);
  
    const setFieldValues = useCallback((newValues) => {
      setValues((prev) => ({ ...prev, ...newValues }));
    }, []);
  
    const reset = useCallback(() => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }, [initialValues]);
  
    const handleSubmit = useCallback((onSubmit) => {
      return async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
  
        const allTouched = Object.keys(validationRules).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);
  
        const isValid = validateForm();
  
        if (isValid) {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error('Error en submit:', error);
          }
        }
  
        setIsSubmitting(false);
      };
    }, [values, validateForm, validationRules]);
  
    return {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      setValue,
      setFieldValues,
      reset,
      validateForm,
    };
  };

  
export default useForm;