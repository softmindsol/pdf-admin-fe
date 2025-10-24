import React from "react";
import { Navigate } from "react-router-dom";
import { getUserData } from "@/lib/auth";

const ProtectedRoute = ({ moduleName, children }) => {
  const userData = getUserData();

  if (!userData) {
    return <Navigate to="/auth/login" replace />;
  }

  const { role, allowedForms = [] } = userData;

  if (role === "admin") {
    return children;
  }

  const hasPermission = allowedForms.includes(moduleName)|| "user";

  if (hasPermission) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
