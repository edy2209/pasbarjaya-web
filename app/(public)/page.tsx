'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Swords, 
  Trophy, 
  Flame, 
  Users, 
  Play, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  Crown,
  ChevronRight,
  Calendar,
  Film,
  Clock
} from 'lucide-react';
import { mockClanData } from '@/lib/mock-data';
import { ClanData } from '@/lib/types';
import { playNavSound } from '@/lib/sound';
import { formatNumber } from '@/lib/utils';

export default function HomePage() {
  const [copied, setCopied] = useState(false);
  const [clan, setClan] = useState<ClanData>(mockClanData);
  const [featuredHighlight, setFeaturedHighlight] = useState<any | null>(null);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);

  useEffect(() => {
    // 1. Live Clan Data
    fetch('/api/clan')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.clan) {
          setClan(data.clan);
        }
      })
      .catch(() => {});

    // 2. Real Highlights from DB
    fetch('/api/highlights?featured=true')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.highlights) && data.highlights.length > 0) {
          setFeaturedHighlight(data.highlights[0]);
        } else {
          fetch('/api/highlights')
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.success && Array.isArray(d2.highlights) && d2.highlights.length > 0) {
                setFeaturedHighlight(d2.highlights[0]);
              } else {
                setFeaturedHighlight(null);
              }
            })
            .catch(() => setFeaturedHighlight(null));
        }
      })
      .catch(() => setFeaturedHighlight(null));

    // 3. Real Events from DB
    fetch('/api/events?status=active')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.events) && data.events.length > 0) {
          setActiveEvent(data.events[0]);
        } else {
          fetch('/api/events')
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.success && Array.isArray(d2.events) && d2.events.length > 0) {
                setActiveEvent(d2.events[0]);
              } else {
                setActiveEvent(null);
              }
            })
            .catch(() => setActiveEvent(null));
        }
      })
      .catch(() => setActiveEvent(null));
  }, []);

  const handleCopyTag = () => {
    playNavSound();
    navigator.clipboard.writeText(clan.tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION - CLEAN STEAM GAMING AESTHETIC */}
      <section className="pt-8 pb-12 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Clan Identity Headline */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#141d2b] border border-[#223147] text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Level {clan.clanLevel} Clan
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400 font-bold uppercase">{clan.warLeague}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {clan.warWinStreak} Win Streak
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="font-coc-heading text-4xl sm:text-6xl font-black text-white leading-tight">
                KLAN JUARA <br />
                <span className="text-amber-400">
                  {clan.name}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 mt-3">
                {clan.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/about"
                onClick={playNavSound}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md shadow-black"
              >
                <Trophy className="w-4 h-4 text-black" />
                Roster Member ({clan.membersCount})
              </Link>

              <Link
                href="/highlight"
                onClick={playNavSound}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#162130] hover:bg-[#1e2d42] text-slate-200 border border-[#223147] font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Swords className="w-4 h-4 text-red-400" />
                Arsip War Epic
              </Link>

              {/* Clan Tag Copy Button */}
              <button
                onClick={handleCopyTag}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#101722] hover:bg-[#162130] text-slate-400 hover:text-amber-400 border border-[#223147] text-xs font-mono transition-colors"
                title="Salin Clan Tag"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{clan.tag}</span>
                {copied && <span className="text-emerald-400 font-sans font-bold">Tersalin!</span>}
              </button>
            </div>

            {/* Clan Quick Perks */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{clan.membersCount} Clasher Bergabung</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>CWL {clan.warLeague}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>War Non-stop</span>
              </div>
            </div>

          </div>

          {/* Right: CLEAN STATS PANEL (STEAM STYLE) */}
          <div className="lg:col-span-5 relative">
            <div className="mx-auto max-w-md lg:max-w-none rounded-2xl bg-[#101722] border border-[#223147] p-5 sm:p-6 shadow-xl shadow-black/80 space-y-5">
              
              {/* Badge & Clan Header */}
              <div className="text-center pb-4 border-b border-[#1e2a38] space-y-2">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  {clan.badgeUrl ? (
                    <img src={clan.badgeUrl} alt="Clan Badge" className="w-20 h-20 object-contain drop-shadow" />
                  ) : (
                    <Shield className="w-14 h-14 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-coc-heading text-xl font-bold text-white">
                    {clan.name}
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-semibold">{clan.tag}</span>
                </div>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1e2a38]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Trofi Klan</span>
                  <span suppressHydrationWarning className="font-coc-stat text-lg font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    {formatNumber(clan.clanPoints)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1e2a38]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">War Menang</span>
                  <span className="font-coc-stat text-lg font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <Swords className="w-3.5 h-3.5 text-emerald-400" />
                    {clan.warWins} W
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1e2a38]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Anggota Klan</span>
                  <span className="font-coc-stat text-lg font-bold text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    {clan.membersCount} / 50
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1e2a38]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Capital Hall</span>
                  <span className="font-coc-stat text-lg font-bold text-purple-400 flex items-center justify-center gap-1 mt-0.5">
                    <Crown className="w-3.5 h-3.5 text-purple-400" />
                    Lvl {clan.capitalHallLevel}
                  </span>
                </div>
              </div>

              {/* Direct CoC Deep Link */}
              <a
                href={`clashofclans://action=OpenClanProfile?tag=${clan.tag.replace('#', '')}`}
                onClick={playNavSound}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#162130] hover:bg-[#1e2d42] text-white font-bold text-xs uppercase tracking-wider border border-[#223147] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                Buka Profil di Game CoC
              </a>

            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS STRIP BANNER */}
      <section className="border-y border-[#1e2a38] bg-[#101722]/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">War Win Streak</span>
              <div className="font-coc-stat text-2xl sm:text-3xl font-extrabold text-orange-400 flex items-center justify-center gap-1.5">
                <Flame className="w-5 h-5 text-orange-400" />
                {clan.warWinStreak} Streak
              </div>
              <span className="text-[10px] text-slate-500">Kemenangan beruntun</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Menang War</span>
              <div className="font-coc-stat text-2xl sm:text-3xl font-extrabold text-amber-400">
                {clan.warWins} War
              </div>
              <span className="text-[10px] text-slate-500">{clan.warLosses} Kalah • {clan.warTies} Seri</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Divisi CWL</span>
              <div className="font-coc-stat text-xl sm:text-2xl font-extrabold text-purple-400">
                {clan.warLeague}
              </div>
              <span className="text-[10px] text-slate-500">Pekan Liga Klan</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Trofi Capital Peak</span>
              <div suppressHydrationWarning className="font-coc-stat text-2xl sm:text-3xl font-extrabold text-sky-400">
                {formatNumber(clan.clanCapitalPoints)}
              </div>
              <span className="text-[10px] text-slate-500">Capital Hall Lvl {clan.capitalHallLevel}</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span>Rekaman Replay Pilihan</span>
            </div>
            <h2 className="font-coc-heading text-2xl sm:text-3xl font-black text-white">
              Highlight War Ter-Epic
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Arsip serangan 3-bintang 100% destruction tersimpan di Cloudflare R2
            </p>
          </div>

          <Link
            href="/highlight"
            onClick={playNavSound}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group"
          >
            <span>Buka Galeri Highlight</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredHighlight ? (
          <div className="rounded-2xl bg-[#101722] border border-[#223147] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative aspect-video bg-[#0b1017] flex flex-col justify-between p-5 sm:p-6 overflow-hidden group">
              {/* Thumbnail or Video Frame */}
              {featuredHighlight.thumbnailUrl ? (
                <img
                  src={featuredHighlight.thumbnailUrl}
                  alt={featuredHighlight.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                />
              ) : featuredHighlight.videoUrl && !featuredHighlight.isYoutube ? (
                <video
                  src={`${featuredHighlight.videoUrl}#t=1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none"
                />
              ) : null}

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-[#1b2838] text-purple-300 border border-[#2a475e] text-[10px] font-black uppercase tracking-wider">
                  {featuredHighlight.type === 'cwl' ? 'CWL WAR' : 'CLASSIC WAR'}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1b2838] text-sky-300 border border-[#2a475e] text-[10px] font-bold font-mono">
                  Cloudflare R2
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-2">
                <Link
                  href="/highlight"
                  onClick={playNavSound}
                  className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform"
                >
                  <Play className="w-7 h-7 fill-black translate-x-0.5" />
                </Link>
                <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                  Putar Replay ({featuredHighlight.stars || 3}⭐)
                </span>
              </div>

              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-white font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    {'⭐'.repeat(featuredHighlight.stars || 3)} {featuredHighlight.destructionPercent || 100}% DESTRUCTION
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{featuredHighlight.warDate || ''}</span>
                </div>
                <div className="w-full bg-[#162130] rounded-full h-2 border border-[#223147] overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${featuredHighlight.destructionPercent || 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-[#101722] border-t lg:border-t-0 lg:border-l border-[#1e2a38]">
              <div className="space-y-3">
                <h3 className="font-coc-heading text-lg sm:text-xl font-bold text-white leading-snug">
                  {featuredHighlight.title}
                </h3>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1e2a38] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Penyerang:</span>
                    <strong className="text-emerald-400 font-bold">{featuredHighlight.attackerName} (TH{featuredHighlight.attackerTownHall})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Base:</span>
                    <strong className="text-rose-400 font-bold">{featuredHighlight.defenderName} (TH{featuredHighlight.defenderTownHall})</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {featuredHighlight.notes || 'Replay serangan war pilihan klan PASBARJAYA.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1e2a38] flex items-center justify-between">
                <span className="text-xs text-slate-400">Lawan: <strong className="text-white">{featuredHighlight.opponentClan || 'Klan Musuh'}</strong></span>
                <Link
                  href="/highlight"
                  onClick={playNavSound}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Tonton Video <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#101722] border border-[#1f2d40] p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#162130] border border-[#223147] flex items-center justify-center mx-auto text-amber-400">
              <Film className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#162130] text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
              <h3 className="font-coc-heading text-lg font-bold text-white">
                Highlight War Belum Diunggah
              </h3>
              <p className="text-slate-400 text-xs">
                Leader atau Co-Leader belum mempublikasikan rekaman replay war di database.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 4. ACTIVE EVENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeEvent ? (
          <div className="rounded-2xl bg-[#101722] border border-[#223147] p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1b2838] text-amber-400 border border-[#2a475e] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  Event Klan Aktif
                </div>
                <h2 className="font-coc-heading text-2xl sm:text-3xl font-black text-white">
                  {activeEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {activeEvent.description}
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-1 text-xs">
                  {activeEvent.prizePool && (
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Hadiah & Apresiasi</span>
                      <span className="font-coc-heading text-amber-400 font-bold text-base">{activeEvent.prizePool}</span>
                    </div>
                  )}
                  {activeEvent.startDate && (
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Periode</span>
                      <span className="font-semibold text-slate-200">{activeEvent.startDate} - {activeEvent.endDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                <Link
                  href="/event"
                  onClick={playNavSound}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Lihat Leaderboard Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#101722] border border-[#1f2d40] p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#162130] text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Turnamen & Kompetisi Klan
                </div>
                <h2 className="font-coc-heading text-xl sm:text-2xl font-bold text-white">
                  Belum Ada Event Aktif Saat Ini
                </h2>
                <p className="text-xs text-slate-400">
                  Leader dan pengurus klan sedang mempersiapkan turnamen internal berikutnya.
                </p>
              </div>

              <Link
                href="/event"
                onClick={playNavSound}
                className="shrink-0 px-5 py-2.5 rounded-lg bg-[#162130] hover:bg-[#1e2d42] text-amber-400 border border-[#223147] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>Cek Halaman Event</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
