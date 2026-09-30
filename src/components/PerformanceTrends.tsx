import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  AreaChart, 
  Bar, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  Gauge, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Zap,
  Info
} from 'lucide-react';
import { 
  HOURLY_PERFORMANCE_DATA, 
  DAILY_PERFORMANCE_DATA, 
  HourlyPerformanceData 
} from '../data/performanceTrendsData';

export const PerformanceTrends: React.FC = () => {
  const [timeScope, setTimeScope] = useState<'hourly' | 'daily'>('hourly');
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'throughput' | 'oee'>('all');
  const [lineFilter, setLineFilter] = useState<'total' | 'skm1' | 'skm2' | 'skt'>('total');

  // Custom Dark Tooltip for Throughput
  const CustomThroughputTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: HourlyPerformanceData = payload[0]?.payload;
      return (
        <div className="bg-stone-900 border border-stone-700/80 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1.5 min-w-[210px]">
          <div className="text-amber-400 font-bold border-b border-stone-800 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-stone-400">Shift 1 Pagi</span>
          </div>

          <div className="space-y-1 text-stone-200">
            <div className="flex justify-between">
              <span className="text-stone-400">Output Aktual:</span>
              <span className="font-bold text-amber-300">
                {payload.find((p: any) => p.dataKey === 'actualSticks')?.value?.toLocaleString('id-ID')} btg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Target Nominal:</span>
              <span className="text-stone-300">
                {data?.targetSticks?.toLocaleString('id-ID')} btg
              </span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 border-t border-stone-800">
              <span className="text-stone-400">OEE Jam Ini:</span>
              <span className={`font-bold ${data?.overallOee >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {data?.overallOee}%
              </span>
            </div>
          </div>

          {data?.notes && (
            <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-800/80 italic">
              Catatan: {data.notes}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Dark Tooltip for OEE
  const CustomOEETooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-stone-700/80 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1.5 min-w-[200px]">
          <div className="text-emerald-400 font-bold border-b border-stone-800 pb-1">
            {label} · Komponen OEE
          </div>
          <div className="space-y-1">
            {payload.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between text-stone-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}:</span>
                </span>
                <span className="font-bold text-stone-100">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-6">
      {/* Component Title & View Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>ANALITIK TREN KINERJA & THROUGHPUT WAKTU NYATA</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-100 mt-1">
            Visualisasi Efisiensi OEE & Laju Produksi Batang Rokok
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            PT Batu Karang (Wagir - Malang) · Lini Maker SKM, Packer, & Meja Giling SKT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time scope segmented switch */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setTimeScope('hourly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                timeScope === 'hourly'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Shift Berjalan (Per Jam)</span>
            </button>
            <button
              onClick={() => setTimeScope('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                timeScope === 'daily'
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Tren 7 Hari</span>
            </button>
          </div>

          {/* Metric Tab Filter */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setActiveMetricTab('all')}
              className={`px-2.5 py-1.5 rounded transition-colors ${
                activeMetricTab === 'all'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Semua Grafik
            </button>
            <button
              onClick={() => setActiveMetricTab('throughput')}
              className={`px-2.5 py-1.5 rounded transition-colors ${
                activeMetricTab === 'throughput'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Throughput Batang
            </button>
            <button
              onClick={() => setActiveMetricTab('oee')}
              className={`px-2.5 py-1.5 rounded transition-colors ${
                activeMetricTab === 'oee'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Komponen OEE
            </button>
          </div>
        </div>
      </div>

      {/* KPI Diagnostic Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
          <span className="text-[10px] text-stone-500 block uppercase">THROUGHPUT PUNCAK</span>
          <span className="text-amber-400 font-bold text-sm sm:text-base mt-0.5 block">
            960.000 <span className="text-[10px] text-stone-400 font-normal">btg/jam</span>
          </span>
          <span className="text-[10px] text-stone-500">Pukul 08:00 - 09:00 WIB</span>
        </div>

        <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
          <span className="text-[10px] text-stone-500 block uppercase">TITIK BOTTLENECK</span>
          <span className="text-rose-400 font-bold text-sm sm:text-base mt-0.5 block">
            710.000 <span className="text-[10px] text-stone-400 font-normal">btg/jam</span>
          </span>
          <span className="text-[10px] text-stone-500">Jamming Tape SKM 2 (09:15)</span>
        </div>

        <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
          <span className="text-[10px] text-stone-500 block uppercase">OEE STABILITAS</span>
          <span className="text-emerald-400 font-bold text-sm sm:text-base mt-0.5 block">
            87.2% <span className="text-[10px] text-stone-400 font-normal">Rata-rata</span>
          </span>
          <span className="text-[10px] text-emerald-500 font-medium">World Class (&gt;85%)</span>
        </div>

        <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
          <span className="text-[10px] text-stone-500 block uppercase">QUALITY RATIO (QC)</span>
          <span className="text-cyan-400 font-bold text-sm sm:text-base mt-0.5 block">
            98.8% <span className="text-[10px] text-stone-400 font-normal">Lolos</span>
          </span>
          <span className="text-[10px] text-stone-500">Reject Rate 1.2% Aman</span>
        </div>
      </div>

      {/* CHART 1: PRODUCTION THROUGHPUT (BATANG/JAM) */}
      {(activeMetricTab === 'all' || activeMetricTab === 'throughput') && (
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>
                  {timeScope === 'hourly' 
                    ? 'Laju Throughput Batang per Jam vs Target Kapasitas (Shift 1)' 
                    : 'Tren Throughput Harian 7 Hari Terakhir'}
                </span>
              </h4>
              <p className="text-[11px] text-stone-400">
                {timeScope === 'hourly'
                  ? 'Batang yang dihasilkan gabungan Maker Protos, Molins, dan Meja Giling SKT.'
                  : 'Total batang rokok diproduksi per hari kerja pabrik.'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                <span>Output Batang</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
                <span>Garis Target</span>
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {timeScope === 'hourly' ? (
                <ComposedChart data={HOURLY_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                    domain={[0, 1200000]}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomThroughputTooltip />} />
                  <ReferenceLine y={945000} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 'Target 945k', fill: '#06b6d4', fontSize: 10 }} />
                  <Bar dataKey="actualSticks" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  <Line type="monotone" dataKey="targetSticks" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </ComposedChart>
              ) : (
                <ComposedChart data={DAILY_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} 
                    domain={[0, 9000000]}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomThroughputTooltip />} />
                  <ReferenceLine y={7200000} stroke="#06b6d4" strokeDasharray="3 3" />
                  <Bar dataKey="totalSticks" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  <Line type="monotone" dataKey="targetSticks" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* CHART 2: OEE SCORES BREAKDOWN (AVAILABILITY, PERFORMANCE, QUALITY, OVERALL) */}
      {(activeMetricTab === 'all' || activeMetricTab === 'oee') && (
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-emerald-400" />
                <span>Tren Indeks OEE (Availability, Performance, Quality, Overall %)</span>
              </h4>
              <p className="text-[11px] text-stone-400">
                Garis putus-putus hijau menandai tolok ukur World Class OEE (&ge; 85.0%).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Overall OEE</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Availability</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Performance</span>
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                <span>Quality</span>
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {timeScope === 'hourly' ? (
                <AreaChart data={HOURLY_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickFormatter={(val) => `${val}%`} 
                    domain={[50, 100]}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomOEETooltip />} />
                  <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'World Class 85%', fill: '#10b981', fontSize: 10 }} />
                  <Area type="monotone" dataKey="overallOee" name="Overall OEE" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOee)" />
                  <Line type="monotone" dataKey="oeeAvailability" name="Availability" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="oeePerformance" name="Performance" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="oeeQuality" name="Quality" stroke="#c084fc" strokeWidth={1.5} dot={false} />
                </AreaChart>
              ) : (
                <AreaChart data={DAILY_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDailyOee" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={11} 
                    fontFamily="JetBrains Mono, monospace" 
                    tickFormatter={(val) => `${val}%`} 
                    domain={[70, 100]}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomOEETooltip />} />
                  <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'World Class 85%', fill: '#10b981', fontSize: 10 }} />
                  <Area type="monotone" dataKey="overallOee" name="Overall OEE" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDailyOee)" dot={{ r: 3 }} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Contextual Industrial Explanatory Banner */}
      <div className="flex items-start gap-2.5 p-3.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-400">
        <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-stone-300">Wawasan Analitik untuk PT Batu Karang:</strong> Penurunan tajam OEE pada interval 09:00 - 10:00 (turun ke 65.8%) disebabkan oleh insiden slip *suction tape* pada Mesin Maker 02 (Molins MK-9). Sistem otomatisasi AI segera mendeteksi anomali ini dan mencatatnya ke dalam draf Laporan Shift Resmi untuk verifikasi Mandor dan Direksi.
        </div>
      </div>
    </div>
  );
};
