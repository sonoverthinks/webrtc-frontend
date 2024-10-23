import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const context = useContext(AuthContext);
  const { token } = context;

  if (!token) {
    // Redirect to signin if there's no token
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
