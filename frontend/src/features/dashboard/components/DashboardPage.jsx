import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { workspaceApi } from "../../workspaces/api/workspaceApi.js";
import { activityApi } from "../../activity/api/activityApi.js";
import { healthApi } from "../../health/api/healthApi.js";
import { getId, formatDateTime } from "../../../shared/lib/format.js";
import Card from "../../../shared/ui/Card.jsx";
import PageHeader from "../../../shared/ui/PageHeader.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

export default function DashboardPage() {
  const { activeOrg } = useSelector((s) => s.organizations);
  const [workspaces, setWorkspaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [wsRes, actRes, healthRes] = await Promise.all([
          workspaceApi.list(),
          activityApi.list(),
          healthApi.check(),
        ]);
        setWorkspaces(wsRes.data || []);
        setActivities((actRes.data || []).slice(0, 8));
        setHealth(healthRes);
      } catch {
        /* handled per-section */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeOrg?.id]);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const activeWorkspaces = workspaces.filter((w) => !w.isArchived);

  return (
    <div>
      <PageHeader
        title={`Welcome${activeOrg ? `, ${activeOrg.name}` : ""}`}
        subtitle="Overview of your project management workspace"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Workspaces
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {activeWorkspaces.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Your role
          </p>
          <p className="mt-2 text-3xl font-bold capitalize text-brand-400">
            {activeOrg?.role || "—"}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            API status
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300">
              {health?.status || health?.message || "Online"}
            </Badge>
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Recent activity
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {activities.length}
          </p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Workspaces</h2>
            <Link
              to="/workspaces"
              className="text-sm text-brand-400 hover:text-brand-300"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {activeWorkspaces.slice(0, 5).map((ws) => (
              <Link key={getId(ws)} to={`/workspaces/${getId(ws)}`}>
                <Card className="!p-4">
                  <p className="font-medium text-white">{ws.name}</p>
                  {ws.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                      {ws.description}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
            {!activeWorkspaces.length && (
              <p className="text-sm text-slate-500">No workspaces yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent activity
            </h2>
            <Link
              to="/activity"
              className="text-sm text-brand-400 hover:text-brand-300"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {activities.map((a) => (
              <div
                key={getId(a)}
                className="rounded-lg border border-border bg-surface-raised px-4 py-3"
              >
                <p className="text-sm text-slate-200">
                  <span className="font-mono text-xs text-brand-400">
                    {a.action}
                  </span>{" "}
                  on {a.entityType}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDateTime(a.createdAt)}
                </p>
              </div>
            ))}
            {!activities.length && (
              <p className="text-sm text-slate-500">No recent activity.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
