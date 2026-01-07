import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading: authLoading, error: authError, clearError } = useAuthContext();

  const validationRules = {
    name: {
      required: { message: 'El nombre es requerido' },
      minLength: { 
        value: 2, 
        message: 'El nombre debe tener al menos 2 caracteres' 
      }
    },
    email: {
      required: { message: 'El email es requerido' },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
      }
    },
    password: {
      required: { message: 'La contraseña es requerida' },
      minLength: { 
        value: 6, 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      }
    },
    confirmPassword: {
      required: { message: 'Confirma tu contraseña' },
      validate: {
        message: 'Las contraseñas no coinciden'
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    validationRules
  );

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      reset();
      navigate('/login?registered=true');
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate para comenzar</p>
      </div>

      {authError && (
        <div className="error-message" role="alert">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || authLoading}
            className={errors.name && touched.name ? 'input-error' : ''}
            placeholder="Tu nombre completo"
            autoComplete="name"
          />
          {errors.name && touched.name && (
            <span className="field-error">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || authLoading}
            className={errors.email && touched.email ? 'input-error' : ''}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          {errors.email && touched.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || authLoading}
            className={errors.password && touched.password ? 'input-error' : ''}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          {errors.password && touched.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting || authLoading}
            className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
          {values.password && values.confirmPassword && 
           values.password !== values.confirmPassword && (
            <span className="field-error">Las contraseñas no coinciden</span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting || authLoading}
          className="submit-btn"
        >
          {isSubmitting || authLoading ? (
            <>
              <span className="spinner"></span>
              Registrando...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      <div className="switch-mode">
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="switch-link">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Register;