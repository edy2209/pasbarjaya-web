'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Swords, 
  MessageSquare, 
  Users, 
  Cloud, 
  Plus, 
  ArrowRight, 
  Shield,
  CheckCircle2,
  Clock,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalHighlights: number;
  totalFeedback: number;
  pendingFeedback: number;
  totalAdmins: number;
  recentHighlights: Array<{ _id: string; title: string; attackerName: string; attackerTownHall: number; defenderName: string; type: string }>;
  recentFeedback: Array<{ _id: string; senderName: string; message: string; category: string; status: string; createdAt: string }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [eventsRes, highlightsRes, feedbackRes, adminsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/highlights'),
        fetch('/api/feedback'),
        fetch('/api/admin-users'),
      ]);

      const [eventsData, highlightsData, feedbackData, adminsData] = await Promise.all([
        eventsRes.json(),
        highlightsRes.json(),
        feedbackRes.json(),
        adminsRes.json(),
      ]);

      const events = eventsData.success ? eventsData.events : [];
      const highlights = highlightsData.success ? highlightsData.highlights : [];
      const feedbacks = feedbackData.success ? feedbackData.feedbacks : [];
      const admins = adminsData.success ? adminsData.admins : [];

      setStats({
        totalEvents: events.length,
        activeEvents: events.filter((e: { status: string }) => e.status === 'active').length,
        totalHighlights: highlights.length,
        totalFeedback: feedbacks.length,
        pendingFeedback: feedbacks.filter((f: { status: string }) => f.status === 'pending').length,
        totalAdmins: admins.length,
        recentHighlights: highlights.slice(0, 3),
        recentFeedback: feedbacks.slice(0, 4),
      });
    } catch {
      setError('Gagal memuat data dashboard. Periksa koneksi MongoDB.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Control Center
          </span>
          <h1 className="font-coc-heading text-2xl sm:text-3xl font-black text-white mt-1">
            Dashboard Pengurus PASBARJAYA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data real-time dari MongoDB Atlas • Supercell API • Cloudflare R2
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            href="/administrator/highlights"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Highlight</span>
          </Link>
          <Link
            href="/administrator/events"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Event</span>
          </Link>
        </div>
      </div>

      {/* DB Connection Error Banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-300">{error}</p>
            <p className="text-xs text-red-400 mt-1">
              Pastikan <code className="bg-red-950 px-1 rounded">MONGODB_URI</code> di <code className="bg-red-950 px-1 rounded">.env.local</code> sudah benar dan MongoDB Atlas sudah dikoneksikan.
              Lalu buat akun admin pertama via <code className="bg-red-950 px-1 rounded">POST /api/auth/seed</code>.
            </p>
          </div>
        </div>
      )}

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Events */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Event Klan</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-coc-stat text-3xl font-extrabold text-white">
            {loading ? <span className="text-slate-600 animate-pulse">—</span> : `${stats?.totalEvents ?? 0} Event`}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {stats?.activeEvents ?? 0} Event Aktif
          </div>
        </div>

        {/* Highlights */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Highlight War</span>
            <Swords className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-coc-stat text-3xl font-extrabold text-white">
            {loading ? <span className="text-slate-600 animate-pulse">—</span> : `${stats?.totalHighlights ?? 0} Video`}
          </div>
          <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1">
            <Cloud className="w-3.5 h-3.5" /> Tersimpan di MongoDB + R2
          </div>
        </div>

        {/* Masukan Member */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Aspirasi Member</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-coc-stat text-3xl font-extrabold text-white">
            {loading ? <span className="text-slate-600 animate-pulse">—</span> : `${stats?.totalFeedback ?? 0} Masukan`}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {stats?.pendingFeedback ?? 0} Belum Ditinjau
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Akun Admin</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-coc-stat text-3xl font-extrabold text-white">
            {loading ? <span className="text-slate-600 animate-pulse">—</span> : `${stats?.totalAdmins ?? 0} Pengurus`}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" /> Sinkron via MongoDB
          </div>
        </div>

      </div>

      {/* Quick Access Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latest Highlights */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-coc-heading text-base font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" /> Highlight Terbaru
            </h3>
            <Link
              href="/administrator/highlights"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              Kelola Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-800/50 animate-pulse" />
              ))
            ) : stats?.recentHighlights.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                Belum ada highlight. <Link href="/administrator/highlights" className="text-amber-400 underline">Upload pertama</Link>
              </div>
            ) : (
              stats?.recentHighlights.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="space-y-0.5 truncate max-w-xs sm:max-w-md">
                    <div className="font-bold text-white truncate">{item.title}</div>
                    <div className="text-slate-400">
                      {item.attackerName} (TH{item.attackerTownHall}) vs {item.defenderName} • ⭐⭐⭐
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 shrink-0 ml-2">
                    {item.type?.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Feedback */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-coc-heading text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> Masukan Member Terbaru
            </h3>
            <Link
              href="/administrator/saran"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              Lihat Kotak Masuk <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
              ))
            ) : stats?.recentFeedback.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                Belum ada masukan dari member.
              </div>
            ) : (
              stats?.recentFeedback.map((saran) => (
                <div
                  key={saran._id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{saran.senderName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(saran.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-300 line-clamp-1">{saran.message}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-amber-400 font-medium capitalize">{saran.category?.replace('_', ' ')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      saran.status === 'pending' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {saran.status === 'pending' ? 'Pending' : 'Ditinjau'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* MongoDB Setup Guide - hanya tampil jika belum ada data */}
      {!loading && !error && stats && stats.totalAdmins === 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4">
          <h3 className="font-coc-heading text-base font-bold text-amber-400 flex items-center gap-2">
            <Database className="w-4 h-4" /> Setup Awal: Buat Akun Superadmin
          </h3>
          <p className="text-sm text-slate-300">
            Database MongoDB terhubung tapi belum ada akun admin. Buat akun superadmin pertama dengan mengirim request ke endpoint berikut:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-slate-300 space-y-2">
            <p className="text-emerald-400 font-bold">POST /api/auth/seed</p>
            <pre className="text-slate-300">{`{
  "username": "pasbarjaya_admin",
  "email": "admin@pasbarjaya.com",
  "password": "password_aman_kamu_di_sini"
}`}</pre>
          </div>
          <p className="text-xs text-slate-500">Endpoint ini otomatis terkunci setelah admin pertama dibuat.</p>
        </div>
      )}

    </div>
  );
}
