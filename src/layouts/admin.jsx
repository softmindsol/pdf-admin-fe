// src/layouts/admin.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Loader from "@/components/LoadingFalback";
import { Suspense, useEffect, useState } from "react";
import { getUserData, isUserLoggedIn } from "@/lib/auth";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userData = getUserData(); // Get user data once

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login");
    }
  }, [navigate, location.pathname]);

  // --- NEW: Determine which modules the user can see ---
  let allowedModules = [];
  if (userData) {
    // An 'admin' can see everything. Define all possible modules here.
    if (userData.role === "admin") {
      allowedModules = [
        "user",
        "department",
        "workOrder",
        "customer",
        "AboveGround",
        "underGround",
        "serviceTicket",
      ];
    } else {
 allowedModules = [...(userData?.allowedForms ?? []), "user"];
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
    setIsHovering(false);
  };


  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const isVisuallyExpanded = !isCollapsed || isHovering;

  return (
    <SidebarProvider>
      <div className="container">
        <div className="relative h-screen w-screen ">
          <AppSidebar
            isCollapsed={isCollapsed}
            toggleCollapse={toggleCollapse}
            isHovering={isHovering}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            // --- NEW: Pass the allowed modules as a prop ---
            allowedModules={allowedModules}
          />
          <main
            className={`overflow-y-auto p-4 transition-all duration-300  max-w-7xl mx-auto min-h-full
              ${isVisuallyExpanded ? "ml-64 w-[70%]" : "ml-16 w-[90%]"}`}
          >
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}