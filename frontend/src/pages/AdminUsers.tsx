import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, AdminUser } from '../services/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    adminService.getUsers({ search, role: roleFilter, page })
      .then((res) => { setUsers(res.results); setCount(res.count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [page, search, roleFilter])

  const handleToggleActive = async (id: string) => {
    try { await adminService.toggleUserActive(id); fetchUsers() } catch {}
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-text-primary">Foydalanuvchilar</h2>
        <p className="text-on-surface-variant font-body-md">{count} ta foydalanuvchi</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none">
          <option value="">Barchasi</option>
          <option value="CUSTOMER">Mijoz</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">ISM</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">TELEFON</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">ROLE</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">SANA</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">HOLAT</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">HARAKAT</th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                          <span className="text-on-primary-container font-bold text-xs">{u.first_name?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-text-primary font-body-md">{u.first_name} {u.last_name}</p>
                          <p className="text-[11px] text-on-surface-variant">{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-on-surface font-body-sm">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps ${u.role === 'ADMIN' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary-fixed-dim'}`}>
                        {u.role === 'ADMIN' ? 'Admin' : 'Mijoz'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-[13px]">{new Date(u.created_at).toLocaleDateString('uz-UZ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps ${u.is_active ? 'bg-primary/10 text-primary-fixed-dim' : 'bg-error/10 text-error'}`}>
                        {u.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(u.id)}
                        className={`px-3 py-1 rounded text-[11px] font-label-caps transition-colors ${u.is_active ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-primary/10 text-primary-fixed-dim hover:bg-primary/20'}`}>
                        {u.is_active ? 'Bloklash' : 'Faollashtirish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {count > 20 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t border-border-subtle">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Oldingi</button>
              <span className="text-on-surface-variant text-sm">{page} / {Math.ceil(count / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(count / 20)} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Keyingi</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
