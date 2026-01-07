import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading: authLoading, error: authError, clearError } = useAuthContext();
  const redirect = searchParams.get('redirect');
  const sessionExpired = searchParams.get('session_expired');
  const registered = searchParams.get('registered');
  const logout = searchParams.get('logout');

  const validationRules = {
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
    { email: '', password: '' },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      
      reset();
      
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede a tu cuenta</p>
      </div>

      {/* Mensajes contextuales */}
      {sessionExpired && (
        <div className="info-message">
          Tu sesión expiró. Por favor inicia sesión nuevamente.
        </div>
      )}

      {registered && (
        <div className="success-message">
          ¡Registro exitoso! Ahora puedes iniciar sesión.
        </div>
      )}

      {logout && (
        <div className="info-message">
          Sesión cerrada correctamente.
        </div>
      )}

      {authError && (
        <div className="error-message" role="alert">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            autoComplete="current-password"
          />
          {errors.password && touched.password && (
            <span className="field-error">{errors.password}</span>
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
              Iniciando sesión...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password" className="forgot-link">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

    

      <div className="switch-mode">
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="switch-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Login;