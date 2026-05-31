import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { storage } from "../../shared/lib/storage.js";

export default function ProtectedRoute({ children, requireOrg = false }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { activeOrg } = useSelector((s) => s.organizations);
  const location = useLocation();
  const hasToken = isAuthenticated || !!storage.getAccessToken();
  const org = activeOrg || storage.getActiveOrg();

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOrg && !org?.id) {
    return <Navigate to="/organizations" replace />;
  }

  return children;
}
