import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { workspaceApi } from "../api/workspaceApi.js";
import { boardApi } from "../../boards/api/boardApi.js";
import { getId } from "../../../shared/lib/format.js";
import Button from "../../../shared/ui/Button.jsx";
import Card from "../../../shared/ui/Card.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Textarea from "../../../shared/ui/Textarea.jsx";
import Modal, { ModalActions } from "../../../shared/ui/Modal.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import Alert from "../../../shared/ui/Alert.jsx";

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [wsRes, boardsRes] = await Promise.all([
        workspaceApi.getOne(workspaceId),
        boardApi.list(workspaceId),
      ]);
      setWorkspace(wsRes.data);
      setEditForm({
        name: wsRes.data.name,
        description: wsRes.data.description || "",
      });
      setBoards(boardsRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [workspaceId]);

  const handleUpdateWorkspace = async () => {
    setSaving(true);
    try {
      await workspaceApi.update(workspaceId, editForm);
      setEditOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBoard = async () => {
    setSaving(true);
    try {
      await boardApi.create({ ...form, workspaceId });
      setModalOpen(false);
      setForm({ name: "", description: "" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (!workspace) return <Alert message={error || "Workspace not found"} />;

  const activeBoards = boards.filter((b) => !b.isArchived);

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/workspaces"
          className="text-sm text-slate-400 hover:text-brand-400"
        >
          ← Workspaces
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{workspace.name}</h1>
            {workspace.description && (
              <p className="mt-2 text-slate-400">{workspace.description}</p>
            )}
          </div>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit workspace
          </Button>
        </div>
      </div>

      <Alert message={error} onClose={() => setError(null)} />

      <div className="mb-6 flex justify-between">
        <h2 className="text-lg font-semibold text-white">Boards</h2>
        <Button onClick={() => setModalOpen(true)}>+ New board</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeBoards.map((board) => (
          <Link
            key={getId(board)}
            to={`/workspaces/${workspaceId}/boards/${getId(board)}`}
          >
            <Card className="h-full hover:border-brand-500/50">
              <h3 className="font-semibold text-white">{board.name}</h3>
              {board.description && (
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                  {board.description}
                </p>
              )}
            </Card>
          </Link>
        ))}
        {!activeBoards.length && (
          <p className="col-span-full text-sm text-slate-500">
            No boards yet. Create one to add tasks.
          </p>
        )}
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit workspace"
        footer={
          <ModalActions
            onCancel={() => setEditOpen(false)}
            onConfirm={handleUpdateWorkspace}
            loading={saving}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          />
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create board"
        footer={
          <ModalActions
            onCancel={() => setModalOpen(false)}
            onConfirm={handleCreateBoard}
            loading={saving}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Board name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
