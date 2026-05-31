import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { membersApi } from "../api/membersApi.js";
import {
  getInviteRoles,
  getEditableRoles,
  canManageMembers,
  canRemoveMember,
  canTransferOwnership,
  getId,
} from "../../../shared/lib/format.js";
import { setActiveOrgRole } from "../../organizations/store/orgSlice.js";
import { storage } from "../../../shared/lib/storage.js";
import Button from "../../../shared/ui/Button.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Select from "../../../shared/ui/Select.jsx";
import Modal, { ModalActions } from "../../../shared/ui/Modal.jsx";
import PageHeader from "../../../shared/ui/PageHeader.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import Badge from "../../../shared/ui/Badge.jsx";

export default function MembersPage() {
  const dispatch = useDispatch();
  const { activeOrg } = useSelector((s) => s.organizations);
  const myRole = activeOrg?.role || storage.getActiveOrg()?.role;
  const canManage = canManageMembers(myRole);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "member" });
  const [saving, setSaving] = useState(false);

  const inviteRoles = getInviteRoles(myRole);

  const load = async () => {
    setLoading(true);
    try {
      const res = await membersApi.list();
      setMembers(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async () => {
    setSaving(true);
    try {
      await membersApi.invite(inviteForm);
      setInviteOpen(false);
      setInviteForm({ email: "", role: "member" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await membersApi.updateRole({ userId, role });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransferOwnership = async (userId, userName) => {
    const label = userName || "this member";
    if (
      !confirm(
        `Transfer organization ownership to ${label}? You will become an admin.`,
      )
    ) {
      return;
    }
    try {
      const res = await membersApi.transferOwnership(userId);
      const session = res.data;
      if (session?.accessToken) {
        storage.setAccessToken(session.accessToken);
      }
      if (session?.membership?.role) {
        dispatch(setActiveOrgRole(session.membership.role));
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Remove this member from the organization?")) return;
    try {
      await membersApi.remove(userId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  const roleColors = {
    owner: "bg-brand-500/20 text-brand-300",
    admin: "bg-amber-500/20 text-amber-300",
    member: "bg-slate-500/20 text-slate-300",
  };

  const currentUserId = storage.getAccessToken()
    ? parseJwtUserId(storage.getAccessToken())
    : null;

  return (
    <div>
      <PageHeader
        title="Team members"
        subtitle="Invite and manage organization members"
        actions={
          canManage ? (
            <Button onClick={() => setInviteOpen(true)}>+ Invite member</Button>
          ) : null
        }
      />

      <Alert message={error} onClose={() => setError(null)} />

      {!canManage && (
        <p className="mb-4 text-sm text-slate-500">
          You have read-only access. Owners and admins can invite and manage
          members.
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="border-b border-border bg-surface-raised text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              {canManage && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const user = m.userId || m.user;
              const userId = getId(user);
              const editableRoles = getEditableRoles(myRole, m.role);
              const showRoleSelect = editableRoles.length > 1;
              const showTransfer = canTransferOwnership(
                myRole,
                m.role,
                userId,
                currentUserId,
              );
              const showRemove = canRemoveMember(
                myRole,
                m.role,
                userId,
                currentUserId,
              );
              const hasActions = showRoleSelect || showTransfer || showRemove;

              return (
                <tr
                  key={userId || getId(m)}
                  className="border-b border-border/50 hover:bg-surface-raised/50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">
                      {user?.name || "—"}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={roleColors[m.role] || roleColors.member}>
                      {m.role}
                    </Badge>
                  </td>
                  {canManage && (
                    <td className="px-4 py-3">
                      {!hasActions ? (
                        <span className="text-xs text-slate-500">—</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {showRoleSelect && (
                            <select
                              className="rounded border border-border bg-surface px-2 py-1 text-xs text-slate-300"
                              value={m.role}
                              onChange={(e) =>
                                handleRoleChange(userId, e.target.value)
                              }
                            >
                              {editableRoles.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          )}
                          {showTransfer && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleTransferOwnership(
                                  userId,
                                  user?.name || user?.email,
                                )
                              }
                            >
                              Make owner
                            </Button>
                          )}
                          {showRemove && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleRemove(userId)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!members.length && (
          <p className="p-8 text-center text-slate-500">No members found.</p>
        )}
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite member"
        footer={
          <ModalActions
            onCancel={() => setInviteOpen(false)}
            onConfirm={handleInvite}
            confirmLabel="Send invite"
            loading={saving}
          />
        }
      >
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={inviteForm.email}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, email: e.target.value })
            }
            placeholder="colleague@company.com"
          />
          <Select
            label="Role"
            value={inviteForm.role}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, role: e.target.value })
            }
            options={inviteRoles.map((r) => ({
              value: r,
              label: r.charAt(0).toUpperCase() + r.slice(1),
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}

function parseJwtUserId(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}
