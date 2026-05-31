import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { workspaceApi } from "../api/workspaceApi.js";
import { getId } from "../../../shared/lib/format.js";
import Button from "../../../shared/ui/Button.jsx";
import Card from "../../../shared/ui/Card.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Textarea from "../../../shared/ui/Textarea.jsx";
import Modal, { ModalActions } from "../../../shared/ui/Modal.jsx";
import PageHeader from "../../../shared/ui/PageHeader.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import EmptyState from "../../../shared/ui/EmptyState.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await workspaceApi.list();
      setWorkspaces(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await workspaceApi.create(form);
      setModalOpen(false);
      setForm({ name: "", description: "" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (ws, isArchived) => {
    try {
      await workspaceApi.archive(getId(ws), isArchived);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (ws) => {
    if (!confirm(`Delete workspace "${ws.name}"?`)) return;
    try {
      await workspaceApi.remove(getId(ws));
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  const active = workspaces.filter((w) => !w.isArchived);
  const archived = workspaces.filter((w) => w.isArchived);

  return (
    <div>
      <PageHeader
        title="Workspaces"
        subtitle="Organize projects into dedicated workspaces"
        actions={
          <Button onClick={() => setModalOpen(true)}>+ New workspace</Button>
        }
      />

      <Alert message={error} onClose={() => setError(null)} />

      {!active.length && !archived.length ? (
        <EmptyState
          title="No workspaces"
          description="Create a workspace to start adding boards and tasks."
          action={
            <Button onClick={() => setModalOpen(true)}>Create workspace</Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((ws) => (
              <Card key={getId(ws)}>
                <Link to={`/workspaces/${getId(ws)}`} className="block">
                  <h3 className="font-semibold text-white hover:text-brand-300">
                    {ws.name}
                  </h3>
                  {ws.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {ws.description}
                    </p>
                  )}
                </Link>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleArchive(ws, true)}
                  >
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(ws)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {archived.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-lg font-semibold text-slate-400">
                Archived
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {archived.map((ws) => (
                  <Card key={getId(ws)} className="opacity-60">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{ws.name}</h3>
                      <Badge className="bg-slate-500/20 text-slate-400">
                        Archived
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-4"
                      onClick={() => handleArchive(ws, false)}
                    >
                      Restore
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create workspace"
        footer={
          <ModalActions
            onCancel={() => setModalOpen(false)}
            onConfirm={handleCreate}
            loading={saving}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
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
