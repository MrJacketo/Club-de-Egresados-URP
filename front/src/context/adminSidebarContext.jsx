import { createContext, useContext, useState } from 'react';

const AdminSidebarContext = createContext();

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar debe ser usado dentro de un AdminSidebarProvider');
  }
  return context;
};

export const AdminSidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AdminSidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};
