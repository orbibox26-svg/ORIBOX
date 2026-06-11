"use client";

import { useEffect, useMemo, useState } from 'react';

type AttendanceStatus = 'Tepat Waktu' | 'Terlambat' | 'Perlu Verifikasi' | 'Izin';
type BiometricMethod = 'Fingerprint' | 'Face ID' | 'Palm Scan' | 'Iris Scan';
type DeviceStatus = 'Online' | 'Perlu Kalibrasi' | 'Antrean Tinggi';

interface AttendanceRecord {
  id: number;
  name: string;
  role: string;
  shift: string;
  method: BiometricMethod;
  time: string;
  confidence: number;
  device: string;
  area: string;
  status: AttendanceStatus;
  temperature: string;
  note: string;
}

interface DeviceCard {
  name: string;
  location: string;
  method: BiometricMethod;
  status: DeviceStatus;
  queue: string;
  lastSync: string;
}

const attendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    name: 'Alya Putri',
    role: 'HR Operations',
    shift: 'Shift Pagi',
    method: 'Face ID',
    time: '07:58',
    confidence: 99,
    device: 'Gate A',
    area: 'Head Office Barat',
    status: 'Tepat Waktu',
    temperature: '36.4 C',
    note: 'Lolos liveness check dan geofence aktif.',
  },
  {
    id: 2,
    name: 'Bagas Pratama',
    role: 'Finance Controller',
    shift: 'Shift Pagi',
    method: 'Fingerprint',
    time: '08:06',
    confidence: 97,
    device: 'Gate B',
    area: 'Finance Wing',
    status: 'Terlambat',
    temperature: '36.7 C',
    note: 'Check-in terlambat 6 menit, masih lolos verifikasi biometrik.',
  },
  {
    id: 3,
    name: 'Citra Maheswari',
    role: 'Project Analyst',
    shift: 'Shift Fleksibel',
    method: 'Palm Scan',
    time: '08:01',
    confidence: 98,
    device: 'Lobby Scan Pod',
    area: 'Collaborative Floor',
    status: 'Tepat Waktu',
    temperature: '36.3 C',
    note: 'Sesi tersinkron ke server pusat tanpa jeda.',
  },
  {
    id: 4,
    name: 'Dimas Saputra',
    role: 'Field Auditor',
    shift: 'Remote / Lapangan',
    method: 'Iris Scan',
    time: '08:14',
    confidence: 88,
    device: 'Mobile Kiosk 02',
    area: 'Site Inspection',
    status: 'Perlu Verifikasi',
    temperature: '36.5 C',
    note: 'Confidence score turun karena pencahayaan rendah.',
  },
  {
    id: 5,
    name: 'Eka Sari',
    role: 'Customer Support Lead',
    shift: 'Shift Siang',
    method: 'Face ID',
    time: '-',
    confidence: 0,
    device: 'Gate C',
    area: 'Support Hub',
    status: 'Izin',
    temperature: '-',
    note: 'Mengajukan izin terverifikasi di sistem payroll.',
  },
  {
    id: 6,
    name: 'Fajar Nugroho',
    role: 'Security Officer',
    shift: 'Shift Malam',
    method: 'Fingerprint',
    time: '07:54',
    confidence: 99,
    device: 'Gate C',
    area: 'Perimeter North',
    status: 'Tepat Waktu',
    temperature: '36.2 C',
    note: 'Konektivitas perangkat stabil selama 6 jam terakhir.',
  },
];

const biometricDevices: DeviceCard[] = [
  {
    name: 'Gate A',
    location: 'Lobby Utama',
    method: 'Face ID',
    status: 'Online',
    queue: '3 antrean',
    lastSync: '08:12',
  },
  {
    name: 'Gate B',
    location: 'Finance Wing',
    method: 'Fingerprint',
    status: 'Online',
    queue: '1 antrean',
    lastSync: '08:11',
  },
  {
    name: 'Gate C',
    location: 'North Perimeter',
    method: 'Palm Scan',
    status: 'Antrean Tinggi',
    queue: '7 antrean',
    lastSync: '08:09',
  },
  {
    name: 'Mobile Kiosk 02',
    location: 'Field Operations',
    method: 'Iris Scan',
    status: 'Perlu Kalibrasi',
    queue: '0 antrean',
    lastSync: '07:48',
  },
];

const statusStyles: Record<AttendanceStatus, { label: string; icon: string; classes: string }> = {
  'Tepat Waktu': {
    label: 'Tepat Waktu',
    icon: 'fa-circle-check',
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
  },
  'Terlambat': {
    label: 'Terlambat',
    icon: 'fa-clock',
    classes: 'bg-amber-500/15 text-amber-300 border-amber-400/20',
  },
  'Perlu Verifikasi': {
    label: 'Perlu Verifikasi',
    icon: 'fa-triangle-exclamation',
    classes: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
  },
  'Izin': {
    label: 'Izin',
    icon: 'fa-file-shield',
    classes: 'bg-sky-500/15 text-sky-300 border-sky-400/20',
  },
};

const methodStyles: Record<BiometricMethod, { icon: string; classes: string }> = {
  'Fingerprint': {
    icon: 'fa-fingerprint',
    classes: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/20',
  },
  'Face ID': {
    icon: 'fa-face-smile',
    classes: 'bg-violet-500/15 text-violet-200 border-violet-400/20',
  },
  'Palm Scan': {
    icon: 'fa-hand',
    classes: 'bg-amber-500/15 text-amber-200 border-amber-400/20',
  },
  'Iris Scan': {
    icon: 'fa-eye',
    classes: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/20',
  },
};

const deviceStyles: Record<DeviceStatus, { label: string; classes: string; dot: string }> = {
  Online: {
    label: 'Online',
    classes: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  'Perlu Kalibrasi': {
    label: 'Kalibrasi',
    classes: 'text-amber-300 bg-amber-500/15 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  'Antrean Tinggi': {
    label: 'Antrean Tinggi',
    classes: 'text-rose-300 bg-rose-500/15 border-rose-400/20',
    dot: 'bg-rose-400',
  },
};

function formatClock(date: Date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function getMonthName(monthIndex: number) {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[monthIndex];
}

function Card({
  title,
  value,
  icon,
  colorClass,
}: {
  title: string;
  value: string;
  icon: string;
  colorClass: string;
}) {
  return (
    <div className={`relative overflow-hidden flex items-center p-5 glass rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${colorClass.replace('text', 'border')}`}>
      <div className={`p-4 rounded-xl ${colorClass} bg-white/5`}>
        <i className={`fa-solid ${icon} w-6 h-6 ${colorClass}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <i className={`fa-solid ${icon} absolute -right-4 -bottom-4 w-20 h-20 ${colorClass} opacity-10`} />
    </div>
  );
}

export default function AbsensiPage() {
  const [now, setNow] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [filter, setFilter] = useState<'Semua' | AttendanceStatus>('Semua');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return attendanceRecords.filter((record) => {
      const matchesStatus = filter === 'Semua' || record.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [record.name, record.role, record.device, record.area, record.method, record.note]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [filter, query]);

  const metrics = useMemo(() => {
    const checkedIn = attendanceRecords.filter((record) => record.status !== 'Izin').length;
    const punctual = attendanceRecords.filter((record) => record.status === 'Tepat Waktu').length;
    const flags = attendanceRecords.filter((record) => record.status === 'Perlu Verifikasi').length;
    const activeDevices = biometricDevices.filter((device) => device.status === 'Online').length;
    const attendanceRate = Math.round((punctual / checkedIn) * 100);

    return {
      checkedIn,
      punctual,
      flags,
      activeDevices,
      attendanceRate,
    };
  }, []);

  const recentAlerts = filteredRecords.filter((record) => record.status !== 'Tepat Waktu').slice(0, 3);
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = getMonthName(monthIndex);

  const monthlySummary = useMemo(() => {
    const totalDays = attendanceRecords.length;
    const workDays = attendanceRecords.filter((record) => record.status !== 'Izin').length;
    const onTimeCount = attendanceRecords.filter((record) => record.status === 'Tepat Waktu').length;
    const lateCount = attendanceRecords.filter((record) => record.status === 'Terlambat').length;
    const absentCount = attendanceRecords.filter((record) => record.status === 'Perlu Verifikasi').length;
    const sickLeaveCount = attendanceRecords.filter((record) => record.status === 'Izin').length;
    const annualLeaveCount = 0;
    const attendanceRate = workDays > 0 ? ((onTimeCount + lateCount) / workDays * 100).toFixed(1) : '0.0';

    const overtimeMinutes = attendanceRecords.reduce((sum, record) => {
      if (record.status !== 'Tepat Waktu') return sum;
      const [hours, minutes] = record.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes > 17 * 60 ? sum + (totalMinutes - 17 * 60) : sum;
    }, 0);

    return {
      totalDays,
      workDays,
      onTimeCount,
      lateCount,
      absentCount,
      sickLeaveCount,
      annualLeaveCount,
      attendanceRate,
      totalOvertimeHours: Math.floor(overtimeMinutes / 60),
      remainingOvertimeMinutes: overtimeMinutes % 60,
    };
  }, []);

  const statusMap = {
    'Tepat Waktu': { text: 'Hadir Tepat Waktu', icon: 'fa-circle-check', color: 'text-green-600', bg: 'bg-green-50' },
    'Terlambat': { text: 'Terlambat', icon: 'fa-clock', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    'Perlu Verifikasi': { text: 'Perlu Verifikasi', icon: 'fa-triangle-exclamation', color: 'text-blue-600', bg: 'bg-blue-50' },
    'Izin': { text: 'Izin', icon: 'fa-file-shield', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  } as const;

  const changeMonth = (offset: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + offset);
    setCurrentDate(nextDate);
  };

  return (
    <div className="mesh-gradient min-h-screen p-4 sm:p-8 font-[Inter] overflow-x-hidden text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(59,130,246,0.18),transparent_22%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.14),transparent_26%),radial-gradient(circle_at_80%_85%,rgba(244,114,182,0.14),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="glass rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-black/20 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_18px_rgba(147,197,253,0.85)]" />
              Biometric Control Deck
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Absensi interaktif untuk monitoring kehadiran harian.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Pantau status karyawan, verifikasi perangkat, dan anomali biometrik dalam satu ruang kerja yang lebih dinamis.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {(['Semua', 'Tepat Waktu', 'Terlambat', 'Perlu Verifikasi', 'Izin'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] transition ${
                    filter === item
                      ? 'border-cyan-400/35 bg-cyan-400/15 text-cyan-100'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-black/20">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">System Clock</p>
            <p className="mt-3 font-mono text-4xl font-semibold text-white" suppressHydrationWarning>
              {isMounted ? formatClock(now) : '--:--:--'}
            </p>
            <p className="mt-2 text-sm text-zinc-500" suppressHydrationWarning>
              {isMounted
                ? now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : 'Memuat tanggal sistem...'}
            </p>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">
              <button onClick={() => changeMonth(-1)} className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white" aria-label="Bulan Sebelumnya">
                <i className="fa-solid fa-chevron-left" />
              </button>
              <p className="text-sm font-semibold text-blue-300">{monthName} {year}</p>
              <button onClick={() => changeMonth(1)} className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white" aria-label="Bulan Berikutnya">
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-left text-sm text-emerald-200 transition hover:bg-emerald-400/15">
                <i className="fa-solid fa-fingerprint mr-2" />
                Check-in cepat
              </button>
              <button className="rounded-2xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-left text-sm text-blue-200 transition hover:bg-blue-400/15">
                <i className="fa-solid fa-file-export mr-2" />
                Export log
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card title="Tepat Waktu" value={`${monthlySummary.onTimeCount}`} icon="fa-circle-check" colorClass="text-green-400" />
          <Card title="Terlambat" value={`${monthlySummary.lateCount}`} icon="fa-clock" colorClass="text-amber-400" />
          <Card title="Cuti / Izin" value={`${monthlySummary.sickLeaveCount + monthlySummary.annualLeaveCount}`} icon="fa-file-shield" colorClass="text-blue-400" />
          <Card title="Total Lembur" value={`${monthlySummary.totalOvertimeHours}j ${monthlySummary.remainingOvertimeMinutes}m`} icon="fa-chart-line" colorClass="text-violet-400" />
          <Card title="Tingkat Kehadiran" value={`${monthlySummary.attendanceRate}%`} icon="fa-chart-pie" colorClass="text-cyan-400" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="glass overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-black/20 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Riwayat Harian</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Log verifikasi biometrik</h2>
              </div>
              <div className="relative w-full lg:max-w-sm">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Cari nama, perangkat, atau catatan..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400/35 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="sticky top-0 border-b border-white/10 bg-black/30 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">Karyawan</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">Metode</th>
                    <th className="px-6 py-4 text-center text-sm font-extrabold text-white uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-extrabold text-white uppercase tracking-wider">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item, index) => {
                      const details = statusMap[item.status];
                      return (
                        <tr key={item.id} className="transition duration-150 ease-in-out hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {new Date(year, monthIndex, index + 1).toLocaleDateString('id-ID', {
                              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            <div>{item.name}</div>
                            <div className="text-xs text-zinc-500">{item.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-zinc-200">
                              <i className={`fa-solid ${methodStyles[item.method].icon} text-zinc-400`} />
                              {item.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono text-zinc-200">
                            {item.time || <span className="text-zinc-500">--</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${details.bg} ${details.color}`}>
                              <i className={`fa-solid ${details.icon} w-3 h-3`} />
                              {details.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-400 max-w-xs truncate">{item.note}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-zinc-500">Tidak ada data absensi untuk bulan ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <section className="glass rounded-[2rem] border border-white/10 p-5 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Status Device</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Gate biometrik</h3>
                </div>
                <i className="fa-solid fa-microchip text-xl text-blue-300" />
              </div>
              <div className="mt-5 space-y-4">
                {biometricDevices.map((device) => {
                  const deviceStyle = deviceStyles[device.status];
                  return (
                    <div key={device.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{device.name}</p>
                          <p className="mt-1 text-sm text-zinc-500">{device.location} · {device.method}</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${deviceStyle.classes}`}>
                          <span className={`h-2 w-2 rounded-full ${deviceStyle.dot}`} />
                          {deviceStyle.label}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
                        <span>{device.queue}</span>
                        <span>Sync {device.lastSync}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="glass rounded-[2rem] border border-white/10 p-5 shadow-2xl shadow-black/20">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Anomali</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Perhatian cepat</h3>
              <div className="mt-5 space-y-4">
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((record) => (
                    <div key={record.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold text-white">{record.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">{record.note}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    Tidak ada anomali pada dataset hari ini.
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>

      <style>{`.animate-fadeIn { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .table-auto { table-layout: auto; }`}</style>
    </div>
  );
}