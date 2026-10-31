'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  Calendar, 
  Swords, 
  MessageSquare, 
  Users, 
  Cloud, 
  LogOut, 
  ArrowLeft,
  Menu,
  X,
  Database
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/administrator', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/administrator/events', label: 'Kelola Event', icon: Calendar },
  { href: '/administrator/highlights', label: 'Kelola Highlight (R2)', icon: Swords },
  { href: '/administrator/saran', label: 'Masukan & Saran', icon: MessageSquare },
  { href: '/administrator/admins', label: 'Kelola Akun Admin', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    router.push('/administrator/login');
  };

  // If on login page, render clean full screen without sidebar
  if (pathname === '/administrator/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0d14] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <span className="font-coc-heading font-bold text-white text-base">PASBAR ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#090c13] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="p-6 space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-coc-heading font-black text-white text-lg tracking-wide">
                PASBARJAYA
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Administrator
              </span>
            </div>
          </div>

          {/* Quick Database & R2 Indicator */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> MongoDB Atlas
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-400" /> Cloudflare R2
              </span>
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Web Publik</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
