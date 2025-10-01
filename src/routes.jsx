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
    ],
  },
]);
