export const ROLE_META = {
  admin: { label: 'Admin', badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800' },
  staff: { label: 'Nhân viên', badgeClass: 'bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
}

export function getRoleMeta(role) {
  return ROLE_META[role] || { label: role || '(không rõ)', badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
}
