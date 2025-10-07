import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "@/components/LoadingFalback";
import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin/dashboard";
import UsersManagement from "./pages/admin/users";
import ViewUser from "./pages/admin/users/view";
import EditUser from "./pages/admin/users/EditUser";
import CreateUser from "./pages/admin/users/CreateUser";
import DepartmentsManagement from "./pages/admin/department";
import EditDepartment from "./pages/admin/department/EditDepartment";
import ViewDepartment from "./pages/admin/department/viewDepartment";
import WorkOrderManagement from "./pages/admin/workOrder";
import CreateWorkOrder from "./pages/admin/workOrder/createWorkOrder";
import ViewWorkOrder from "./pages/admin/workOrder/ViewWorkOrder";
import CustomerManagement from "./pages/admin/customer";
import CustomerForm from "./pages/admin/customer/createCustomer";
import ViewCustomer from "./pages/admin/customer/ViewWorkOrder";

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
        element: <UsersManagement />,
      },
      {
        path: "user/:id",
        element: <ViewUser />,
      },
      {
        path: "user/:id/update",
        element: <EditUser />,
      },
      {
        path: "user/new",
        element: <CreateUser />,
      },
      // department
      {
        path: "department",
        element: <DepartmentsManagement />,
      },
      {
        path: "department/:id/update",
        element: <EditDepartment />,
      },
      {
        path: "department/:id",
        element: <ViewDepartment />,
      },
      {
        path: "work-order",
        element: <WorkOrderManagement />,
      },
       {
        path: "customer",
        element: <CustomerManagement />,
      },
      {
        path: "work-order/new",
        element: <CreateWorkOrder />,
      },
      {
        path: "work-order/update/:id",
        element: <CreateWorkOrder />,
      },
      {
        path: "work-order/:id",
        element: <ViewWorkOrder />,
      },
        {
        path: "customer/new",
        element: <CustomerForm />,
      },
      {
        path: "customer/update/:id",
        element: <CustomerForm />,
      },
      {
        path: "customer/:id",
        element: <ViewCustomer />,
      },
    ],
  },
]);
