'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Swords, 
  Sparkles, 
  Clock, 
  Gift, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { mockEvents } from '@/lib/mock-data';
import { ClanEvent } from '@/lib/types';
import { playNavSound } from '@/lib/sound';

export default function EventPage() {
  const [events, setEvents] = useState<ClanEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success && Array.isArray(data.events) && data.events.length > 0) {
          const mapped: ClanEvent[] = data.events.map((e: any) => ({
            id: e._id?.toString() || e.id,
            title: e.title,
            description: e.description || '',
            category: e.type || e.category || 'Turnamen',
            status: e.status === 'ended' ? 'completed' : e.status,
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            prizePool: e.prizePool || 'Hadiah Menarik',
            rules: e.rules || [],
            leaderboard: (e.participants && e.participants.length > 0)
              ? e.participants.map((p: any, idx: number) => ({
                  rank: p.rank ?? idx + 1,
                  playerTag: p.playerTag ?? '',
                  playerName: p.playerName ?? 'Clasher',
                  townHallLevel: p.townHallLevel ?? 15,
                  attacksUsed: p.attacksUsed ?? 0,
                  starsEarned: p.starsEarned ?? 0,
                  score: p.score ?? 0,
                }))
              : [],
          }));
          setEvents(mapped);
          setSelectedEventId(mapped[0]?.id || '');
        } else {
          setEvents([]);
        }
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0] || null;
  const sortedLeaderboard = selectedEvent?.leaderboard
    ? [...selectedEvent.leaderboard]
        .sort((a, b) => b.score - a.score)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
    : [];

  const top1 = sortedLeaderboard[0];
  const top2 = sortedLeaderboard[1];
  const top3 = sortedLeaderboard[2];
  const remainingRanks = sortedLeaderboard.slice(3);

  const getStatusBadge = (status: ClanEvent['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sedang Berlangsung
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            Segera Hadir
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          Kompetisi & Turnamen Internal
        </div>

        <h1 className="font-coc-heading text-4xl sm:text-5xl font-black text-white tracking-wide">
          Event Klan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Leaderboard</span>
        </h1>

        <p className="text-slate-300 text-base leading-relaxed">
          Uji ketangkasan strategi war dan dedikasi donasi kamu! Ikuti berbagai event berhadiah eksklusif dan pantau posisi kamu di papan peringkat leaderboard klan.
        </p>
      </div>

      {events.length === 0 && !loading ? (
        <div className="rounded-3xl bg-[#0a0d14] border-2 border-slate-800/80 p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Calendar className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            Coming Soon
          </span>
          <h3 className="font-coc-heading text-2xl font-black text-white">
            Belum Ada Event Aktif
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Turnamen atau kompetisi internal klan belum dibuka oleh Leader & Co-Leader. Leaderboard akan otomatis aktif saat event dimulai!
          </p>
        </div>
      ) : selectedEvent ? (
        <>
          {/* 2. EVENT SELECTOR CAROUSEL / TABS */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Pilih Event Untuk Melihat Klasemen:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map((event) => {
                const isSelected = event.id === selectedEvent.id;
            return (
              <div
                key={event.id}
                onClick={() => {
                  playNavSound();
                  setSelectedEventId(event.id);
                }}
                className={`cursor-pointer p-4 rounded-xl border transition-all space-y-2.5 ${
                  isSelected
                    ? 'bg-[#1e2d42] border-[#2a475e] shadow-md'
                    : 'bg-[#101722] border-[#1f2d40] hover:border-[#2a475e] hover:bg-[#141d2b]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-semibold">{event.category}</span>
                  {getStatusBadge(event.status)}
                </div>

                <h3 className={`font-coc-heading text-base font-bold transition-colors line-clamp-2 ${
                  isSelected ? 'text-amber-400' : 'text-white'
                }`}>
                  {event.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>{event.startDate} - {event.endDate}</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    Klasemen <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. EVENT DETAILS BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-[#080b11] border border-amber-500/30 p-8 sm:p-10 shadow-2xl space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {getStatusBadge(selectedEvent.status)}
              <span className="text-xs text-slate-400 font-medium">Kategori: {selectedEvent.category}</span>
            </div>
            <h2 className="font-coc-heading text-2xl sm:text-3xl font-black text-white">
              {selectedEvent.title}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          {/* Prize Pool Callout */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center lg:text-right shrink-0 space-y-1">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block flex items-center justify-center lg:justify-end gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" /> Total Hadiah Event
            </span>
            <span className="font-coc-heading text-lg sm:text-xl font-black text-amber-400 block">
              {selectedEvent.prizePool}
            </span>
          </div>
        </div>

        {/* Rules Accordion / List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Ketentuan & Aturan Penilaian:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedEvent.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 4. LEADERBOARD / PAPAN PERINGKAT */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Klasemen Sementara
          </span>
          <h2 className="font-coc-heading text-3xl sm:text-4xl font-extrabold text-white">
            Leaderboard {selectedEvent.title}
          </h2>
          <p className="text-sm text-slate-400">
            Peringkat dihitung secara berkala berdasarkan performa war dan donasi anggota klan.
          </p>
        </div>

        {/* PODIUM TOP 3 */}
        {top1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6">
            
            {/* Rank 2 (Silver) */}
            {top2 && (
              <div className="order-2 md:order-1 p-6 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950 border border-slate-600/60 text-center space-y-3 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-slate-700/80 border border-slate-400 flex items-center justify-center mx-auto text-slate-300">
                  <Medal className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Juara 2</span>
                  <h3 className="font-bold text-white text-base mt-0.5">{top2.playerName}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{top2.playerTag}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 text-xs space-y-1">
                  <div className="text-slate-400">Skor: <strong className="text-white text-base">{top2.score}</strong></div>
                  <div className="text-slate-500">⭐ {top2.starsEarned} Bintang • {top2.attacksUsed} Serangan</div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold - Elevated) */}
            <div className="order-1 md:order-2 p-8 rounded-2xl bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950 border-2 border-amber-400 text-center space-y-3 shadow-2xl shadow-amber-500/20 md:-translate-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/40">
                <div className="w-full h-full bg-[#0a0e17] rounded-full flex items-center justify-center">
                  <Crown className="w-9 h-9 text-amber-400 animate-bounce" />
                </div>
              </div>
              <div>
                <span className="px-3 py-0.5 rounded-full bg-amber-500 text-black text-[11px] font-black uppercase tracking-wider">
                  Juara 1 (Leaderboard)
                </span>
                <h3 className="font-coc-heading font-extrabold text-amber-300 text-xl mt-2">{top1.playerName}</h3>
                <span className="text-xs font-mono text-slate-400">{top1.playerTag}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs space-y-1">
                <div className="text-amber-200">Skor Total: <strong className="text-amber-300 text-xl font-bold">{top1.score}</strong></div>
                <div className="text-amber-400/90 font-medium">⭐ {top1.starsEarned} Bintang • {top1.attacksUsed} Serangan</div>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            {top3 && (
              <div className="order-3 p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-800/40 text-center space-y-3 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-amber-900/60 border border-amber-700 flex items-center justify-center mx-auto text-amber-600">
                  <Medal className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600">Juara 3</span>
                  <h3 className="font-bold text-white text-base mt-0.5">{top3.playerName}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{top3.playerTag}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 text-xs space-y-1">
                  <div className="text-slate-400">Skor: <strong className="text-white text-base">{top3.score}</strong></div>
                  <div className="text-slate-500">⭐ {top3.starsEarned} Bintang • {top3.attacksUsed} Serangan</div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TABLE OF REMAINING RANKS */}
        {remainingRanks.length > 0 && (
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Peringkat</th>
                    <th className="px-6 py-4">Clasher</th>
                    <th className="px-6 py-4 text-center">Town Hall</th>
                    <th className="px-6 py-4 text-center">Serangan Digunakan</th>
                    <th className="px-6 py-4 text-center">Bintang (⭐)</th>
                    <th className="px-6 py-4 text-right">Skor Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {remainingRanks.map((entry) => (
                    <tr key={entry.playerTag} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">
                        #{entry.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{entry.playerName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{entry.playerTag}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                          TH {entry.townHallLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-300">
                        {entry.attacksUsed}x
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-amber-400">
                        {entry.starsEarned} ⭐
                      </td>
                      <td className="px-6 py-4 text-right font-coc-stat text-lg font-bold text-amber-400">
                        {entry.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
        </>
      ) : null}

    </div>
  );
}
