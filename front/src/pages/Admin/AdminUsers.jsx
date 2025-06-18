import React, { useState, useEffect } from "react";
//Admin SideBar
import AdminSidebar from "../../components/AdminSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../context/adminSidebarContext";

const AdminUsers = () => {
  return (
    <AdminSidebarProvider>
      <AmdinUsersContent />
    </AdminSidebarProvider>
  );
};

const AmdinUsersContent = () => {
  const { collapsed } = useAdminSidebar();
  return (
    <div className="flex">
      <AdminSidebar />
       <div className="ml-20 lg:ml-64 flex-1">
        hola
       </div>
    </div>
  );
};

export default AdminUsers;
