import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import NotificationItem from '../NotificationItem/NotificationItem';
import './NotificationBell.scss';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const panelRef        = useRef(null);
  const bellRef         = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        bellRef.current   && !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="NotifBell">
      {/* Botón campana */}
      <button
        ref={bellRef}
        className={`NotifBell__trigger ${open ? 'NotifBell__trigger--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
      >
        <Bell size={22} strokeWidth={2} />

        {unreadCount > 0 && (
          <span className="NotifBell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel dropdown */}
      {open && (
        <div ref={panelRef} className="NotifBell__panel">
          {/* Header */}
          <div className="NotifBell__header">
            <span className="NotifBell__header-title">
              Notificaciones
              {unreadCount > 0 && (
                <span className="NotifBell__header-count">{unreadCount}</span>
              )}
            </span>

            {unreadCount > 0 && (
              <button
                className="NotifBell__mark-all"
                onClick={handleMarkAllRead}
                title="Marcar todas como leídas"
              >
                <CheckCheck size={15} />
                <span>Todas leídas</span>
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="NotifBell__list">
            {loading && notifications.length === 0 ? (
              <div className="NotifBell__empty">
                <Loader2 size={20} className="NotifBell__spinner" />
                <span>Cargando...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="NotifBell__empty">
                <Bell size={28} strokeWidth={1.2} />
                <span>No tenés notificaciones</span>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                  onClose={() => setOpen(false)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;