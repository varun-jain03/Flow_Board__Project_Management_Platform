import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./widgets/layout/ProtectedRoute.jsx";
import AppShell from "./widgets/layout/AppShell.jsx";
import AuthPage from "./features/auth/components/AuthPage.jsx";
import OrganizationsPage from "./features/organizations/components/OrganizationsPage.jsx";
import DashboardPage from "./features/dashboard/components/DashboardPage.jsx";
import WorkspacesPage from "./features/workspaces/components/WorkspacesPage.jsx";
import WorkspaceDetailPage from "./features/workspaces/components/WorkspaceDetailPage.jsx";
import BoardPage from "./features/boards/components/BoardPage.jsx";
import MembersPage from "./features/members/components/MembersPage.jsx";
import ActivityPage from "./features/activity/components/ActivityPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route
        path="/organizations"
        element={
          <ProtectedRoute>
            <OrganizationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute requireOrg>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route
          path="/workspaces/:workspaceId"
          element={<WorkspaceDetailPage />}
        />
        <Route
          path="/workspaces/:workspaceId/boards/:boardId"
          element={<BoardPage />}
        />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
