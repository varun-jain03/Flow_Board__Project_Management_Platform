import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createOrganization,
  fetchOrganizations,
  switchOrganization,
} from "../store/orgSlice.js";
import { getId } from "../../../shared/lib/format.js";
import Button from "../../../shared/ui/Button.jsx";
import Card from "../../../shared/ui/Card.jsx";
import Input from "../../../shared/ui/Input.jsx";
import Modal, { ModalActions } from "../../../shared/ui/Modal.jsx";
import Spinner from "../../../shared/ui/Spinner.jsx";
import EmptyState from "../../../shared/ui/EmptyState.jsx";
import Alert from "../../../shared/ui/Alert.jsx";
import PageHeader from "../../../shared/ui/PageHeader.jsx";

export default function OrganizationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.organizations);
  const [createOpen, setCreateOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [switching, setSwitching] = useState(null);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleCreate = async () => {
    const result = await dispatch(createOrganization({ name: orgName }));
    if (createOrganization.fulfilled.match(result)) {
      setCreateOpen(false);
      setOrgName("");
      dispatch(fetchOrganizations());
    }
  };

  const handleSelect = async (orgId) => {
    setSwitching(orgId);
    const result = await dispatch(switchOrganization(orgId));
    setSwitching(null);
    if (switchOrganization.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const getOrgFromMembership = (m) => {
    const org = m.organizationId || m.org;
    return {
      id: getId(org),
      name: org?.name || "Organization",
      role: m.role,
    };
  };

  if (loading && !list.length)
    return <Spinner label="Loading organizations..." />;

  return (
    <div className="mx-auto max-w-3xl py-8">
      <PageHeader
        title="Your organizations"
        subtitle="Select an organization to continue or create a new one"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            + New organization
          </Button>
        }
      />

      <Alert message={error} type="error" />

      {!list?.length ? (
        <EmptyState
          icon="🏢"
          title="No organizations yet"
          description="Create your first organization to start managing projects."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              Create organization
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((membership) => {
            const org = getOrgFromMembership(membership);
            return (
              <Card
                key={org.id}
                onClick={() => handleSelect(org.id)}
                className="group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-brand-300">
                      {org.name}
                    </h3>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {org.role}
                    </p>
                  </div>
                  {switching === org.id ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
                  ) : (
                    <span className="text-brand-400 opacity-0 transition group-hover:opacity-100">
                      →
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create organization"
        footer={
          <ModalActions
            onCancel={() => setCreateOpen(false)}
            onConfirm={handleCreate}
            confirmLabel="Create"
            loading={loading}
          />
        }
      >
        <Input
          label="Organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Inc."
          autoFocus
        />
      </Modal>
    </div>
  );
}
