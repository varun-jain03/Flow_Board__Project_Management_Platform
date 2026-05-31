import { useEffect, useState } from "react";
import { activityApi } from "../api/activityApi.js";
import { formatDateTime, getId } from "../../../shared/lib/format.js";
import PageHeader from "../../../shared/ui/PageHeader.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

const entityColors = {
  workspace: "bg-blue-500/20 text-blue-300",
  board: "bg-purple-500/20 text-purple-300",
  task: "bg-emerald-500/20 text-emerald-300",
  member: "bg-amber-500/20 text-amber-300",
  organization: "bg-brand-500/20 text-brand-300",
};

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await activityApi.list();
        setActivities(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner label="Loading activity feed..." />;

  return (
    <div>
      <PageHeader
        title="Activity log"
        subtitle="Audit trail of actions across your organization"
      />

      <Alert message={error} />

      <div className="space-y-3">
        {activities.map((a) => (
          <div
            key={getId(a)}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-medium text-white">
                  {a.action}
                </span>
                <Badge
                  className={
                    entityColors[a.entityType] ||
                    "bg-slate-500/20 text-slate-300"
                  }
                >
                  {a.entityType}
                </Badge>
              </div>
              {a.metadata && Object.keys(a.metadata).length > 0 && (
                <p className="mt-1 text-xs text-slate-500 font-mono">
                  {JSON.stringify(a.metadata)}
                </p>
              )}
            </div>
            <time className="text-sm text-slate-500 whitespace-nowrap">
              {formatDateTime(a.createdAt)}
            </time>
          </div>
        ))}
        {!activities.length && (
          <p className="py-12 text-center text-slate-500">
            No activity recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}
