'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Swords, Play, Flame, Shield, Sparkles, X, Cloud, Film
} from 'lucide-react';
import { mockHighlights } from '@/lib/mock-data';
import { playNavSound } from '@/lib/sound';

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface Highlight {
  _id?: string;
  id?: string;
  title: string;
  type?: string;
  category?: string;
  attackerName: string;
  attackerTownHall: number;
  defenderName: string;
  defenderTownHall: number;
  stars?: number;
  destructionPercent?: number;
  strategy?: string;
  notes: string;
  opponentClan: string;
  warDate?: string;
  date?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  isYoutube?: boolean;
  views?: number;
  featured?: boolean;
  armyIcons?: string[];
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function VideoPlayer({ highlight, onClose }: { highlight: Highlight; onClose: () => void }) {
  const ytId = highlight.isYoutube && highlight.videoUrl ? getYoutubeId(highlight.videoUrl) : null;
  const type = highlight.type || highlight.category || 'classic';
  const stars = highlight.stars ?? 3;
  const destruction = highlight.destructionPercent ?? 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#090d15] border-2 border-amber-500/40 shadow-2xl shadow-black overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
              {type.toUpperCase()}
            </span>
            <h3 className="font-coc-heading text-base sm:text-lg font-bold text-white truncate max-w-md sm:max-w-xl">
              {highlight.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : highlight.videoUrl ? (
            <video
              src={highlight.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={highlight.thumbnailUrl}
            >
              Browser kamu tidak mendukung video tag HTML5.
            </video>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-600">
              <Film className="w-16 h-16" />
              <p className="text-sm">Video belum tersedia</p>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="p-4 sm:p-6 space-y-3 bg-slate-950 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400">
              Eksekutor: <strong className="text-amber-400">{highlight.attackerName} (TH{highlight.attackerTownHall})</strong>
            </span>
            <span className="text-slate-400">
              Target: <strong className="text-rose-400">{highlight.defenderName} ({highlight.opponentClan})</strong>
            </span>
            <span className="text-emerald-400 font-extrabold text-sm">{'⭐'.repeat(stars)} {destruction}% Destruction</span>
          </div>
          {highlight.strategy && (
            <p className="text-xs text-amber-300 font-semibold">Strategi: {highlight.strategy}</p>
          )}
          <p className="text-sm text-slate-300 leading-relaxed">{highlight.notes}</p>
          <div className="pt-2 text-[11px] font-mono flex items-center gap-2">
            {ytId ? (
              <span className="text-red-400 flex items-center gap-1.5"><YoutubeIcon className="w-3.5 h-3.5" /> YouTube Stream</span>
            ) : (
              <span className="text-sky-400 flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5" /> Cloudflare R2 CDN Stream</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HighlightPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cwl' | 'classic'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Highlight | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/highlights');
      const data = await res.json();
      if (data.success && Array.isArray(data.highlights) && data.highlights.length > 0) {
        setHighlights(data.highlights);
      } else {
        setHighlights([]);
      }
    } catch {
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHighlights(); }, [fetchHighlights]);

  const filteredHighlights = highlights.filter((item) => {
    const type = item.type || item.category || 'classic';
    if (activeCategory === 'all') return true;
    return type === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider shadow-lg shadow-black">
          <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
          Galeri Perang Bersejarah
        </div>

        <h1 className="font-coc-heading text-4xl sm:text-5xl font-black text-white tracking-wide">
          Highlight War <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-amber-500">Ter-Epic</span>
        </h1>

        <p className="text-slate-300 text-base leading-relaxed">
          Koleksi rekaman serangan 3-bintang 100% destruction paling dramatis di Clan War League (CWL) dan Classic War.
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-sky-400 bg-slate-900 border border-sky-500/30 px-4 py-1.5 rounded-full font-mono">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>Cloudflare R2 • YouTube</span>
          </div>
          {usingMock && (
            <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-500/20 px-3 py-1.5 rounded-full">
              Menampilkan data contoh (DB kosong)
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs (Clean Steam Style) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => {
            playNavSound();
            setActiveCategory('all');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeCategory === 'all'
              ? 'bg-[#1e2d42] text-amber-400 border border-[#2a475e] shadow-sm'
              : 'bg-[#101722] text-slate-400 hover:text-white border border-[#1f2d40]'
          }`}
        >
          Semua ({highlights.length})
        </button>

        <button
          onClick={() => {
            playNavSound();
            setActiveCategory('cwl');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeCategory === 'cwl'
              ? 'bg-[#1e2d42] text-purple-400 border border-[#2a475e] shadow-sm'
              : 'bg-[#101722] text-slate-400 hover:text-white border border-[#1f2d40]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          CWL ({highlights.filter(h => (h.type || h.category) === 'cwl').length})
        </button>

        <button
          onClick={() => {
            playNavSound();
            setActiveCategory('classic');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeCategory === 'classic'
              ? 'bg-[#1e2d42] text-red-400 border border-[#2a475e] shadow-sm'
              : 'bg-[#101722] text-slate-400 hover:text-white border border-[#1f2d40]'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          Classic War ({highlights.filter(h => (h.type || h.category) === 'classic').length})
        </button>
      </div>

      {/* Highlights Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-slate-900/60 animate-pulse" style={{ aspectRatio: '1/1.4' }} />
          ))}
        </div>
      ) : filteredHighlights.length === 0 ? (
        <div className="rounded-3xl bg-[#0a0d14] border-2 border-slate-800/80 p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Film className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            Coming Soon
          </span>
          <h3 className="font-coc-heading text-2xl font-black text-white">
            Video Highlight Belum Tersedia
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Admin klan belum menambahkan video highlight war. Serangan 3-bintang 100% destruction akan segera diunggah ke sini!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHighlights.map((item, idx) => {
            const type = item.type || item.category || 'classic';
            const stars = item.stars ?? 3;
            const destruction = item.destructionPercent ?? 100;
            const ytId = item.isYoutube && item.videoUrl ? getYoutubeId(item.videoUrl) : null;
            const key = item._id || item.id || String(idx);

            return (
              <div
                key={key}
                className="group rounded-3xl bg-[#0b0e15] border-2 border-slate-800 hover:border-amber-500/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black flex flex-col justify-between"
              >
                {/* Thumbnail / Preview Header */}
                <div
                  onClick={() => setSelectedVideo(item)}
                  className="relative aspect-video bg-gradient-to-br from-slate-950 via-[#0e1422] to-slate-950 p-5 flex flex-col justify-between cursor-pointer overflow-hidden border-b border-slate-800/80"
                >
                  {/* Tactical grid bg */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:14px_14px]" />

                  {/* Thumbnail or Video Frame */}
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                  ) : item.videoUrl && !item.isYoutube ? (
                    <video
                      src={`${item.videoUrl}#t=1`}
                      preload="metadata"
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none"
                    />
                  ) : null}

                  {/* Top badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      type === 'cwl'
                        ? 'bg-purple-900/90 text-purple-200 border border-purple-500/50'
                        : 'bg-red-950/90 text-red-200 border border-red-500/50'
                    }`}>
                      {type === 'cwl' ? 'CWL WAR' : 'CLASSIC WAR'}
                    </span>

                    <div className="flex items-center gap-1">
                      {ytId ? <YoutubeIcon className="w-4 h-4 text-red-400" /> : <Cloud className="w-4 h-4 text-sky-400" />}
                      <span className="text-amber-400 font-extrabold text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                        {'⭐'.repeat(stars)}
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform border border-amber-200">
                      <Play className="w-7 h-7 fill-black translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom: destruction bar */}
                  <div className="relative z-10 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white">
                      <span className="text-emerald-400">{destruction}% Destruction</span>
                      <span className="text-slate-400 font-mono">{item.warDate || item.date || ''}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full"
                        style={{ width: `${destruction}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3
                      onClick={() => setSelectedVideo(item)}
                      className="font-coc-heading text-lg font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {item.title}
                    </h3>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Attacker</span>
                        <span className="font-bold text-emerald-400">TH{item.attackerTownHall} • {item.attackerName}</span>
                      </div>
                      <Swords className="w-4 h-4 text-red-500 shrink-0 mx-2" />
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Defender</span>
                        <span className="font-bold text-rose-400">TH{item.defenderTownHall} • {item.defenderName}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.notes}</p>
                    )}

                    {/* Strategy tags */}
                    {item.strategy && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.strategy.split(',').map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-amber-300 font-medium border border-amber-500/20">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.armyIcons && item.armyIcons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.armyIcons.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-[11px] text-amber-300 font-medium border border-amber-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">Lawan: <strong className="text-slate-300">{item.opponentClan}</strong></span>
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="text-amber-400 font-extrabold hover:text-amber-300 flex items-center gap-1 uppercase tracking-wide"
                    >
                      Putar <Play className="w-3 h-3 fill-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayer highlight={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
