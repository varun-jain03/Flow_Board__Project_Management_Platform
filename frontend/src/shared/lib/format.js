export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getId(obj) {
  if (!obj) return null;
  return obj._id || obj.id || obj;
}

export const TASK_STATUSES = [
  { value: "todo", label: "To Do", color: "bg-slate-500/20 text-slate-300" },
  {
    value: "in_progress",
    label: "In Progress",
    color: "bg-amber-500/20 text-amber-300",
  },
  { value: "done", label: "Done", color: "bg-emerald-500/20 text-emerald-300" },
];

export const PRIORITIES = [
  { value: "low", label: "Low", color: "text-slate-400" },
  { value: "medium", label: "Medium", color: "text-amber-400" },
  { value: "high", label: "High", color: "text-rose-400" },
];

export const MEMBER_ROLES = ["owner", "admin", "member"];
export const ASSIGNABLE_ROLES = ["admin", "member"];

/** Roles the current user may assign when inviting someone */
export function getInviteRoles(requesterRole) {
  if (requesterRole === "owner") return ASSIGNABLE_ROLES;
  if (requesterRole === "admin") return ["member"];
  return [];
}

/** Roles the current user may set for a target member via the role dropdown */
export function getEditableRoles(requesterRole, targetRole) {
  if (requesterRole === "owner" && targetRole !== "owner") {
    return ASSIGNABLE_ROLES;
  }
  if (requesterRole === "admin" && targetRole === "member") {
    return ["member"];
  }
  return [];
}

export function canManageMembers(requesterRole) {
  return requesterRole === "owner" || requesterRole === "admin";
}

export function canRemoveMember(
  requesterRole,
  targetRole,
  targetUserId,
  currentUserId,
) {
  if (String(targetUserId) === String(currentUserId)) return false;
  if (targetRole === "owner") return false;
  if (requesterRole === "owner") return true;
  if (requesterRole === "admin" && targetRole === "member") return true;
  return false;
}

export function canTransferOwnership(
  requesterRole,
  targetRole,
  targetUserId,
  currentUserId,
) {
  return (
    requesterRole === "owner" &&
    targetRole !== "owner" &&
    String(targetUserId) !== String(currentUserId)
  );
}
