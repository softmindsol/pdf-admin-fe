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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdSettings,
  MdChevronLeft,
  MdPushPin,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { FileBarChart } from "lucide-react";

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
      },
      {
        label: "Department",
        to: "/department",
        icon: MdInventory,
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
      },
      {
        label: "Customer Ticket",
        to: "/customer",
        icon: FileBarChart,
      },
      {
        label: "Above Ground",
        to: "/above-ground",
        icon: FileBarChart,
      },
      {
        label: "Service Ticket",
        to: "/service-ticket",
        icon: FileBarChart,
      },
      {
        label: "Under Ground",
        to: "/under-ground",
        icon: FileBarChart,
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
}) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  const isVisuallyExpanded = !isCollapsed || isHovering;

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) newExpanded.delete(index);
    else newExpanded.add(index);
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
      className={`bg-gradient-to-b from-orange-50 to-orange-100 border-r border-orange-200 transition-all duration-300 fixed left-0 top-0 h-full z-50 ${
        isVisuallyExpanded ? "w-64" : "w-16"
      }`}
    >
      <SidebarHeader className="p-4 border-b border-orange-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {isVisuallyExpanded && (
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex items-center space-x-2"
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
              onClick={() => {
                navigate("/");
              }}
              alt="Logo"
              className="h-8 w-8 mx-auto"
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

      <SidebarContent className="p-2 overflow-y-auto">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {sidebarNavItems.map((item, index) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.has(index);

              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to) && item.to !== "/";

              return (
                <SidebarMenuItem key={index}>
                  {item.children ? (
                    <>
                      <SidebarMenuButton
                        onClick={() =>
                          isVisuallyExpanded && toggleExpanded(index)
                        }
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group
                          ${
                            isVisuallyExpanded
                              ? "justify-between"
                              : "justify-center"
                          }
                          hover:bg-orange-200 hover:text-orange-800 text-orange-700
                          ${
                            isExpanded && isVisuallyExpanded
                              ? "bg-orange-200 text-orange-800"
                              : ""
                          }
                        `}
                        title={!isVisuallyExpanded ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={20} className="flex-shrink-0" />
                          {isVisuallyExpanded && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>
                        {isVisuallyExpanded && (
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <MdExpandLess size={16} />
                            ) : (
                              <MdExpandMore size={16} />
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>

                      {isExpanded && isVisuallyExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          <SidebarMenu>
                            {item.children.map((child, childIndex) => {
                              const ChildIcon = child.icon;

                              const isChildActive =
                                location.pathname.startsWith(child.to);

                              return (
                                <SidebarMenuItem key={childIndex}>
                                  <SidebarMenuButton
                                    onClick={() => navigate(child.to)}
                                    className={`w-full flex items-center space-x-3 p-2.5 rounded-md text-sm
                                      hover:bg-orange-100 hover:text-orange-800 text-orange-600
                                      transition-colors duration-200
                                      ${
                                        isChildActive
                                          ? "bg-orange-200 text-orange-800 font-semibold"
                                          : ""
                                      }
                                    `}
                                  >
                                    <ChildIcon
                                      size={16}
                                      className="flex-shrink-0"
                                    />
                                    <span className="font-medium">
                                      {child.label}
                                    </span>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => navigate(item.to)}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200
                        ${
                          isVisuallyExpanded
                            ? "justify-start space-x-3"
                            : "justify-center"
                        }
                        hover:bg-orange-200 hover:text-orange-800 text-orange-700
                        ${
                          isActive && !item.children
                            ? "bg-orange-200 text-orange-800 font-semibold"
                            : ""
                        }
                      `}
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
      </SidebarContent>
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
