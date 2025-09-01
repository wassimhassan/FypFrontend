
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserFromToken, hasAnyRole } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const user = getUserFromToken();
  const loc  = useLocation();

  if (!user) {
    // not logged in → kick to login, preserve where they were going
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (!hasAnyRole(user, allowedRoles)) {
    // logged in but wrong role → send home (or a dedicated /unauthorized if you prefer)
    return <Navigate to="/" replace />;
  }

  return children;
}
