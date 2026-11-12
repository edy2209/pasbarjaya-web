'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Swords, Plus, Trash2, Edit3, Eye, Star, Upload,
  X, CheckCircle2, AlertCircle, Loader2, Film, ExternalLink
} from 'lucide-react';

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface Highlight {
  _id: string;
  title: string;
  type: 'classic' | 'cwl';
  attackerName: string;
  attackerTownHall: number;
  defenderName: string;
  defenderTownHall: number;
  stars: number;
  destructionPercent: number;
  strategy: string;
  notes: string;
  opponentClan: string;
  warDate: string;
  videoUrl: string;
  thumbnailUrl: string;
  isYoutube: boolean;
  views: number;
  featured: boolean;
  createdAt: string;
}

const emptyForm = {
  title: '',
  type: 'classic' as 'classic' | 'cwl',
  attackerName: '',
  attackerTownHall: 16,
  defenderName: '',
  defenderTownHall: 16,
  stars: 3,
  destructionPercent: 100,
  strategy: '',
  notes: '',
  opponentClan: '',
  warDate: '',
  videoUrl: '',
  thumbnailUrl: '',
  isYoutube: false,
  featured: false,
};

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function AdminHighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'classic' | 'cwl'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterType !== 'all' ? `/api/highlights?type=${filterType}` : '/api/highlights';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setHighlights(data.highlights);
    } catch {
      showToast('error', 'Gagal memuat highlight');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => { fetchHighlights(); }, [fetchHighlights]);

  const handleEdit = (h: Highlight) => {
    setForm({
      title: h.title, type: h.type,
      attackerName: h.attackerName, attackerTownHall: h.attackerTownHall,
      defenderName: h.defenderName, defenderTownHall: h.defenderTownHall,
      stars: h.stars, destructionPercent: h.destructionPercent,
      strategy: h.strategy, notes: h.notes,
      opponentClan: h.opponentClan, warDate: h.warDate,
      videoUrl: h.videoUrl, thumbnailUrl: h.thumbnailUrl,
      isYoutube: h.isYoutube, featured: h.featured,
    });
    setEditingId(h._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus highlight ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/highlights/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Highlight berhasil dihapus');
        fetchHighlights();
      } else {
        showToast('error', data.error || 'Gagal menghapus');
      }
    } catch {
      showToast('error', 'Gagal menghapus highlight');
    } finally {
      setDeleting(null);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    const isYt = url.includes('youtube.com') || url.includes('youtu.be');
    setForm(prev => ({ ...prev, videoUrl: url, isYoutube: isYt }));
    // Auto-set thumbnail for YouTube
    if (isYt) {
      const ytId = getYoutubeId(url);
      if (ytId) {
        setForm(prev => ({
          ...prev,
          videoUrl: url,
          isYoutube: true,
          thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        }));
      }
    }
  };

function extractVideoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      let captured = false;
      const capture = () => {
        if (captured) return;
        captured = true;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              URL.revokeObjectURL(objectUrl);
              resolve(blob);
            }, 'image/jpeg', 0.85);
            return;
          }
        } catch {
          // ignore
        }
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, (video.duration || 2) / 2);
      };
      video.onseeked = capture;
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };

      setTimeout(() => {
        if (!captured) {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        }
      }, 4000);
    } catch {
      resolve(null);
    }
  });
}

  const uploadDirectToR2 = (file: File | Blob, uploadUrl: string, onProgress?: (pct: number) => void): Promise<boolean> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            onProgress(pct);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          console.error('XHR Upload status error:', xhr.status, xhr.responseText);
          resolve(false);
        }
      };

      xhr.onerror = () => {
        console.error('XHR Upload network error');
        resolve(false);
      };

      xhr.send(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('video/')) {
      showToast('error', 'File harus berupa video (MP4, WebM, dll)');
      return;
    }

    setUploadingFile(true);
    setUploadProgress(5);
    try {
      let videoPublicUrl = '';

      // OPSI A: Coba Direct Presigned Upload ke Cloudflare R2
      let directSuccess = false;
      try {
        const presignRes = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            folder: 'highlights',
          }),
        });
        const presignData = await presignRes.json();

        if (presignData.success && presignData.uploadUrl) {
          const uploadOk = await uploadDirectToR2(file, presignData.uploadUrl, (pct) => {
            setUploadProgress(Math.min(85, Math.max(5, Math.round(pct * 0.85))));
          });
          if (uploadOk) {
            videoPublicUrl = presignData.publicUrl;
            directSuccess = true;
          }
        }
      } catch (directErr) {
        console.warn('Direct R2 presign upload failed, falling back to server upload...', directErr);
      }

      // OPSI B (Fallback): Jika direct upload gagal/CORS belum diatur di R2, upload via server endpoint
      if (!directSuccess) {
        console.log('Menggunakan fallback server upload...');
        setUploadProgress(30);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'highlights');

        const fallbackRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const fallbackData = await fallbackRes.json();
        if (!fallbackData.success || !fallbackData.url) {
          throw new Error(fallbackData.error || 'Upload gagal ke server R2. Pastikan CORS diaktifkan di dashboard R2 atau file tidak melebihi batas.');
        }
        videoPublicUrl = fallbackData.url;
      }

      setUploadProgress(90);

      // Otomatis ekstrak frame video & upload thumbnail
      let generatedThumbUrl = '';
      try {
        const thumbBlob = await extractVideoThumbnail(file);
        if (thumbBlob) {
          const thumbFormData = new FormData();
          thumbFormData.append('file', thumbBlob, `thumb_${Date.now()}.jpg`);
          thumbFormData.append('folder', 'highlights');
          const thumbRes = await fetch('/api/upload', { method: 'POST', body: thumbFormData });
          const thumbData = await thumbRes.json();
          if (thumbData.success) {
            generatedThumbUrl = thumbData.url;
          }
        }
      } catch {
        // Thumbnail opsional
      }

      setUploadProgress(100);

      setForm(prev => ({
        ...prev,
        videoUrl: videoPublicUrl,
        thumbnailUrl: generatedThumbUrl || prev.thumbnailUrl,
        isYoutube: false,
      }));

      showToast('success', 'Video berhasil diupload ke Cloudflare R2!');
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('error', err.message || 'Upload gagal. Periksa koneksi internet atau CORS Cloudflare R2.');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.attackerName || !form.defenderName) {
      showToast('error', 'Judul, nama penyerang, dan nama target wajib diisi');
      return;
    }
    if (!form.videoUrl) {
      showToast('error', 'Video belum diisi! Silakan upload video ke R2 atau masukkan link YouTube.');
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/highlights/${editingId}` : '/api/highlights';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', editingId ? 'Highlight berhasil diperbarui!' : 'Highlight berhasil ditambahkan!');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchHighlights();
      } else {
        showToast('error', data.error || 'Gagal menyimpan');
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
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950 border-red-500/40 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-coc-heading text-2xl font-black text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" /> Kelola Video Highlight War
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload video dari Cloudflare R2 atau paste link YouTube • Data tersimpan di MongoDB
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Highlight Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'classic', 'cwl'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              filterType === t
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {t === 'all' ? 'Semua' : t === 'classic' ? 'Classic War' : 'CWL'}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">{highlights.length} highlight</span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c1017] border border-slate-700 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-800 bg-[#0c1017] z-10">
              <h2 className="font-coc-heading text-lg font-bold text-white">
                {editingId ? 'Edit Highlight' : 'Tambah Highlight Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Judul Highlight *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="cth: Lavaloon Mematikan di CWL Round 5"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipe War</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value as 'classic' | 'cwl' }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="classic">Classic War</option>
                    <option value="cwl">CWL (Liga Klan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal War</label>
                  <input
                    type="date"
                    value={form.warDate}
                    onChange={e => setForm(p => ({ ...p, warDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Penyerang (Kita) *</label>
                  <input
                    type="text"
                    value={form.attackerName}
                    onChange={e => setForm(p => ({ ...p, attackerName: e.target.value }))}
                    placeholder="Nama member kita"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">TH Penyerang</label>
                  <select
                    value={form.attackerTownHall}
                    onChange={e => setForm(p => ({ ...p, attackerTownHall: +e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  >
                    {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>TH{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nama Target (Musuh) *</label>
                  <input
                    type="text"
                    value={form.defenderName}
                    onChange={e => setForm(p => ({ ...p, defenderName: e.target.value }))}
                    placeholder="Nama member lawan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">TH Target</label>
                  <select
                    value={form.defenderTownHall}
                    onChange={e => setForm(p => ({ ...p, defenderTownHall: +e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  >
                    {Array.from({ length: 17 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>TH{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Bintang</label>
                  <select
                    value={form.stars}
                    onChange={e => setForm(p => ({ ...p, stars: +e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  >
                    <option value={1}>⭐ 1 Bintang</option>
                    <option value={2}>⭐⭐ 2 Bintang</option>
                    <option value={3}>⭐⭐⭐ 3 Bintang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">% Kehancuran</label>
                  <input
                    type="number"
                    value={form.destructionPercent}
                    onChange={e => setForm(p => ({ ...p, destructionPercent: +e.target.value }))}
                    min={0} max={100}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Klan Lawan</label>
                  <input
                    type="text"
                    value={form.opponentClan}
                    onChange={e => setForm(p => ({ ...p, opponentClan: e.target.value }))}
                    placeholder="Nama klan musuh"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Strategi Serangan</label>
                  <input
                    type="text"
                    value={form.strategy}
                    onChange={e => setForm(p => ({ ...p, strategy: e.target.value }))}
                    placeholder="cth: Lavaloon + Haste Spell, Ground Queen Walk"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Catatan Singkat</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={3}
                    placeholder="Ceritakan keunikan atau strategi dari serangan ini..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60 resize-none"
                  />
                </div>
              </div>

              {/* Video Source */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sumber Video</p>
                
                {/* YouTube URL */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <YoutubeIcon className="w-3.5 h-3.5 text-red-400" /> Paste Link YouTube
                  </label>
                  <input
                    type="url"
                    value={form.isYoutube || !form.videoUrl.startsWith('http') ? form.videoUrl : ''}
                    onChange={e => handleVideoUrlChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-red-500/60"
                  />
                  {form.isYoutube && getYoutubeId(form.videoUrl) && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> YouTube ID: {getYoutubeId(form.videoUrl)} • Thumbnail otomatis diambil
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-xs text-slate-600 font-bold">ATAU</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* File Upload to R2 */}
                <div>
                  <label className="block text-xs text-slate-400 font-bold mb-1.5 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-sky-400" /> Upload Video ke Cloudflare R2 (Direct)
                  </label>
                  
                  <div
                    onClick={() => {
                      if (!uploadingFile) fileInputRef.current?.click();
                    }}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed transition-all ${
                      uploadingFile 
                        ? 'border-sky-500 bg-sky-950/20 cursor-wait' 
                        : form.videoUrl && !form.isYoutube
                          ? 'border-emerald-500/50 bg-emerald-950/10 cursor-pointer'
                          : 'border-slate-700 hover:border-sky-500/50 hover:bg-slate-900/60 cursor-pointer'
                    }`}
                  >
                    {uploadingFile ? (
                      <div className="w-full space-y-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-sky-400 font-bold text-sm">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Mengupload langsung ke Cloudflare R2... {uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">Harap tunggu hingga upload selesai 100% sebelum klik simpan.</p>
                      </div>
                    ) : form.videoUrl && !form.isYoutube ? (
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Video Siap Digunakan!
                          </span>
                          <span className="text-[11px] text-slate-400 underline cursor-pointer">Klik untuk ganti video</span>
                        </div>
                        <video 
                          src={form.videoUrl} 
                          controls 
                          className="w-full max-h-48 rounded-xl bg-black object-contain border border-slate-800"
                        />
                      </div>
                    ) : (
                      <>
                        <Film className="w-8 h-8 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-300">Pilih file video perang (MP4, WebM)</span>
                        <span className="text-[11px] text-slate-500">Mendukung file besar hingga ratusan MB tanpa limit</span>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                </div>

                {/* Manual URL (R2 or other) */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">URL Video R2 (Otomatis terisi setelah upload)</label>
                  <input
                    type="url"
                    value={!form.isYoutube ? form.videoUrl : ''}
                    onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value, isYoutube: false }))}
                    placeholder="https://pasbarjaya-media.edisyafrianto45.workers.dev/highlights/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-sky-500/60"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">URL Thumbnail (opsional)</label>
                <input
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={e => setForm(p => ({ ...p, thumbnailUrl: e.target.value }))}
                  placeholder="https://... (otomatis di-generate dari video)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.featured ? 'bg-amber-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-semibold text-slate-300">Tampilkan sebagai Highlight Unggulan (Featured)</span>
              </label>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving || uploadingFile}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Menyimpan...</span></>
                  ) : uploadingFile ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Menunggu Upload Video Selesai...</span></>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /><span>{editingId ? 'Perbarui Highlight' : 'Simpan Highlight'}</span></>
                  )}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Highlights List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-900/60 animate-pulse" />
          ))
        ) : highlights.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Swords className="w-12 h-12 mx-auto mb-4 text-slate-800" />
            <p className="font-bold text-slate-400">Belum ada highlight.</p>
            <p className="text-sm mt-1">Tambahkan highlight war pertama untuk klan PASBARJAYA!</p>
          </div>
        ) : (
          highlights.map((h) => (
            <div key={h._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
              {/* Thumbnail */}
              <div className="shrink-0 w-20 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {h.thumbnailUrl ? (
                  <img src={h.thumbnailUrl} alt={h.title} className="w-full h-full object-cover" />
                ) : h.videoUrl && !h.isYoutube ? (
                  <video src={`${h.videoUrl}#t=1`} preload="metadata" muted playsInline className="w-full h-full object-cover" />
                ) : (
                  h.isYoutube ? <YoutubeIcon className="w-6 h-6 text-red-400" /> : <Film className="w-6 h-6 text-slate-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm truncate">{h.title}</span>
                  {h.featured && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />}
                  {h.isYoutube ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800 font-mono">YT</span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 border border-sky-800 font-mono">R2</span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${h.type === 'cwl' ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {h.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {h.attackerName} (TH{h.attackerTownHall}) → {h.defenderName} (TH{h.defenderTownHall}) •&nbsp;
                  {'⭐'.repeat(h.stars)} {h.destructionPercent}% • {h.views} views
                </p>
                {h.warDate && <p className="text-[11px] text-slate-600">{h.warDate} • {h.opponentClan}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {h.videoUrl && (
                  <a
                    href={h.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                    title="Tonton video"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(h)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(h._id)}
                  disabled={deleting === h._id}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
                  title="Hapus"
                >
                  {deleting === h._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
