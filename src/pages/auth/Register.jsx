import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import useApiError from "../../hooks/useApiError";
import RateLimitToast from "../../components/RateLimitToast/RateLimitToast";
import AuthPageLayout from "./components/AuthPageLayout";
import "./auth.scss";

const Register = () => {
  const { register, resendVerification, loading: authLoading, clearError } = useAuthContext();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail]     = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError,   setResendError]   = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    generalError,
    rateLimitError,
    handleApiError,
    clearApiError,
    clearRateLimitError,
    getFieldError,
  } = useApiError(['first_name', 'last_name', 'email', 'password']);

  const validationRules = {
    first_name:      { required: { message: "El nombre es requerido" },   minLength: { value: 2, message: "Mínimo 2 caracteres" } },
    last_name:       { required: { message: "El apellido es requerido" },  minLength: { value: 2, message: "Mínimo 2 caracteres" } },
    email:           { required: { message: "El email es requerido" },     pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" } },
    password:        { required: { message: "La contraseña es requerida" }, minLength: { value: 6, message: "Mínimo 6 caracteres" } },
    confirmPassword: { required: { message: "Confirma tu contraseña" },    validate: { message: "Las contraseñas no coinciden" } },
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset } =
    useForm({ first_name: "", last_name: "", email: "", password: "", confirmPassword: "" }, validationRules);

  const onSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) return;
    clearApiError();
    try {
      await register({ first_name: formData.first_name, last_name: formData.last_name, email: formData.email, password: formData.password });
      setUserEmail(formData.email);
      setRegistrationSuccess(true);
      reset();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      setResendError("");
      setResendSuccess(false);
      await resendVerification(userEmail);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      setResendError(err.error || err.message || "Error al reenviar el email. Inténtalo nuevamente.");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    clearError();
  }, [clearError, clearApiError]);

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
              <span className="icon-line-small line-tip-small" />
              <span className="icon-line-small line-long-small" />
              <div className="icon-circle-small" />
            </div>
          </div>
          <div className="verified-content">
            <p className="verified-title"><strong>¡Tu cuenta ha sido creada!</strong></p>
            <p className="verified-subtitle">
              Te enviamos un email de verificación a:
              <span className="email-highlight">{userEmail}</span>
            </p>
          </div>
        </div>

        {resendSuccess && <div className="success-message">Email reenviado correctamente. Revisá tu bandeja de entrada.</div>}
        {resendError   && <div className="error-message" role="alert">{resendError}</div>}

        <div className="info-messages">
          <ol className="info-ol">
            <li>Revisá tu bandeja de entrada (y la carpeta de spam)</li>
            <li>Hacé click en el enlace de verificación</li>
            <li>Una vez verificado, podrás iniciar sesión</li>
          </ol>
          <p className="verification-note">El enlace es válido por <div><strong>24 horas</strong></div></p>
        </div>

        <div className="verification-actions">
          <button className="btn-secondary" onClick={() => setRegistrationSuccess(false)}>Registrar otra cuenta</button>
          <Link to="/login" className="btn-primary">Ir al Login</Link>
        </div>

        <div className="switch-mode">
          <p className="resend-text">
            ¿No recibiste el email?{" "}
            <button className="switch-link-button" onClick={handleResendVerification} disabled={resendLoading}>
              {resendLoading ? <><span className="spinner-inline" />Reenviando...</> : "Reenviar email"}
            </button>
          </p>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />

      <AuthPageLayout>
        <div className="auth-header">
          <h2>Crear Cuenta</h2>
          <p className="auth-subtitle">Regístrate para comenzar</p>
        </div>

        {generalError && <div className="error-message" role="alert">{generalError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="first_name">Nombre</label>
            <input type="text" id="first_name" name="first_name" value={values.first_name}
              onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting || authLoading}
              className={(errors.first_name && touched.first_name) || getFieldError('first_name') ? "input-error" : ""}
              placeholder="Tu nombre" autoComplete="given-name" />
            {errors.first_name && touched.first_name && <span className="field-error">{errors.first_name}</span>}
            {!errors.first_name && getFieldError('first_name') && <span className="field-error">{getFieldError('first_name')}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input type="text" id="last_name" name="last_name" value={values.last_name}
              onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting || authLoading}
              className={(errors.last_name && touched.last_name) || getFieldError('last_name') ? "input-error" : ""}
              placeholder="Tu apellido" autoComplete="family-name" />
            {errors.last_name && touched.last_name && <span className="field-error">{errors.last_name}</span>}
            {!errors.last_name && getFieldError('last_name') && <span className="field-error">{getFieldError('last_name')}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={values.email}
              onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting || authLoading}
              className={(errors.email && touched.email) || getFieldError('email') ? "input-error" : ""}
              placeholder="tu@email.com" autoComplete="email" />
            {errors.email && touched.email && <span className="field-error">{errors.email}</span>}
            {!errors.email && getFieldError('email') && <span className="field-error">{getFieldError('email')}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? "text" : "password"} id="password" name="password" value={values.password}
                onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting || authLoading}
                className={(errors.password && touched.password) || getFieldError('password') ? "input-error" : ""}
                placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || authLoading} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && touched.password && <span className="field-error">{errors.password}</span>}
            {!errors.password && getFieldError('password') && <span className="field-error">{getFieldError('password')}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="password-input-wrapper">
              <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={values.confirmPassword}
                onChange={handleChange} onBlur={handleBlur} disabled={isSubmitting || authLoading}
                className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
                placeholder="Repite tu contraseña" autoComplete="new-password" />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting || authLoading} aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            {values.password && values.confirmPassword && values.password !== values.confirmPassword && (
              <span className="field-error">Las contraseñas no coinciden</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting || authLoading} className="submit-btn">
            {isSubmitting || authLoading ? <><span className="login-spinner" />Registrando...</> : "Crear Cuenta"}
          </button>
        </form>

        <div className="switch-mode">
          <p>¿Ya tienes cuenta? <Link to="/login" className="switch-link">Inicia Sesión</Link></p>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default Register;