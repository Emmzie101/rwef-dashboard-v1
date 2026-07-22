// Role tiers: "admin" | "lead" | "associate"
export function isAdmin(me) {
  return me?.role === "admin";
}
export function isLeadOrAdmin(me) {
  return me?.role === "admin" || me?.role === "lead";
}
export function canEditTask(me, task) {
  if (!me) return false;
  return isLeadOrAdmin(me) || task.ownerId === me.id || task.shadowId === me.id;
}
export function canDeleteTask(me, task) {
  if (!me) return false;
  if (isAdmin(me)) return true;
  return task.ownerId === me.id;
}
export function canManagePrograms(me) {
  return isLeadOrAdmin(me);
}
export function canDeleteProgram(me) {
  return isAdmin(me);
}
export function canManageMembers(me) {
  return isAdmin(me);
}
