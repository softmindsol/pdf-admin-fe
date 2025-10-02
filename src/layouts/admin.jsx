import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Loader from "@/components/LoadingFalback";
import { Suspense, useEffect, useState } from "react";
import { isUserLoggedIn } from "@/lib/auth";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log("auth");
    if (!isUserLoggedIn()) {
      navigate("/auth/login");
    }
  }, [navigate, location.pathname]);
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
      <div className="relative h-screen w-screen ">
        {/* Pass all state and handlers down to the sidebar */}
        <AppSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          isHovering={isHovering}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />

        <main
          className={`overflow-y-auto p-4 transition-all duration-300 w-full max-w-5xl  min-h-full
            ${isVisuallyExpanded ? "ml-64" : "ml-16"}`}
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
}
