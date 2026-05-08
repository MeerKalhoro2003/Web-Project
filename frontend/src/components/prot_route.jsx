import React from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return React.createElement(
      "div",
      { className: "p-8 text-center" },
      "Loading...",
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // If specific roles are required and user doesn't have them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    window.location.href = "/dashboard";
    return null;
  }

  return children;
};

export default ProtectedRoute;
