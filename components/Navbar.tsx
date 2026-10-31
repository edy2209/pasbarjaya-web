'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Swords, Trophy, Calendar, MessageSquare, Menu, X, Flame } from 'lucide-react';
import { ClanData } from '@/lib/types';
import { mockClanData } from '@/lib/mock-data';
import { playNavSound } from '@/lib/sound';

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Shield },
  { href: '/about', label: 'About & Roster', icon: Trophy },
  { href: '/highlight', label: 'Highlight War', icon: Swords },
  { href: '/event', label: 'Event Klan', icon: Calendar },
  { href: '/saran', label: 'Masukan & Saran', icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleNavClick = () => {
    playNavSound();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101722]/95 backdrop-blur-md border-b border-[#223147] shadow-xl shadow-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Clan Badge */}
          <Link 
            href="/" 
            onClick={handleNavClick}
            className="flex items-center gap-3 group transition-transform duration-150 hover:scale-[1.01]"
          >
            <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[#1b2838] border border-[#2a475e] shadow-md">
              <div className="w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                {clan.badgeUrl ? (
                  <img src={clan.badgeUrl} alt="Clan Badge" className="w-10 h-10 object-contain drop-shadow" />
                ) : (
                  <Shield className="w-7 h-7 text-amber-400" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-black font-extrabold text-[10px] rounded border border-[#101722]">
                {clan.clanLevel}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-coc-heading text-xl sm:text-2xl font-black text-white tracking-wide group-hover:text-amber-400 transition-colors">
                  {clan.name}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1b2838] text-amber-400 border border-[#2a475e] rounded">
                  {clan.tag}
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {clan.warLeague} • Level {clan.clanLevel} Clan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clean Steam Gaming Style */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1b2838] text-amber-400 border border-[#2a475e] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#162130]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Live Status Badge */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-[#223147]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1b2838] border border-[#2a475e] text-red-400 text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>War Streak: {clan.warWinStreak}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => {
                playNavSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2.5 rounded-lg bg-[#1b2838] text-slate-300 hover:text-white border border-[#2a475e]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#223147] bg-[#0e141e]/98 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#223147] px-2 text-xs text-slate-400">
            <span>{clan.name} ({clan.tag})</span>
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> {clan.warWinStreak} Streak
            </span>
          </div>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  playNavSound();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#1b2838] text-amber-400 border border-[#2a475e]'
                    : 'text-slate-300 hover:bg-[#162130] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
