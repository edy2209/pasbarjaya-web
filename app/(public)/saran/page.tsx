'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function SaranPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    playerTag: '',
    category: 'war',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.message) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: formData.senderName,
          playerTag: formData.playerTag,
          category: formData.category === 'war' ? 'war_strategy' : formData.category,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setFormData({ senderName: '', playerTag: '', category: 'war', message: '' });
      } else {
        setErrorMsg(data.error || 'Gagal mengirim saran. Coba lagi.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan. Periksa koneksi internetmu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          Suara Member & Clasher
        </div>

        <h1 className="font-coc-heading text-4xl sm:text-5xl font-black text-white tracking-wide">
          Masukan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Saran</span>
        </h1>

        <p className="text-slate-300 text-base leading-relaxed">
          Klan PASBARJAYA tumbuh besar karena keterbukaan dan aspirasi anggotanya. Punya usul strategi war, ide event, atau saran pengelolaan klan? Sampaikan di sini!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. FORM SUBMISSION */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="font-coc-heading text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Formulir Saran
            </h2>
            <span className="text-xs text-slate-400">Tersambung ke Database Klan</span>
          </div>

          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Terima kasih atas masukan kamu!</strong>
                <span>Pesan telah berhasil disimpan ke database klan dan akan segera ditinjau oleh Leader & Co-Leader PASBARJAYA.</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sender Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Nama / Nickname Game <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: RajaPerang / Clasher Minang"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Player Tag */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Player Tag CoC <span className="text-slate-500 font-normal lowercase">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="#98YLP880"
                value={formData.playerTag}
                onChange={(e) => setFormData({ ...formData, playerTag: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Kategori Masukan <span className="text-amber-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="war">Strategi War & Pemilihan Roster CWL</option>
                <option value="event">Ide Event Internal & Leaderboard Hadiah</option>
                <option value="donasi">Ketertiban Donasi & Base Defense Clan</option>
                <option value="umum">Saran Umum / Fitur Website Klan</option>
              </select>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Isi Masukan / Saran <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tuliskan kritik, masukan, ide strategi, atau usulan kamu secara jelas dan konstruktif..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengirim Masukan...' : 'Kirim Masukan ke Pengurus'}</span>
            </button>

          </form>

        </div>

        {/* 3. SIDEBAR / GUIDELINES & PRIVACY */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-coc-heading text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Etika & Privasi
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Masukan kamu masuk langsung ke dashboard admin dan hanya dapat dibaca oleh Leader & Co-Leader.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Gunakan bahasa yang sopan dan saling menghargai sesama clasher.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Saran terbaik untuk strategi war akan dibahas pada rapat evaluasi sebelum pembagian bonus medal CWL.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="font-coc-heading text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Butuh Bantuan Cepat?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jika mengalami kendala request troop darurat untuk war atau pergantian jadwal war, silakan hubungi langsung Co-Leader yang sedang piket di grup WhatsApp klan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
