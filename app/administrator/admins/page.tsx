'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, RefreshCw, Loader2, X, Eye, EyeOff, Crown
} from 'lucide-react';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'superadmin' | 'admin',
    isActive: true,
  });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-users');
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch {
      showToast('error', 'Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleEdit = (admin: AdminUser) => {
    setForm({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role,
      isActive: admin.isActive,
    });
    setEditingId(admin._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Yakin hapus akun admin "${username}"?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin-users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Akun admin berhasil dihapus');
        fetchAdmins();
      } else showToast('error', data.error || 'Gagal menghapus');
    } catch {
      showToast('error', 'Gagal menghapus akun admin');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!form.username || !form.email) {
      showToast('error', 'Username dan email wajib diisi');
      return;
    }
    if (!editingId && !form.password) {
      showToast('error', 'Password wajib diisi untuk akun baru');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Update existing - only send changed fields (not password unless specified)
        const updatePayload: Record<string, unknown> = {
          username: form.username,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
        };
        const res = await fetch(`/api/admin-users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', 'Akun admin berhasil diperbarui!');
          setShowForm(false); setEditingId(null);
          setForm({ username: '', email: '', password: '', role: 'admin', isActive: true });
          fetchAdmins();
        } else showToast('error', data.error || 'Gagal memperbarui');
      } else {
        // Create new
        const res = await fetch('/api/admin-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          showToast('success', 'Akun admin baru berhasil dibuat!');
          setShowForm(false);
          setForm({ username: '', email: '', password: '', role: 'admin', isActive: true });
          fetchAdmins();
        } else showToast('error', data.error || 'Gagal membuat akun');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' : 'bg-red-950 border-red-500/40 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-coc-heading text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Kelola Akun Admin
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {admins.length} akun terdaftar • Tersimpan di MongoDB Atlas
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAdmins}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ username: '', email: '', password: '', role: 'admin', isActive: true }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Admin
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300">
        <p className="font-bold mb-1">💡 Cara setup akun pertama:</p>
        <p>Kirim <code className="bg-amber-950 px-1 rounded">POST /api/auth/seed</code> dengan body: username, email, password. Endpoint akan terkunci setelah admin pertama dibuat.</p>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1017] border border-slate-700 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="font-coc-heading text-lg font-bold text-white">
                {editingId ? 'Edit Akun Admin' : 'Tambah Admin Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username *</label>
                <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  placeholder="pasbarjaya_admin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@pasbarjaya.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60" />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as 'superadmin' | 'admin' }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60">
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-semibold text-slate-300">Akun Aktif</span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-colors disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : editingId ? 'Perbarui Akun' : 'Buat Akun Admin'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admins List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-900/60 animate-pulse" />)
        ) : admins.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 mx-auto mb-4 text-slate-800" />
            <p className="font-bold text-slate-400">Belum ada akun admin.</p>
            <p className="text-sm text-slate-500 mt-1">Buat akun pertama via POST /api/auth/seed</p>
          </div>
        ) : (
          admins.map((admin) => (
            <div key={admin._id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                admin.role === 'superadmin' ? 'bg-amber-500/20 border-2 border-amber-500/40' : 'bg-slate-800 border border-slate-700'
              }`}>
                {admin.role === 'superadmin' ? (
                  <Crown className="w-6 h-6 text-amber-400" />
                ) : (
                  <Shield className="w-6 h-6 text-emerald-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">{admin.username}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    admin.role === 'superadmin'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {admin.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    admin.isActive
                      ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
                      : 'bg-red-950/50 text-red-400 border-red-800'
                  }`}>
                    {admin.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{admin.email}</p>
                <p className="text-[11px] text-slate-600">
                  Dibuat: {new Date(admin.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  {admin.lastLogin && ` • Login terakhir: ${new Date(admin.lastLogin).toLocaleDateString('id-ID', { dateStyle: 'medium' })}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(admin)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(admin._id, admin.username)} disabled={deleting === admin._id}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50">
                  {deleting === admin._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
