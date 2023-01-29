import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAppStore();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};
