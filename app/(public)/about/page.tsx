'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Shield, 
  Trophy, 
  Swords, 
  Flame, 
  Users, 
  Search, 
  ArrowUpDown, 
  Award, 
  Copy, 
  Check, 
  Building, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { mockClanData } from '@/lib/mock-data';
import { ClanData, ClanRole } from '@/lib/types';
import { getTownHallTheme } from '@/lib/coc-assets';
import { playNavSound } from '@/lib/sound';
import { formatNumber } from '@/lib/utils';

export default function AboutPage() {
  const [clan, setClan] = useState<ClanData>(mockClanData);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | ClanRole>('all');
  const [thFilter, setThFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'th' | 'trophies' | 'bbTrophies' | 'donations'>('rank');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/clan')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.clan) {
          setClan(data.clan);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (tag: string) => {
    playNavSound();
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  // Filter & sort logic
  const filteredMembers = useMemo(() => {
    return clan.memberList
      .filter((member) => {
        const matchesSearch = 
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.tag.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        const matchesTh = thFilter === 'all' || member.townHallLevel === thFilter;

        return matchesSearch && matchesRole && matchesTh;
      })
      .sort((a, b) => {
        if (sortBy === 'th') return b.townHallLevel - a.townHallLevel;
        if (sortBy === 'trophies') return b.trophies - a.trophies;
        if (sortBy === 'bbTrophies') return b.builderBaseTrophies - a.builderBaseTrophies;
        if (sortBy === 'donations') return b.donations - a.donations;
        return a.clanRank - b.clanRank;
      });
  }, [clan.memberList, searchQuery, roleFilter, thFilter, sortBy]);

  const getRoleBadge = (role: ClanRole) => {
    switch (role) {
      case 'leader':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40">Leader</span>;
      case 'coLeader':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/40">Co-Leader</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/40">Elder</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">Member</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      
      {/* 1. CLAN OVERVIEW HEADER (Clean Steam Aesthetic) */}
      <section className="rounded-2xl bg-[#101722] border border-[#223147] p-6 sm:p-10 shadow-xl shadow-black/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#1b2838] border border-[#2a475e] text-amber-400 text-xs font-bold uppercase tracking-wider">
                Profil Resmi Klan
              </span>
              <button 
                onClick={() => handleCopy(clan.tag)}
                className="text-xs font-mono text-slate-300 bg-[#162130] px-3 py-1 rounded-md border border-[#223147] flex items-center gap-1.5 hover:border-amber-400 transition-colors"
                title="Salin Clan Tag"
              >
                {copiedTag === clan.tag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{clan.tag}</span>
              </button>
              <span className="text-xs text-slate-400 font-semibold">
                🇮🇩 {clan.location?.name || 'Indonesia'}
              </span>
            </div>

            <div>
              <h1 className="font-coc-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
                Tentang Klan <span className="text-amber-400">{clan.name}</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mt-2">
                {clan.description}
              </p>
            </div>

            {/* Clan Policy Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1f2d40]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Frekuensi War</span>
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                  <Swords className="w-3.5 h-3.5 text-amber-400" /> {clan.warFrequency}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1f2d40]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Divisi CWL</span>
                <span className="text-xs sm:text-sm font-bold text-purple-400 flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5" /> {clan.warLeague}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1f2d40]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Syarat Trofi</span>
                <span className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                  <Trophy className="w-3.5 h-3.5" /> {clan.requiredTrophies} Trofi
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#141d2b] border border-[#1f2d40]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Status Masuk</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" /> {clan.type}
                </span>
              </div>
            </div>

          </div>

          {/* Clan Badge Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#141d2b] border border-[#223147]">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              {clan.badgeUrl ? (
                <img src={clan.badgeUrl} alt="Clan Badge" className="w-24 h-24 object-contain drop-shadow-md" />
              ) : (
                <Shield className="w-16 h-16 text-amber-400" />
              )}
            </div>
            <div className="mt-3">
              <span className="font-coc-heading text-lg font-black text-white">CLAN LEVEL {clan.clanLevel}</span>
              <p className="text-xs text-slate-400 mt-0.5">Perks War Level {clan.clanLevel} Aktif</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATISTIK REALTIME KLAN */}
      <section className="space-y-4">
        <div>
          <h2 className="font-coc-heading text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Statistik Klan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sinkronisasi resmi dari Supercell API
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Trofi Desa Siang</span>
            <span suppressHydrationWarning className="font-coc-stat text-xl font-bold text-amber-400 block">{formatNumber(clan.clanPoints)}</span>
            <span className="text-[10px] text-slate-500">Home Base</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Desa Malam (BB)</span>
            <span suppressHydrationWarning className="font-coc-stat text-xl font-bold text-sky-400 block">{formatNumber(clan.clanBuilderBasePoints)}</span>
            <span className="text-[10px] text-slate-500">Builder Base</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">War Win Streak</span>
            <span className="font-coc-stat text-xl font-bold text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-400" />
              {clan.warWinStreak}
            </span>
            <span className="text-[10px] text-slate-500">Kemenangan Beruntun</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Menang War</span>
            <span className="font-coc-stat text-xl font-bold text-emerald-400 block">{clan.warWins}</span>
            <span className="text-[10px] text-slate-500">War Menang</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total Kalah War</span>
            <span className="font-coc-stat text-xl font-bold text-slate-300 block">{clan.warLosses}</span>
            <span className="text-[10px] text-slate-500">War Kalah</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101722] border border-[#1f2d40] text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Kapasitas Member</span>
            <span className="font-coc-stat text-xl font-bold text-amber-400 block">{clan.membersCount || clan.memberList.length} / 50</span>
            <span className="text-[10px] text-slate-500">Anggota Aktif</span>
          </div>
        </div>
      </section>

      {/* 3. ROSTER MEMBER KLAN (RESPONSIF MOBILE, COMPACT, STEAM GAMING STYLE) */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-coc-heading text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> Roster Anggota Klan ({filteredMembers.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Daftar seluruh pejuang aktif klan PASBARJAYA
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-xl bg-[#101722] border border-[#223147] p-4 space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau player tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#162130] border border-[#223147] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Filter TH */}
            <div className="sm:col-span-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#162130] border border-[#223147]">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={thFilter}
                  onChange={(e) => setThFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full bg-[#162130] text-xs text-slate-200 focus:outline-none border-none cursor-pointer"
                >
                  <option value="all" className="bg-[#162130] text-white">Semua Town Hall</option>
                  {Array.from({ length: 17 }, (_, i) => 17 - i).map((th) => (
                    <option key={th} value={th} className="bg-[#162130] text-white">Town Hall {th}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#162130] border border-[#223147]">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#162130] text-xs text-slate-200 focus:outline-none border-none cursor-pointer"
                >
                  <option value="rank" className="bg-[#162130] text-white">Urut: Rank Klan (#1)</option>
                  <option value="th" className="bg-[#162130] text-white">Urut: TH Tertinggi</option>
                  <option value="trophies" className="bg-[#162130] text-white">Urut: Trofi Home Base</option>
                  <option value="bbTrophies" className="bg-[#162130] text-white">Urut: Trofi BB (Malam)</option>
                  <option value="donations" className="bg-[#162130] text-white">Urut: Donasi Terbanyak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1e2a38]">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Jabatan:</span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'leader', label: 'Leader' },
              { id: 'coLeader', label: 'Co-Leader' },
              { id: 'admin', label: 'Elder' },
              { id: 'member', label: 'Member' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playNavSound();
                  setRoleFilter(tab.id as any);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  roleFilter === tab.id
                    ? 'bg-[#1e2d42] text-amber-400 border border-[#2a475e]'
                    : 'bg-[#162130] text-slate-400 hover:text-white border border-[#223147]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* MEMBERS GRID - COMPACT & CLEAN ON MOBILE (STEAM STYLE) */}
        {filteredMembers.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-[#101722] border border-[#223147] text-slate-400 space-y-1.5">
            <p className="text-sm font-bold text-white">Tidak ada anggota yang cocok dengan pencarian.</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci atau reset filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredMembers.map((member) => {
              const thTheme = getTownHallTheme(member.townHallLevel);
              const isUnranked = !member.league?.name || member.league.name === 'Unranked';

              return (
                <div
                  key={member.tag}
                  className="rounded-xl bg-[#101722] border border-[#1f2d40] hover:border-[#2a475e] p-3.5 sm:p-4 space-y-3 transition-colors shadow-sm"
                >
                  
                  {/* Top Header: Rank + Role + EXP */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#162130] border border-[#223147] text-xs font-mono font-bold text-amber-400 flex items-center justify-center">
                        #{member.clanRank}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Rank #{member.clanRank}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#162130] text-slate-400 border border-[#223147]">
                        EXP {member.expLevel}
                      </span>
                      {getRoleBadge(member.role)}
                    </div>
                  </div>

                  {/* Hero Row: Compact Town Hall Building + Member Info */}
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#141d2b] border border-[#1e2a38]">
                    {/* Compact TH Image */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                      <img 
                        src={thTheme.imagePath} 
                        alt={thTheme.name}
                        className="w-full h-full object-contain drop-shadow" 
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.1 rounded bg-[#0e141e] border border-[#223147] text-amber-400 font-bold text-[9px]">
                        TH{member.townHallLevel}
                      </span>
                    </div>

                    {/* Member Name & Tag */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="font-coc-heading text-sm sm:text-base font-bold text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {thTheme.name}
                      </p>
                      <button 
                        onClick={() => handleCopy(member.tag)}
                        className="text-[10px] font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                        title="Salin Player Tag"
                      >
                        {copiedTag === member.tag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{member.tag}</span>
                      </button>
                    </div>
                  </div>

                  {/* Compact Stats Row: Home Trophies, Builder Base, Donations */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {/* Home Base */}
                    <div className="p-2 rounded-lg bg-[#141d2b] border border-[#1e2a38] flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#101722] flex items-center justify-center shrink-0">
                        {member.league?.iconUrl ? (
                          <img src={member.league.iconUrl} alt="League" className="w-5 h-5 object-contain" />
                        ) : (
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Home Base</span>
                        <span suppressHydrationWarning className="font-coc-stat font-bold text-amber-400 truncate block">
                          {formatNumber(member.trophies)} 🏆
                        </span>
                      </div>
                    </div>

                    {/* Builder Base */}
                    <div className="p-2 rounded-lg bg-[#141d2b] border border-[#1e2a38] flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#101722] flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Desa Malam</span>
                        <span suppressHydrationWarning className="font-coc-stat font-bold text-sky-400 truncate block">
                          {formatNumber(member.builderBaseTrophies)} 🏆
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donations Strip */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1e2a38] text-slate-400">
                    <span>Donasi: <strong suppressHydrationWarning className="text-emerald-400 font-mono">+{formatNumber(member.donations)}</strong></span>
                    <span>Diterima: <strong suppressHydrationWarning className="text-slate-300 font-mono">-{formatNumber(member.donationsReceived)}</strong></span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}
