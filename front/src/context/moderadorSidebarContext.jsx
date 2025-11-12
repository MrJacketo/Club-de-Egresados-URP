import { createContext, useContext, useState } from 'react';

const ModeradorSidebarContext = createContext();

export const useModeradorSidebar = () => {
  const context = useContext(ModeradorSidebarContext);
  if (!context) {
    throw new Error('useModeradorSidebar debe ser usado dentro de un ModeradorSidebarProvider');
  }
  return context;
};

export const ModeradorSidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ModeradorSidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </ModeradorSidebarContext.Provider>
  );
};