'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Swords, Flame } from 'lucide-react';
import { ClanData } from '@/lib/types';
import { mockClanData } from '@/lib/mock-data';
import { playNavSound } from '@/lib/sound';

export default function Footer() {
  const [clan, setClan] = useState<ClanData>(mockClanData);

  useEffect(() => {
    fetch('/api/clan')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.clan) {
          setClan(data.clan);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="w-full bg-[#0b1017] border-t border-[#1e2a38] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Clan Identity with Real Clan Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[#151f2e] border border-[#23354c] shrink-0">
                <div className="w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  {clan.badgeUrl ? (
                    <img src={clan.badgeUrl} alt="Clan Badge" className="w-10 h-10 object-contain drop-shadow" />
                  ) : (
                    <Shield className="w-7 h-7 text-amber-400" />
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-black font-extrabold text-[10px] rounded border border-[#0b1017]">
                  {clan.clanLevel}
                </span>
              </div>
              <div>
                <h3 className="font-coc-heading text-lg font-bold text-white tracking-wide">
                  {clan.name}
                </h3>
                <span className="text-xs text-amber-400 font-mono font-semibold">{clan.tag}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Klan resmi pejuang Clash of Clans Indonesia. Mengedepankan kekompakan, konsistensi 3-bintang, serta dedikasi tinggi di Clan War League & Classic War.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Status Klan: {clan.type || 'Open Recruitment'}
            </div>
          </div>

          {/* Col 2: Navigasi Halaman */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" onClick={playNavSound} className="hover:text-amber-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={playNavSound} className="hover:text-amber-400 transition-colors">
                  Tentang Klan & Roster Member
                </Link>
              </li>
              <li>
                <Link href="/highlight" onClick={playNavSound} className="hover:text-amber-400 transition-colors">
                  Highlight War (CWL & Classic)
                </Link>
              </li>
              <li>
                <Link href="/event" onClick={playNavSound} className="hover:text-amber-400 transition-colors">
                  Event Internal & Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/saran" onClick={playNavSound} className="hover:text-amber-400 transition-colors">
                  Form Masukan & Saran
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ketentuan War */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-red-400" /> Ketentuan War
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Classic War:</strong> Non-stop berputar. Wajib 2x attack sebelum 4 jam war berakhir.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>CWL:</strong> Diadakan tiap tanggal 1 awal bulan ({clan.warLeague}).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Donasi:</strong> Saling bantu, request troop war wajib max level.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Raid Weekend:</strong> Wajib 6 serangan Capital setiap akhir pekan.</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kebijakan Fan Content */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Kebijakan Fan Content
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Materi visual, logo, dan statistik Clash of Clans adalah hak cipta milik Supercell. Konten situs web komunitas ini tunduk pada Kebijakan Konten Penggemar Supercell.
            </p>
            <div className="text-[11px] text-slate-600 pt-2 border-t border-[#1e2a38]">
              Media & aset video disajikan melalui Cloudflare R2 Storage.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#1e2a38] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 {clan.name}. Klan Resmi Clash of Clans Indonesia.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Powered by</span>
            <span className="text-amber-400 font-semibold font-mono">{clan.tag}</span>
            <Flame className="w-3.5 h-3.5 text-orange-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
