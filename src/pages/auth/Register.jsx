import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import AuthPageLayout from "./components/AuthPageLayout";
import "./auth.scss";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    resendVerification,
    loading: authLoading,
    error: authError,
    clearError,
  } = useAuthContext();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const validationRules = {
    name: {
      required: { message: "El nombre es requerido" },
      minLength: {
        value: 2,
        message: "El nombre debe tener al menos 2 caracteres",
      },
    },
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
    confirmPassword: {
      required: { message: "Confirma tu contraseña" },
      validate: {
        message: "Las contraseñas no coinciden",
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
  } = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    validationRules
  );

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setUserEmail(formData.email);
      setRegistrationSuccess(true);
      reset();
    } catch (err) {
      console.error("Error en registro:", err);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      setResendError("");
      setResendSuccess(false);

      await resendVerification(userEmail);
      
      setResendSuccess(true);
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error al reenviar verificación:", err);
      setResendError(
        err.error || 
        err.message || 
        "Error al reenviar el email. Inténtalo nuevamente."
      );
    } finally {
      setResendLoading(false);
    }
  };

  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  if (registrationSuccess) {
    return (
      <AuthPageLayout>
        <div className="auth-header">
          <h2>Registro Exitoso</h2>
          <p className="auth-subtitle">Verificá tu email para continuar</p>
        </div>

        <div className="success-message-verified">
          <div className="verified-checkmark">
            <div className="check-icon-small">
              <span className="icon-line-small line-tip-small"></span>
              <span className="icon-line-small line-long-small"></span>
              <div className="icon-circle-small"></div>
            </div>
          </div>

          <div className="verified-content">
            <p className="verified-title">
              <strong>¡Tu cuenta ha sido creada!</strong>
            </p>
            <p className="verified-subtitle">
              Te enviamos un email de verificación a:
              <span className="email-highlight">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Mensajes de reenvío */}
        {resendSuccess && (
          <div className="success-message">
            Email reenviado correctamente. Revisá tu bandeja de entrada.
          </div>
        )}

        {resendError && (
          <div className="error-message" role="alert">
            {resendError}
          </div>
        )}

        <div className="info-messages">
          <ol className="info-ol">
            <li>Revisá tu bandeja de entrada (y la carpeta de spam)</li>
            <li>Hacé click en el enlace de verificación</li>
            <li>Una vez verificado, podrás iniciar sesión</li>
          </ol>
          <p className="verification-note">
            El enlace es válido por <strong>24 horas</strong>
          </p>
        </div>

        <div className="verification-actions">
          <button
            className="btn-secondary"
            onClick={() => setRegistrationSuccess(false)}
          >
            Registrar otra cuenta
          </button>
          <Link to="/login" className="btn-primary">
            Ir al Login
          </Link>
        </div>

        <div className="switch-mode">
          <p className="resend-text">
            ¿No recibiste el email?{" "}
            <button
              className="switch-link-button"
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <>
                  <span className="spinner-inline"></span>
                  Reenviando...
                </>
              ) : (
                "Reenviar email"
              )}
            </button>
          </p>
        </div>
      </AuthPageLayout>
    );
  }

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
            className={errors.name && touched.name ? "input-error" : ""}
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
            className={errors.email && touched.email ? "input-error" : ""}
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
            className={errors.password && touched.password ? "input-error" : ""}
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
            className={
              errors.confirmPassword && touched.confirmPassword
                ? "input-error"
                : ""
            }
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
          {values.password &&
            values.confirmPassword &&
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
            "Crear Cuenta"
          )}
        </button>
      </form>

      <div className="switch-mode">
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="switch-link">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default Register;