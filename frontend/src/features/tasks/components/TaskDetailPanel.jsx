import { useEffect, useState } from "react";
import { commentApi } from "../../comments/api/commentApi.js";
import { taskApi } from "../api/taskApi.js";
import {
  getId,
  TASK_STATUSES,
  PRIORITIES,
  formatDateTime,
} from "../../../shared/lib/format.js";
import Button from "../../../shared/ui/Button.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Textarea from "../../../shared/ui/Textarea.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

export default function TaskDetailPanel({
  task: initialTask,
  workspaceId,
  boardId,
  members,
  onClose,
  onUpdated,
  onDelete,
}) {
  const [task, setTask] = useState(initialTask);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const taskId = getId(initialTask);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await taskApi.getOne(workspaceId, boardId, taskId);
        setTask(res.data);
        setEditForm({
          title: res.data.title,
          description: res.data.description || "",
          status: res.data.status,
          priority: res.data.priority,
          assignedTo: getId(res.data.assignedTo) || "",
          dueDate: res.data.dueDate
            ? new Date(res.data.dueDate).toISOString().slice(0, 10)
            : "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    loadTask();
  }, [taskId, workspaceId, boardId]);

  useEffect(() => {
    async function loadComments() {
      setLoadingComments(true);
      try {
        const res = await commentApi.list(taskId);
        setComments(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingComments(false);
      }
    }
    loadComments();
  }, [taskId]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await taskApi.update(workspaceId, boardId, taskId, {
        ...editForm,
        assignedTo: editForm.assignedTo || null,
        dueDate: editForm.dueDate || null,
      });
      onUpdated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await commentApi.create({
        content: commentText,
        taskId,
        boardId,
        workspaceId,
      });
      setCommentText("");
      const res = await commentApi.list(taskId);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.remove(commentId);
      const res = await commentApi.list(taskId);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const statusMeta = TASK_STATUSES.find((s) => s.value === task?.status);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-border bg-surface-raised shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Badge className={statusMeta?.color}>{statusMeta?.label}</Badge>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <Alert message={error} onClose={() => setError(null)} />

          <div className="space-y-4">
            <Input
              label="Title"
              value={editForm.title || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
            <Textarea
              label="Description"
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Status"
                value={editForm.status || "todo"}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                options={TASK_STATUSES.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
              />
              <Select
                label="Priority"
                value={editForm.priority || "medium"}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
                options={PRIORITIES.map((p) => ({
                  value: p.value,
                  label: p.label,
                }))}
              />
            </div>
            <Select
              label="Assignee"
              value={editForm.assignedTo || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, assignedTo: e.target.value })
              }
              options={memberOptions}
            />
            <Input
              label="Due date"
              type="date"
              value={editForm.dueDate || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, dueDate: e.target.value })
              }
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} loading={saving}>
                Save changes
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Delete task
              </Button>
            </div>
          </div>

          <section>
            <h3 className="mb-3 font-semibold text-white">Comments</h3>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <Button size="sm" onClick={handleAddComment}>
                Post
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {loadingComments ? (
                <p className="text-sm text-slate-500">Loading comments...</p>
              ) : (
                comments.map((c) => (
                  <div
                    key={getId(c)}
                    className="rounded-lg border border-border bg-surface px-3 py-2"
                  >
                    <p className="text-sm text-slate-200">{c.content}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {formatDateTime(c.createdAt)}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-rose-400 hover:text-rose-300"
                        onClick={() => handleDeleteComment(getId(c))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
              {!loadingComments && !comments.length && (
                <p className="text-sm text-slate-500">No comments yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
