import React, { createContext, useContext } from 'react';
import useNotifications from '../hooks/useNotifications';

export const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext debe usarse dentro de un NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;