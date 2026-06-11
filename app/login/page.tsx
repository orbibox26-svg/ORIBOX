"use client";

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Logging in...');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.message || 'Login failed');
      return;
    }
    setStatus('Login sukses ✅');
    // Redirect to home
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1020] to-[#09090b] p-6">
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h2 className="mt-4 text-white text-2xl font-semibold">Masuk ke Orbibox</h2>
          <p className="text-sm text-zinc-400 mt-1">Masukkan akun Anda untuk melanjutkan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none" placeholder="Username" required />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none" placeholder="Password" required />
          </div>
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">Masuk</button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-400">{status}</div>
      </div>
    </div>
  );
}
