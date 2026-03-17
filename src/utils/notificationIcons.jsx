// utils/notificationIcons.jsx
import React from 'react';
import {
  ClipboardList,
  CircleCheck,
  CircleX,
  Wrench,
  PartyPopper,
  Ban,
  Paperclip,
  BadgeCheck,
  AlertTriangle,
  CreditCard,
  Package,
  Truck,
  House,
  Undo2,
  ShieldCheck,
  Bell,
} from 'lucide-react';

// type + metadata.status → ícono + color de acento
const ICON_MAP = {
  QUOTE: {
    QUOTED:      { icon: ClipboardList, color: '#60a5fa' },  // azul info
    ACCEPTED:    { icon: CircleCheck,   color: '#4ade80' },  // verde
    REJECTED:    { icon: CircleX,       color: '#f87171' },  // rojo
    IN_PROGRESS: { icon: Wrench,        color: '#fb923c' },  // naranja
    COMPLETED:   { icon: PartyPopper,   color: '#facc15' },  // amarillo
    CANCELLED:   { icon: Ban,           color: '#94a3b8' },  // gris
  },
  PAYMENT: {
    PROOF_UPLOADED: { icon: Paperclip,    color: '#60a5fa' },
    PAID:           { icon: BadgeCheck,   color: '#4ade80' },
    REJECTED:       { icon: AlertTriangle,color: '#f87171' },
  },
  ORDER: {
    PAID:       { icon: CreditCard, color: '#4ade80' },
    PROCESSING: { icon: Package,    color: '#60a5fa' },
    SHIPPED:    { icon: Truck,      color: '#fb923c' },
    DELIVERED:  { icon: House,      color: '#4ade80' },
    CANCELLED:  { icon: Ban,        color: '#94a3b8' },
    REFUNDED:   { icon: Undo2,      color: '#a78bfa' },
  },
  SYSTEM: {
    default: { icon: ShieldCheck, color: '#4ade80' },
  },
  ADMIN: {
    default: { icon: Bell, color: '#facc15' },
  },
};

const FALLBACK = { icon: Bell, color: '#94a3b8' };

/**
 * Devuelve el ícono correcto dado el tipo y el status de la notificación.
 * @param {string} type       - notification.type  (QUOTE, ORDER, etc.)
 * @param {string} status     - notification.metadata.status
 * @param {number} size       - tamaño del ícono en px (default 18)
 */
export const getNotificationIcon = (type, status, size = 18) => {
  const typeMap = ICON_MAP[type];
  if (!typeMap) return <FALLBACK.icon size={size} color={FALLBACK.color} />;

  const config = typeMap[status] ?? typeMap['default'] ?? FALLBACK;
  const Icon = config.icon;

  return <Icon size={size} color={config.color} strokeWidth={2} />;
};

/**
 * Devuelve solo el color de acento, útil para el borde o fondo del ícono.
 */
export const getNotificationColor = (type, status) => {
  const typeMap = ICON_MAP[type];
  if (!typeMap) return FALLBACK.color;
  const config = typeMap[status] ?? typeMap['default'] ?? FALLBACK;
  return config.color;
};