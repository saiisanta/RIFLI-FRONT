import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import useApiError from "../../hooks/useApiError";
import AuthPageLayout from "./components/AuthPageLayout";
import "./auth.scss";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    login,
    loading: authLoading,
    clearError,
  } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const redirect = searchParams.get("redirect");
  const sessionExpired = searchParams.get("session_expired");
  const registered = searchParams.get("registered");
  const verified = searchParams.get("verified");
  const logout = searchParams.get("logout");

  // Hook para manejar errores de API
  const { 
    generalError, 
    handleApiError, 
    clearApiError, 
    getFieldError 
  } = useApiError(['email', 'password']);

  const validationRules = {
    email: {
      required: { message: "El email es requerido" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email inválido",
      },
    },
    password: {
      required: { message: "La contraseña es requerida" },
      minLength: {
        value: 6,
        message: "La contraseña debe tener al menos 6 caracteres",
      },
    },
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useForm({ email: "", password: "" }, validationRules);

  const onSubmit = async (formData) => {
    clearApiError();
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      reset();

      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error en login:", err);
      handleApiError(err);
    }
  };

  React.useEffect(() => {
    return () => {
      clearError();
      clearApiError();
    };
  }, [clearError, clearApiError]);

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede a tu cuenta</p>
      </div>
      
      {sessionExpired && (
        <div className="info-message">
          Tu sesión expiró. Por favor inicia sesión nuevamente.
        </div>
      )}

      {registered && (
        <div className="success-message">
          ¡Registro exitoso! Revisa tu email para verificar tu cuenta.
        </div>
      )}

      {verified && (
        <div className="success-message-verified">
          <div className="verified-checkmark">
            <div className="check-icon-small">
              <span className="icon-line-small line-tip-small"></span>
              <span className="icon-line-small line-long-small"></span>
              <div className="icon-circle-small"></div>
            </div>
          </div>
          <div className="verified-content">
            <p className="verified-title">Email verificado correctamente</p>
            <p className="verified-subtitle">
              Ya podés iniciar sesión con tu cuenta
            </p>
          </div>
        </div>
      )}

      {logout && (
        <div className="info-message">Sesión cerrada correctamente.</div>
      )}

      {generalError && (
        <div className="error-message" role="alert">
          {generalError}
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
            className={
              (errors.email && touched.email) || getFieldError('email')
                ? "input-error"
                : ""
            }
            placeholder="tu@email.com"
            autoComplete="email"
          />
          {errors.email && touched.email && (
            <span className="field-error">{errors.email}</span>
          )}
          {!errors.email && getFieldError('email') && (
            <span className="field-error">{getFieldError('email')}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || authLoading}
              className={
                (errors.password && touched.password) || getFieldError('password')
                  ? "input-error"
                  : ""
              }
              placeholder="Mínimo 6 caracteres"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting || authLoading}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && touched.password && (
            <span className="field-error">{errors.password}</span>
          )}
          {!errors.password && getFieldError('password') && (
            <span className="field-error">{getFieldError('password')}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || authLoading}
          className="submit-btn"
        >
          {isSubmitting || authLoading ? (
            <>
              <span className="login-spinner"></span>
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
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
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="switch-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Login;