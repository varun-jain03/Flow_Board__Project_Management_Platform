import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { boardApi } from "../api/boardApi.js";
import { taskApi } from "../../tasks/api/taskApi.js";
import { membersApi } from "../../members/api/membersApi.js";
import TaskDetailPanel from "../../tasks/components/TaskDetailPanel.jsx";
import {
  getId,
  TASK_STATUSES,
  PRIORITIES,
  formatDate,
} from "../../../shared/lib/format.js";
import Button from "../../../shared/ui/Button.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Textarea from "../../../shared/ui/Textarea.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Modal, { ModalActions } from "../../../shared/ui/Modal.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

export default function BoardPage() {
  const { workspaceId, boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [boardRes, tasksRes, membersRes] = await Promise.all([
        boardApi.getOne(workspaceId, boardId),
        taskApi.list(workspaceId, boardId, { limit: 100 }),
        membersApi.list().catch(() => ({ data: [] })),
      ]);
      setBoard(boardRes.data);
      const taskData = tasksRes.data;
      setTasks(taskData?.tasks || taskData || []);
      setMembers(membersRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [workspaceId, boardId]);

  const handleCreateTask = async () => {
    setSaving(true);
    try {
      await taskApi.create({
        ...form,
        boardId,
        workspaceId,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      setCreateOpen(false);
      setForm({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await taskApi.update(workspaceId, boardId, getId(task), {
        status: newStatus,
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await taskApi.remove(workspaceId, boardId, taskId);
      setSelectedTask(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const memberOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => {
      const user = m.userId || m.user;
      return {
        value: getId(user),
        label: user?.name || user?.email || "Member",
      };
    }),
  ];

  if (loading) return <Spinner />;

  const tasksByStatus = TASK_STATUSES.reduce((acc, s) => {
    acc[s.value] = tasks.filter((t) => t.status === s.value);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/workspaces/${workspaceId}`}
          className="text-sm text-slate-400 hover:text-brand-400"
        >
          ← Back to workspace
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {board?.name}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                const name = prompt("Board name", board?.name);
                if (!name) return;
                try {
                  await boardApi.update(workspaceId, boardId, { name });
                  await load();
                } catch (err) {
                  setError(err.message);
                }
              }}
            >
              Edit board
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await boardApi.archive(workspaceId, boardId, true);
                  window.location.href = `/workspaces/${workspaceId}`;
                } catch (err) {
                  setError(err.message);
                }
              }}
            >
              Archive
            </Button>
            <Button onClick={() => setCreateOpen(true)}>+ Add task</Button>
          </div>
        </div>
      </div>

      <Alert message={error} onClose={() => setError(null)} />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((col) => (
          <div
            key={col.value}
            className="min-w-[280px] flex-1 rounded-xl border border-border bg-surface-raised/50 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-300">
                {col.label}
              </h3>
              <Badge className={col.color}>
                {tasksByStatus[col.value]?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {(tasksByStatus[col.value] || []).map((task) => {
                const priority = PRIORITIES.find(
                  (p) => p.value === task.priority,
                );
                return (
                  <div
                    key={getId(task)}
                    className="cursor-pointer rounded-lg border border-border bg-surface p-3 transition hover:border-brand-500/40"
                    onClick={() => setSelectedTask(task)}
                  >
                    <p className="font-medium text-white">{task.title}</p>
                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`text-xs ${priority?.color}`}>
                        {priority?.label}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-slate-500">
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                    <select
                      className="mt-2 w-full rounded border border-border bg-surface-overlay px-2 py-1 text-xs text-slate-300"
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      {TASK_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          workspaceId={workspaceId}
          boardId={boardId}
          members={members}
          onClose={() => setSelectedTask(null)}
          onUpdated={load}
          onDelete={() => handleDeleteTask(getId(selectedTask))}
        />
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create task"
        footer={
          <ModalActions
            onCancel={() => setCreateOpen(false)}
            onConfirm={handleCreateTask}
            loading={saving}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={TASK_STATUSES.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={PRIORITIES.map((p) => ({
                value: p.value,
                label: p.label,
              }))}
            />
          </div>
          <Select
            label="Assign to"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            options={memberOptions}
          />
          <Input
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
