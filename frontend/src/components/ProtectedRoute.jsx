import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // 🚫 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their own dashboard
    const redirectPath =
      user.role === "Admin"
        ? "/admin"
        : user.role === "Teacher"
        ? "/teacher"
        : "/student";
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
