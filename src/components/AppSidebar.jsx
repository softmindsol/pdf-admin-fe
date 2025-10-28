import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdChevronLeft,
  MdPushPin,
  MdExpandMore,
  MdExpandLess,
  MdLogout,
} from "react-icons/md";
import { GrUserSettings } from "react-icons/gr";
import { FileBarChart } from "lucide-react";
import { getUserData } from "@/lib/auth";

// sidebarNavItems definition remains the same...
const sidebarNavItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: MdDashboard,
  },
  {
    label: "Manage",
    to: "/manage",
    icon: MdPeople,
    children: [
      {
        label: "Users",
        to: "/user",
        icon: MdPeople,
        module: "user",
      },
      {
        label: "Department",
        to: "/department",
        icon: MdInventory,
        module: "department",
      },
    ],
  },
  {
    label: "Documents",
    to: "/docs",
    icon: FileBarChart,
    children: [
      {
        label: "Work Order",
        to: "/work-order",
        icon: FileBarChart,
        module: "workOrder",
      },
      {
        label: "Customer",
        to: "/customer",
        icon: FileBarChart,
        module: "customer",
      },
      {
        label: "Above Ground",
        to: "/above-ground",
        icon: FileBarChart,
        module: "AboveGround",
      },
      {
        label: "Service Ticket",
        to: "/service-ticket",
        icon: FileBarChart,
        module: "serviceTicket",
      },
      {
        label: "Under Ground",
        to: "/under-ground",
        icon: FileBarChart,
        module: "underGround",
      },
    ],
  },
  {
    label: "Profile",
    to: "/profile",
    icon: GrUserSettings,
    children: [
      {
        label: "Change Password",
        to: "/change-password",
        icon: MdPeople,
      },
      {
        label: "Change Username",
        to: "/change-username",
        icon: MdInventory,
      },
    ],
  },
];

export function AppSidebar({
  isCollapsed,
  toggleCollapse,
  isHovering,
  handleMouseEnter,
  handleMouseLeave,
  allowedModules = [],
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserData(); // User data is fetched here

  const getInitialExpandedItems = () => {
    // ... (rest of the function is unchanged)
    const activeParentIndex = sidebarNavItems.findIndex(
      (item) =>
        item.children &&
        item.children.some((child) => location.pathname.startsWith(child.to))
    );
    if (activeParentIndex !== -1) {
      return new Set([activeParentIndex]);
    }
    return new Set();
  };

  const [expandedItems, setExpandedItems] = useState(getInitialExpandedItems);
  const isVisuallyExpanded = !isCollapsed || isHovering;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const visibleNavItems = sidebarNavItems
    .map((item) => {
      // ... (filtering logic is unchanged)
      if (!item.children) {
        return item;
      }
      const isModuleRestricted = item.children.some((child) => child.module);
      if (isModuleRestricted) {
        const visibleChildren = item.children.filter((child) =>
          allowedModules.includes(child.module)
        );
        if (visibleChildren.length > 0) {
          return { ...item, children: visibleChildren };
        }
        return null;
      } else {
        return item;
      }
    })
    .filter(Boolean);

  const toggleExpanded = (index) => {
    // ... (function is unchanged)
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  useEffect(() => {
    if (!isVisuallyExpanded) {
      setExpandedItems(new Set());
    }
  }, [isVisuallyExpanded]);

  return (
    <Sidebar
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-gradient-to-b from-orange-50 to-orange-100 border-r border-orange-200 transition-all duration-300 fixed left-0 top-0 h-full z-50 flex flex-col ${
        isVisuallyExpanded ? "w-64" : "w-16"
      }`}
    >
      {/* --- HEADER (Unchanged) --- */}
      <SidebarHeader className="p-4 border-b border-orange-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {isVisuallyExpanded && (
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img
                src="/logofull.svg"
                alt="Admin Panel"
                className="h-8 w-auto"
              />
            </div>
          )}
          {!isVisuallyExpanded && (
            <img
              src="/logo.svg"
              onClick={() => navigate("/")}
              alt="Logo"
              className="h-8 w-8 mx-auto cursor-pointer"
            />
          )}
          {isVisuallyExpanded && (
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200"
              aria-label={isCollapsed ? "Pin sidebar" : "Unpin sidebar"}
            >
              {isCollapsed ? (
                <MdPushPin size={16} />
              ) : (
                <MdChevronLeft size={16} />
              )}
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* --- CONTENT (Navigation & User Profile) --- */}
      <SidebarContent className="flex-1 flex flex-col p-2 overflow-y-auto">
        <SidebarGroup className="flex-grow">
          {/* ... (Navigation menu mapping logic is unchanged) ... */}
          <SidebarMenu className="space-y-1">
            {visibleNavItems.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.has(index);

              const isActive = item.children
                ? item.children.some((child) =>
                    location.pathname.startsWith(child.to)
                  )
                : location.pathname === item.to;

              return (
                <SidebarMenuItem key={index}>
                  {item.children ? (
                    <>
                      <SidebarMenuButton
                        onClick={() =>
                          isVisuallyExpanded && toggleExpanded(index)
                        }
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                          isVisuallyExpanded
                            ? "justify-between"
                            : "justify-center"
                        } hover:bg-orange-200 hover:text-orange-800 text-orange-700 ${
                          isActive
                            ? "bg-orange-200 text-orange-800 font-semibold"
                            : ""
                        }`}
                        title={!isVisuallyExpanded ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} className="flex-shrink-0" />
                          {isVisuallyExpanded && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>
                        {isVisuallyExpanded &&
                          (isExpanded ? (
                            <MdExpandLess size={16} />
                          ) : (
                            <MdExpandMore size={16} />
                          ))}
                      </SidebarMenuButton>

                      {isExpanded && isVisuallyExpanded && (
                        <div className="ml-4 pl-2 border-l-2 border-orange-200 mt-1 space-y-1">
                          <SidebarMenu>
                            {item.children.map((child, childIndex) => (
                              <SidebarMenuItem key={childIndex}>
                                <SidebarMenuButton
                                  onClick={() => navigate(child.to)}
                                  className={`w-full flex items-center space-x-3 p-2.5 rounded-md text-sm hover:bg-orange-100 hover:text-orange-800 text-orange-600 transition-colors duration-200 ${
                                    location.pathname.startsWith(child.to)
                                      ? "bg-orange-200 text-orange-800 font-semibold"
                                      : ""
                                  }`}
                                >
                                  <span>{child.label}</span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => navigate(item.to)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                        isVisuallyExpanded
                          ? "justify-start space-x-3"
                          : "justify-center"
                      } hover:bg-orange-200 hover:text-orange-800 text-orange-700 ${
                        isActive
                          ? "bg-orange-200 text-orange-800 font-semibold"
                          : ""
                      }`}
                      title={!isVisuallyExpanded ? item.label : undefined}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {isVisuallyExpanded && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* --- START: NEW USER PROFILE SECTION --- */}
        <SidebarGroup className="mt-auto pt-2 border-t border-orange-200">
          <SidebarMenuItem>
            <div
              className={`w-full flex items-center p-2 transition-all duration-200 ${
                isVisuallyExpanded ? "justify-start" : "justify-center"
              }`}
            >
              {/* Avatar with initials */}
              <div className="flex-shrink-0 w-9 h-9 bg-orange-500 text-white flex items-center justify-center rounded-full font-bold text-sm">
                {user?.firstName?.charAt(0).toUpperCase()}
                {user?.lastName?.charAt(0).toUpperCase()}
              </div>

              {/* User Info - shown only when expanded */}
              {isVisuallyExpanded && (
                <div className="ml-3 text-left overflow-hidden">
                  <p
                    className="text-sm font-semibold text-orange-900 truncate"
                    title={`${user?.firstName} ${user?.lastName}`}
                  >
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p
                    className="text-xs text-orange-700 truncate uppercase"
                    title={user?.role}
                  >
                    {user?.role}
                  </p>
                  <p
                    className="text-xs text-orange-700 truncate"
                    title={user?.departmentName}
                  >
                    {user?.departmentName} (@{user?.username})
                  </p>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          {/* --- END: NEW USER PROFILE SECTION --- */}

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className={`w-full flex items-center p-3 rounded-lg bg-red-100 transition-all duration-200 text-red-600 hover:bg-red-200 hover:text-red-800 ${
                isVisuallyExpanded
                  ? "justify-start space-x-3"
                  : "justify-center"
              }`}
              title={!isVisuallyExpanded ? "Logout" : undefined}
            >
              <MdLogout size={20} className="flex-shrink-0" />
              {isVisuallyExpanded && (
                <span className="font-medium">Logout</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>

      {/* --- FOOTER (Unchanged) --- */}
      <SidebarFooter className="p-4 border-t border-orange-200 bg-white/30 backdrop-blur-sm">
        {isVisuallyExpanded ? (
          <div className="text-center">
            <p className="text-xs text-orange-600">© 2025 Management Panel</p>
            <p className="text-xs text-orange-500 mt-1">v1.0.0</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
