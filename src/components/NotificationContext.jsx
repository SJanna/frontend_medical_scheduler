import React from 'react';

// Crea un contexto con un estado vacío por defecto.
export const NotificationContext = React.createContext([]);

// Exporta también un proveedor de contexto personalizado.
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = React.useState([]);
  // console.log(notifications);
  return (
    <NotificationContext.Provider value={[notifications, setNotifications]}>
      {children}
    </NotificationContext.Provider>
  );
};