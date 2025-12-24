import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/LoadingFalback";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin/dashboard";
import ProtectedRoute from "@/layouts/ProtectedRoute.jsx";

import UsersManagement from "./pages/admin/users";
import ViewUser from "./pages/admin/users/view";
import EditUser from "./pages/admin/users/EditUser";
import CreateUser from "./pages/admin/users/CreateUser";
import DepartmentsManagement from "./pages/admin/department";
import EditDepartment from "./pages/admin/department/EditDepartment";
import CreateDepartment from "./pages/admin/department/createDepartment";
import ViewDepartment from "./pages/admin/department/viewDepartment";
import WorkOrderManagement from "./pages/admin/workOrder";
import CreateWorkOrder from "./pages/admin/workOrder/createWorkOrder";
import ViewWorkOrder from "./pages/admin/workOrder/ViewWorkOrder";
import CustomerManagement from "./pages/admin/customer";
import CustomerForm from "./pages/admin/customer/createCustomer";
import ViewCustomer from "./pages/admin/customer/ViewWorkOrder";
import AboveGroundTestManagement from "./pages/admin/AboveGround";
import AboveGroundTestForm from "./pages/admin/AboveGround/createAboveGround";
import ViewAboveGroundTicket from "./pages/admin/AboveGround/view";
import ServiceTicketManagement from "./pages/admin/serviceTicket";
import ServiceTicketForm from "./pages/admin/serviceTicket/createupdateServiceTicket";
import ViewServiceTicket from "./pages/admin/serviceTicket/viewServiceTicket";
import UndergroundTestManagement from "./pages/admin/underGround";
import ViewUndergroundTest from "./pages/admin/underGround/view";
import UndergroundTestForm from "./pages/admin/underGround/createUpdateUnderground";
import ChangePassword from "./pages/settings/Changepassword";
import ChangeUsername from "./pages/settings/ChangeUsername";
import AlarmManagement from "./pages/admin/alarm";
import AlarmForm from "./pages/admin/alarm/create";
import ViewAlarm from "./pages/admin/alarm/view";

const ErrorPage = lazy(() => import("./components/ErrorPage"));
const AuthLayout = lazy(() => import("./layouts/auth"));
const LoginPage = lazy(() => import("./pages/auth/login"));

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },

      {
        path: "user",
        element: (
          <ProtectedRoute moduleName="user">
            <UsersManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/:id",
        element: (
          <ProtectedRoute moduleName="user">
            <ViewUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/:id/update",
        element: (
          <ProtectedRoute moduleName="user">
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "user/new",
        element: (
          <ProtectedRoute moduleName="user">
            <CreateUser />
          </ProtectedRoute>
        ),
      },

      {
        path: "department",
        element: (
          <ProtectedRoute moduleName="department">
            <DepartmentsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "department/new",
        element: (
          <ProtectedRoute moduleName="department">
            <CreateDepartment />
          </ProtectedRoute>
        ),
      },
      {
        path: "department/:id/update",
        element: (
          <ProtectedRoute moduleName="department">
            <EditDepartment />
          </ProtectedRoute>
        ),
      },
      {
        path: "department/:id",
        element: (
          <ProtectedRoute moduleName="department">
            <ViewDepartment />
          </ProtectedRoute>
        ),
      },

      {
        path: "work-order",
        element: (
          <ProtectedRoute moduleName="workOrder">
            <WorkOrderManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "work-order/new",
        element: (
          <ProtectedRoute moduleName="workOrder">
            <CreateWorkOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "work-order/update/:id",
        element: (
          <ProtectedRoute moduleName="workOrder">
            <CreateWorkOrder />
          </ProtectedRoute>
        ),
      },
      {
        path: "work-order/:id",
        element: (
          <ProtectedRoute moduleName="workOrder">
            <ViewWorkOrder />
          </ProtectedRoute>
        ),
      },

      {
        path: "customer",
        element: (
          <ProtectedRoute moduleName="customer">
            <CustomerManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "customer/new",
        element: (
          <ProtectedRoute moduleName="customer">
            <CustomerForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "customer/update/:id",
        element: (
          <ProtectedRoute moduleName="customer">
            <CustomerForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "customer/:id",
        element: (
          <ProtectedRoute moduleName="customer">
            <ViewCustomer />
          </ProtectedRoute>
        ),
      },

      {
        path: "above-ground",
        element: (
          <ProtectedRoute moduleName="AboveGround">
            <AboveGroundTestManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "above-ground/new",
        element: (
          <ProtectedRoute moduleName="AboveGround">
            <AboveGroundTestForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "above-ground/:id",
        element: (
          <ProtectedRoute moduleName="AboveGround">
            <ViewAboveGroundTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: "above-ground/:id/update",
        element: (
          <ProtectedRoute moduleName="AboveGround">
            <AboveGroundTestForm />
          </ProtectedRoute>
        ),
      },

      {
        path: "service-ticket",
        element: (
          <ProtectedRoute moduleName="serviceTicket">
            <ServiceTicketManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "service-ticket/new",
        element: (
          <ProtectedRoute moduleName="serviceTicket">
            <ServiceTicketForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "service-ticket/update/:id",
        element: (
          <ProtectedRoute moduleName="serviceTicket">
            <ServiceTicketForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "service-ticket/:id",
        element: (
          <ProtectedRoute moduleName="serviceTicket">
            <ViewServiceTicket />
          </ProtectedRoute>
        ),
      },

      {
        path: "under-ground",
        element: (
          <ProtectedRoute moduleName="underGround">
            <UndergroundTestManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "under-ground/new",
        element: (
          <ProtectedRoute moduleName="underGround">
            <UndergroundTestForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "under-ground/update/:id",
        element: (
          <ProtectedRoute moduleName="underGround">
            <UndergroundTestForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "under-ground/:id",
        element: (
          <ProtectedRoute moduleName="underGround">
            <ViewUndergroundTest />
          </ProtectedRoute>
        ),
      },

      {
        path: "alarm",
        element: (
          <ProtectedRoute moduleName="alarm">
            <AlarmManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "alarm/new",
        element: (
          <ProtectedRoute moduleName="alarm">
            <AlarmForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "alarm/update/:id",
        element: (
          <ProtectedRoute moduleName="alarm">
            <AlarmForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "alarm/:id",
        element: (
          <ProtectedRoute moduleName="alarm">
            <ViewAlarm />
          </ProtectedRoute>
        ),
      },



      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "change-username",
        element: <ChangeUsername />,
      },
    ],
  },
]);
