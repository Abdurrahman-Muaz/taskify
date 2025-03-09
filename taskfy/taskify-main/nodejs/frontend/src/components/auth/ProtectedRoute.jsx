import { Navigate, useLocation } from "react-router-dom";
import TokenService from "../../API/taskifyAi/tokenService";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = TokenService.getAccessToken();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
