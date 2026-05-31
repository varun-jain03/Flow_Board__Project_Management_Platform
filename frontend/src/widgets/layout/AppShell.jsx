import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/store/authSlice.js";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "◫" },
  { to: "/workspaces", label: "Workspaces", icon: "▣" },
  { to: "/members", label: "Team", icon: "◎" },
  { to: "/activity", label: "Activity", icon: "↻" },
];

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeOrg } = useSelector((s) => s.organizations);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-brand-600/20 text-brand-300"
        : "text-slate-400 hover:bg-surface-overlay hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface-raised transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">
            F
          </span>
          <div>
            <p className="font-semibold text-white">FlowBoard</p>
            <p className="text-xs text-slate-500">Project Management</p>
          </div>
        </div>

        {activeOrg && (
          <div className="mx-4 mt-4 rounded-lg border border-border bg-surface px-3 py-2.5">
            <p className="text-xs text-slate-500">Organization</p>
            <p className="truncate text-sm font-medium text-white">
              {activeOrg.name}
            </p>
            <p className="text-xs capitalize text-brand-400">
              {activeOrg.role}
            </p>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-base opacity-70">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border p-4">
          <Link
            to="/organizations"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-surface-overlay hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ⇄ Switch org
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10"
          >
            ⎋ Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-surface-overlay lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
