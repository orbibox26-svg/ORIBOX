"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Check session via server endpoint (works with httpOnly cookies)
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        setUsername('Queitz');
        setIsLoading(false);
      } catch (e) {
        router.push('/login');
      }
    })();
  }, [router]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Theme (dark/light) toggle
  const [theme, setTheme] = useState<'dark'|'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as 'dark'|'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light-theme');
    else document.documentElement.classList.remove('light-theme');
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  if (isLoading) {
    return (
      <div className="mesh-gradient fixed inset-0 w-screen h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex overflow-hidden">
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-900/20">
              <i className="fa-solid fa-box-open text-white text-xs"></i>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight tracking-tight text-white">Orbibox</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Integrated system</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Main Menu</p>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-zinc-800 text-white rounded-lg text-sm font-medium">
              <i className="fa-solid fa-th-large w-5"></i>
              Aplikasi Digital
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-lg text-sm transition-colors">
              <i className="fa-solid fa-desktop w-5"></i>
              Sesi Perangkat
            </a>
          </nav>

        </div>

        <div className="mt-auto p-4 border-t border-zinc-800">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors" onClick={handleLogout}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-700 rounded-md flex items-center justify-center text-xs font-bold text-zinc-300">QU</div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate w-32 uppercase text-white">{username}</p>
                <p className="text-[10px] text-zinc-500 uppercase">System Root</p>
              </div>
            </div>
            <i className="fa-solid fa-power-off text-[10px] text-red-500 hover:scale-110"></i>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-black/40 backdrop-blur-sm">
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400">
              <i className="fa-solid fa-bars-staggered"></i>
            </button>
            <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Terverifikasi via Telegram Secure Auth</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
              <i className="fa-regular fa-bell"></i>
            </button>
            <button className="p-2 bg-blue-600/10 text-blue-500 rounded-full text-[10px] px-3 font-bold border border-blue-500/20">ONLINE</button>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
              title="Toggle light/dark"
            >
              {theme === 'dark' ? <i className="fa-regular fa-sun text-yellow-300"></i> : <i className="fa-regular fa-moon"></i>}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 animate-in">
              <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang, {username}</h2>
              <p className="text-zinc-500 text-sm">Semua layanan sistem berjalan optimal.</p>
            </div>

            <div className="relative mb-10 group">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"></i>
              <input type="text" placeholder="Cari fungsionalitas sistem..." className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/50 placeholder-zinc-700 transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="https://form-service-nine.vercel.app/" target="_blank" rel="noreferrer" className="glass border-white/5 rounded-3xl p-6 flex flex-col h-full hover:bg-white/5 hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <i className="fa-solid fa-file-signature text-2xl text-blue-500"></i>
                </div>
                <h3 className="text-sm font-bold mb-2 tracking-wide uppercase text-white">Formservice</h3>
                <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed">Kelola pengajuan formulir digital dalam waktu nyata.</p>
                <div className="mt-auto flex gap-2">
                  <span className="bg-zinc-800/50 px-2 py-1 rounded text-[9px] text-zinc-500 uppercase">Secure</span>
                  <span className="bg-zinc-800/50 px-2 py-1 rounded text-[9px] text-zinc-500 uppercase">Active</span>
                </div>
              </a>

              <a href="https://form-service-nine.vercel.app/" target="_blank" rel="noreferrer" className="glass border-white/5 rounded-3xl p-6 flex flex-col h-full hover:bg-white/5 hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                    <i className="fa-solid fa-clipboard-list text-2xl text-orange-500"></i>
                  </div>
                  <h3 className="text-sm font-bold mb-2 tracking-wide uppercase text-white">Service Form</h3>
                  <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed">Visualisasi alur kerja pelayanan terpadu.</p>
                  <div className="mt-auto flex gap-2">
                    <span className="bg-zinc-800/50 px-2 py-1 rounded text-[9px] text-zinc-500 uppercase">Workflow</span>
                  </div>
                </a>

              <a href="/absensi" className="glass border-white/5 rounded-3xl p-6 flex flex-col h-full hover:bg-white/5 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <i className="fa-solid fa-user-check text-2xl text-emerald-500"></i>
                </div>
                <h3 className="text-sm font-bold mb-2 tracking-wide uppercase text-white">Absensi</h3>
                <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed">Monitoring kehadiran user via biometrik 2026.</p>
                <div className="mt-auto flex gap-2">
                  <span className="bg-zinc-800/50 px-2 py-1 rounded text-[9px] text-zinc-500 uppercase">Biometric</span>
                </div>
              </a>

              <a href="https://oribox-inventori.vercel.app/" target="_blank" rel="noreferrer" className="glass border-white/5 rounded-3xl p-6 flex flex-col h-full hover:bg-white/5 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                  <i className="fa-solid fa-boxes-stacked text-2xl text-red-500"></i>
                </div>
                <h3 className="text-sm font-bold mb-2 tracking-wide uppercase text-white">Iventori</h3>
                <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed">Manajemen stok aset global secara otomatis.</p>
                <div className="mt-auto flex gap-2">
                  <span className="bg-zinc-800/50 px-2 py-1 rounded text-[9px] text-zinc-500 uppercase">Asset</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
