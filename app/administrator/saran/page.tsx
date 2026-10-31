'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, CheckCircle2, XCircle, Clock, Loader2,
  AlertCircle, RefreshCw, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';

interface Feedback {
  _id: string;
  senderName: string;
  playerTag: string;
  category: string;
  message: string;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  adminNote: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-amber-950 text-amber-300 border-amber-700' },
  reviewed: { label: 'Ditinjau', color: 'bg-blue-950 text-blue-300 border-blue-700' },
  implemented: { label: 'Diterapkan', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
  rejected: { label: 'Ditolak', color: 'bg-red-950 text-red-300 border-red-700' },
};

const CATEGORY_LABELS: Record<string, string> = {
  war_strategy: 'Strategi War',
  war: 'Strategi War',
  donation: 'Donasi',
  donasi: 'Donasi',
  rules: 'Peraturan',
  general: 'Umum',
  umum: 'Umum',
  event: 'Event Klan',
  other: 'Lainnya',
};

export default function AdminSaranPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus !== 'all' ? `/api/feedback?status=${filterStatus}` : '/api/feedback';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
        // Pre-fill admin notes
        const notes: Record<string, string> = {};
        data.feedbacks.forEach((f: Feedback) => { notes[f._id] = f.adminNote || ''; });
        setEditNote(notes);
      }
    } catch {
      showToast('error', 'Gagal memuat data saran');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleUpdate = async (id: string, status: string) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: editNote[id] || '' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Status berhasil diperbarui');
        fetchFeedback();
        setExpandedId(null);
      } else {
        showToast('error', data.error || 'Gagal memperbarui');
      }
    } catch {
      showToast('error', 'Gagal memperbarui status');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus masukan ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Masukan berhasil dihapus');
        fetchFeedback();
      } else {
        showToast('error', 'Gagal menghapus');
      }
    } catch {
      showToast('error', 'Gagal menghapus masukan');
    } finally {
      setDeleting(null);
    }
  };

  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;

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
            <MessageSquare className="w-6 h-6 text-purple-400" /> Kotak Masukan & Saran
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {pendingCount > 0 ? (
              <span className="text-amber-400 font-semibold">{pendingCount} masukan belum ditinjau</span>
            ) : 'Semua masukan sudah ditinjau'} • {feedbacks.length} total
          </p>
        </div>
        <button
          onClick={fetchFeedback}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'pending', 'reviewed', 'implemented', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              filterStatus === s
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {s === 'all' ? 'Semua' : STATUS_LABELS[s]?.label}
            {s === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-900/60 animate-pulse" />
          ))
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-800" />
            <p className="font-bold text-slate-400">Tidak ada masukan untuk filter ini.</p>
          </div>
        ) : (
          feedbacks.map((fb) => {
            const isExpanded = expandedId === fb._id;
            const statusInfo = STATUS_LABELS[fb.status] || STATUS_LABELS.pending;

            return (
              <div key={fb._id} className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors overflow-hidden">
                {/* Summary Row */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : fb._id)}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{fb.senderName}</span>
                      {fb.playerTag && <span className="text-xs text-amber-400 font-mono">{fb.playerTag}</span>}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {CATEGORY_LABELS[fb.category] || fb.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{fb.message}</p>
                    <span className="text-[11px] text-slate-600">
                      {new Date(fb.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })} •{' '}
                      {new Date(fb.createdAt).toLocaleTimeString('id-ID', { timeStyle: 'short' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(fb._id); }}
                      disabled={deleting === fb._id}
                      className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    >
                      {deleting === fb._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-4 pb-5 border-t border-slate-800 pt-4 space-y-4">
                    {/* Full message */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{fb.message}</p>
                    </div>

                    {/* Admin Note */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Catatan Admin (opsional)
                      </label>
                      <textarea
                        value={editNote[fb._id] || ''}
                        onChange={e => setEditNote(prev => ({ ...prev, [fb._id]: e.target.value }))}
                        rows={2}
                        placeholder="Tulis respons atau tindak lanjut di sini..."
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60 resize-none"
                      />
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Ubah Status:</span>
                      {(['reviewed', 'implemented', 'rejected'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleUpdate(fb._id, s)}
                          disabled={saving === fb._id || fb.status === s}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-40 ${
                            s === 'implemented'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                              : s === 'rejected'
                              ? 'bg-red-950 text-red-300 border-red-700 hover:bg-red-900'
                              : 'bg-blue-950 text-blue-300 border-blue-700 hover:bg-blue-900'
                          }`}
                        >
                          {saving === fb._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : s === 'implemented' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : s === 'rejected' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {STATUS_LABELS[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
