import { createContext, useContext, useState } from 'react';

const InspectorSidebarContext = createContext();

export const useInspectorSidebar = () => {
  const context = useContext(InspectorSidebarContext);
  if (!context) {
    throw new Error('useInspectorSidebar debe ser usado dentro de un InspectorSidebarProvider');
  }
  return context;
};

export const InspectorSidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <InspectorSidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      {children}
    </InspectorSidebarContext.Provider>
  );
};
