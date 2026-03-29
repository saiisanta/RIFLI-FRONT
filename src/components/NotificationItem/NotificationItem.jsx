import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { getNotificationIcon, getNotificationColor } from '../../utils/notificationIcons';
import './NotificationItem.scss';

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'ahora';
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7)   return `${days}d`;
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

const NotificationItem = ({ notification, onRead, onDelete, onClose }) => {
  const navigate  = useNavigate();
  const { id, type, title, message, metadata, is_read, createdAt } = notification;
  const status    = metadata?.status;
  const link      = metadata?.link;
  const accentColor = getNotificationColor(type, status);

  const handleClick = () => {
    if (!is_read) onRead(id);
    if (link) {
      navigate(link);
      onClose?.();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`NotifItem ${!is_read ? 'NotifItem--unread' : ''} ${link ? 'NotifItem--clickable' : ''}`}
      onClick={handleClick}
      style={{ '--accent': accentColor }}
    >
      {/* Barra lateral de acento */}
      {!is_read && <span className="NotifItem__bar" />}

      {/* Ícono */}
      <div className="NotifItem__icon-wrap">
        {getNotificationIcon(type, status, 18)}
      </div>

      {/* Contenido */}
      <div className="NotifItem__body">
        <p className="NotifItem__title">{title}</p>
        <p className="NotifItem__message">{message}</p>
        <span className="NotifItem__time">{timeAgo(createdAt)}</span>
      </div>

      {/* Botón eliminar */}
      <button
        className="NotifItem__delete"
        onClick={handleDelete}
        aria-label="Eliminar notificación"
      >
        <X size={13} />
      </button>
    </div>
  );
};

export default NotificationItem;