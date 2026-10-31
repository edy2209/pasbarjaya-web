'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, Plus, Trash2, Edit3, CheckCircle2, Clock, X,
  Save, Loader2, AlertCircle, RefreshCw, Trophy, Users
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface EventParticipant {
  rank: number;
  playerTag: string;
  playerName: string;
  score: number;
  starsEarned: number;
  attacksUsed: number;
  avatar: string;
}

interface ClanEvent {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: 'upcoming' | 'active' | 'ended';
  startDate: string;
  endDate: string;
  prizePool: string;
  rules: string[];
  participants: EventParticipant[];
  createdAt: string;
}

const emptyForm = {
  title: '',
  description: '',
  type: 'custom',
  status: 'upcoming' as 'upcoming' | 'active' | 'ended',
  startDate: '',
  endDate: '',
  prizePool: '',
  rules: [''],
  participants: [] as EventParticipant[],
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  upcoming: { label: 'Akan Datang', color: 'bg-sky-950 text-sky-300 border-sky-700', icon: <Clock className="w-3 h-3" /> },
  active: { label: 'Aktif', color: 'bg-emerald-950 text-emerald-300 border-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> },
  ended: { label: 'Selesai', color: 'bg-slate-800 text-slate-400 border-slate-700', icon: <Trophy className="w-3 h-3" /> },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClanEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  // Participant form state
  const [newParticipant, setNewParticipant] = useState({ playerName: '', playerTag: '', score: 0, starsEarned: 0, attacksUsed: 0, avatar: '' });
  const [editingParticipantIdx, setEditingParticipantIdx] = useState<number | null>(null);
  const [editParticipantData, setEditParticipantData] = useState({ score: 0, starsEarned: 0, attacksUsed: 0, playerName: '', playerTag: '' });

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus !== 'all' ? `/api/events?status=${filterStatus}` : '/api/events';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch {
      showToast('error', 'Gagal memuat data event');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleEdit = (ev: ClanEvent) => {
    setForm({
      title: ev.title,
      description: ev.description,
      type: ev.type,
      status: ev.status,
      startDate: ev.startDate,
      endDate: ev.endDate,
      prizePool: ev.prizePool,
      rules: ev.rules.length > 0 ? ev.rules : [''],
      participants: ev.participants || [],
    });
    setEditingId(ev._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus event ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Event berhasil dihapus');
        fetchEvents();
      } else showToast('error', data.error || 'Gagal menghapus');
    } catch {
      showToast('error', 'Gagal menghapus event');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.startDate || !form.endDate) {
      showToast('error', 'Judul, tanggal mulai, dan tanggal selesai wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        rules: form.rules.filter(r => r.trim() !== ''),
        participants: form.participants.map((p, i) => ({ ...p, rank: i + 1 })),
      };
      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', editingId ? 'Event berhasil diperbarui!' : 'Event berhasil dibuat!');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchEvents();
      } else showToast('error', data.error || 'Gagal menyimpan event');
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => setForm(p => ({ ...p, rules: [...p.rules, ''] }));
  const updateRule = (i: number, val: string) => setForm(p => { const r = [...p.rules]; r[i] = val; return { ...p, rules: r }; });
  const removeRule = (i: number) => setForm(p => ({ ...p, rules: p.rules.filter((_, idx) => idx !== i) }));

  const addParticipant = () => {
    if (!newParticipant.playerName) return;
    setForm(p => ({
      ...p,
      participants: [...p.participants, { ...newParticipant, rank: p.participants.length + 1 }],
    }));
    setNewParticipant({ playerName: '', playerTag: '', score: 0, starsEarned: 0, attacksUsed: 0, avatar: '' });
  };

  const removeParticipant = (i: number) => setForm(p => ({ ...p, participants: p.participants.filter((_, idx) => idx !== i) }));

  const startEditParticipant = (i: number) => {
    const p = form.participants[i];
    setEditParticipantData({ score: p.score, starsEarned: p.starsEarned || 0, attacksUsed: p.attacksUsed || 0, playerName: p.playerName, playerTag: p.playerTag });
    setEditingParticipantIdx(i);
  };

  const saveEditParticipant = (i: number) => {
    setForm(p => {
      const updated = [...p.participants];
      updated[i] = { ...updated[i], ...editParticipantData };
      return { ...p, participants: updated };
    });
    setEditingParticipantIdx(null);
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
            <Calendar className="w-6 h-6 text-amber-400" /> Kelola Event Klan
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Buat, edit, dan kelola event PASBARJAYA • Data tersimpan di MongoDB
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchEvents}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Event Baru
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'upcoming', 'active', 'ended'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              filterStatus === s
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{events.length} event</span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0c1017] border border-slate-700 rounded-3xl shadow-2xl mb-8">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-800 bg-[#0c1017] z-10 rounded-t-3xl">
              <h2 className="font-coc-heading text-lg font-bold text-white">
                {editingId ? 'Edit Event' : 'Buat Event Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Event *</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="cth: War Donation Championship Oktober 2026"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe Event</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60">
                    <option value="donation">Donasi</option>
                    <option value="war_stars">Bintang War</option>
                    <option value="trophies">Trofi</option>
                    <option value="raids">Raid Capital</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'upcoming' | 'active' | 'ended' }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60">
                    <option value="upcoming">Akan Datang</option>
                    <option value="active">Aktif</option>
                    <option value="ended">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Mulai *</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Selesai *</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Event</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3} placeholder="Ceritakan event ini..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60 resize-none" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hadiah / Prize Pool</label>
                  <input type="text" value={form.prizePool} onChange={e => setForm(p => ({ ...p, prizePool: e.target.value }))}
                    placeholder="cth: Apresiasi dari Leader + Gems"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60" />
                </div>
              </div>

              {/* Rules */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peraturan Event</label>
                  <button onClick={addRule} className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Tambah Aturan
                  </button>
                </div>
                {form.rules.map((rule, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={rule} onChange={e => updateRule(i, e.target.value)}
                      placeholder={`Aturan ${i + 1}...`}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60" />
                    <button onClick={() => removeRule(i)} className="p-2.5 rounded-xl bg-slate-800 text-slate-500 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Participants */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Leaderboard Peserta ({form.participants.length})</label>
                {form.participants.map((p, i) => (
                  <div key={i} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    {editingParticipantIdx === i ? (
                      /* ── EDIT MODE ROW ── */
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">✏️ Edit Peserta #{i + 1}</span>
                          <button onClick={() => setEditingParticipantIdx(null)} className="text-slate-500 hover:text-white p-1"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Nama Player</label>
                            <input type="text" value={editParticipantData.playerName}
                              onChange={e => setEditParticipantData(d => ({ ...d, playerName: e.target.value }))}
                              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500/60" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">Tag Player</label>
                            <input type="text" value={editParticipantData.playerTag}
                              onChange={e => setEditParticipantData(d => ({ ...d, playerTag: e.target.value }))}
                              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500/60" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">⭐ Bintang</label>
                            <input type="number" min={0} value={editParticipantData.starsEarned}
                              onChange={e => setEditParticipantData(d => ({ ...d, starsEarned: +e.target.value }))}
                              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500/60" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">🗡️ Serangan</label>
                            <input type="number" min={0} value={editParticipantData.attacksUsed}
                              onChange={e => setEditParticipantData(d => ({ ...d, attacksUsed: +e.target.value }))}
                              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500/60" />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <label className="text-[10px] text-slate-400 font-semibold uppercase">🏆 Skor / Poin</label>
                            <input type="number" min={0} value={editParticipantData.score}
                              onChange={e => setEditParticipantData(d => ({ ...d, score: +e.target.value }))}
                              className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500/60" />
                          </div>
                        </div>
                        <button onClick={() => saveEditParticipant(i)}
                          className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors">
                          <Save className="w-3.5 h-3.5" /> Simpan Perubahan
                        </button>
                      </div>
                    ) : (
                      /* ── VIEW MODE ROW ── */
                      <div className="flex items-center gap-2 p-3 text-xs">
                        <span className="font-coc-stat font-bold text-amber-400 w-6 text-center">#{i + 1}</span>
                        <span className="font-bold text-white flex-1 truncate">{p.playerName}</span>
                        {p.playerTag && <span className="text-amber-400 font-mono hidden sm:block">{p.playerTag}</span>}
                        <span className="text-slate-400">⭐{p.starsEarned ?? 0}</span>
                        <span className="text-slate-400">{p.attacksUsed ?? 0}🗡️</span>
                        <span suppressHydrationWarning className="text-emerald-400 font-bold">{formatNumber(p.score)}</span>
                        <button onClick={() => startEditParticipant(i)} className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors" title="Edit peserta">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeParticipant(i)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors" title="Hapus peserta">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {/* Input form tambah peserta dengan label */}
                <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tambah Peserta Baru</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nama Player *</label>
                      <input type="text" value={newParticipant.playerName} onChange={e => setNewParticipant(p => ({ ...p, playerName: e.target.value }))}
                        placeholder="cth: Budi Santoso"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/60" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tag Player</label>
                      <input type="text" value={newParticipant.playerTag} onChange={e => setNewParticipant(p => ({ ...p, playerTag: e.target.value }))}
                        placeholder="cth: #ABC123XY"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/60" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">⭐ Bintang Diraih</label>
                      <input type="number" min={0} max={99} value={newParticipant.starsEarned} onChange={e => setNewParticipant(p => ({ ...p, starsEarned: +e.target.value }))}
                        placeholder="cth: 6"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/60" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">🗡️ Serangan Digunakan</label>
                      <input type="number" min={0} max={99} value={newParticipant.attacksUsed} onChange={e => setNewParticipant(p => ({ ...p, attacksUsed: +e.target.value }))}
                        placeholder="cth: 2"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/60" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">🏆 Skor / Poin Total</label>
                      <input type="number" min={0} value={newParticipant.score} onChange={e => setNewParticipant(p => ({ ...p, score: +e.target.value }))}
                        placeholder="cth: 1500"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/60" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={addParticipant} className="w-full px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-300 font-bold transition-colors flex items-center justify-center gap-2 text-xs">
                        <Plus className="w-4 h-4" /> Tambahkan ke Leaderboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-colors disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Menyimpan...' : editingId ? 'Perbarui Event' : 'Simpan Event'}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-900/60 animate-pulse" />)
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-800" />
            <p className="font-bold text-slate-400">Belum ada event.</p>
            <p className="text-sm mt-1">Buat event pertama untuk PASBARJAYA!</p>
          </div>
        ) : (
          events.map((ev) => {
            const statusInfo = STATUS_CONFIG[ev.status];
            return (
              <div key={ev._id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{ev.title}</span>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo?.color}`}>
                      {statusInfo?.icon} {statusInfo?.label}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                      {ev.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ev.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>{ev.startDate} → {ev.endDate}</span>
                    {ev.prizePool && <span className="text-amber-400 font-semibold">{ev.prizePool}</span>}
                    {ev.participants?.length > 0 && (
                      <span className="flex items-center gap-1 text-purple-400">
                        <Users className="w-3 h-3" /> {ev.participants.length} peserta
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleEdit(ev)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(ev._id)} disabled={deleting === ev._id}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50">
                    {deleting === ev._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
