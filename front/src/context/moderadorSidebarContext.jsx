import React, { createContext, useContext, useState } from 'react';

const ModeradorSidebarContext = createContext();

export const ModeradorSidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <ModeradorSidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </ModeradorSidebarContext.Provider>
  );
};

export const useModeradorSidebar = () => {
  const context = useContext(ModeradorSidebarContext);
  if (!context) {
    throw new Error('useModeradorSidebar must be used within ModeradorSidebarProvider');
  }
  return context;
};
