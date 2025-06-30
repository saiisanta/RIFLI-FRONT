import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext.jsx';
import './authModal.css';

export default function AuthModal({ show, onClose }) {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form);
      } else {
        await register(form);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="switch-mode">
          {mode === 'login' ? (
            <p>¿No tienes cuenta? <span onClick={() => setMode('register')}>Regístrate</span></p>
          ) : (
            <p>¿Ya tienes cuenta? <span onClick={() => setMode('login')}>Inicia Sesión</span></p>
          )}
        </div>
      </div>
    </div>
  );
}