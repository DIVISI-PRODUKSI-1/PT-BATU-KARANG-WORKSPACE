import React from 'react';
import { 
  Factory, 
  Bot, 
  Database, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Layers,
  Sparkles,
  RefreshCw,
  Network,
  Building2
} from 'lucide-react';

export type ActiveTab = 'architecture' | 'org-structure' | 'dashboard' | 'ai-assistant' | 'excise-cukai' | 'sql-schema';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
  totalSticksToday: number;
  plantOee: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSimulating,
  setIsSimulating,
  totalSticksToday,
  plantOee
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Bar: Identity & Operational Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-500">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-100 tracking-tight text-base sm:text-lg">
                PT Batu Karang
              </span>
              <span className="text-stone-500 text-xs hidden sm:inline">·</span>
              <span className="text-amber-500 text-xs font-mono font-medium hidden sm:inline">
                Sistem AI Pabrik Rokok
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Shift 1 Pagi (06:00 - 14:00 WIB)</span>
              <span>·</span>
              <span>Jl. Raya Parangargo 153 Wagir - Malang</span>
            </div>
          </div>
        </div>

        {/* Quick Factory Pulse Metrics */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-stone-400 text-[11px]">OUTPUT SHIFT INI</span>
            <span className="text-amber-400 font-bold text-sm">
              {totalSticksToday.toLocaleString('id-ID')} <span className="text-[10px] text-stone-400 font-normal">batang</span>
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-stone-400 text-[11px]">OEE RATA-RATA</span>
            <span className={`font-bold text-sm ${plantOee >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {plantOee.toFixed(1)}% <span className="text-[10px] text-stone-400 font-normal">{plantOee >= 85 ? 'World Class' : 'Target 85%'}</span>
            </span>
          </div>

          {/* Telemetry simulation toggle button */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
              isSimulating
                ? 'bg-amber-600/15 border-amber-600/40 text-amber-400 hover:bg-amber-600/25'
                : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
            title="Simulasikan denyut telemetri mesin pabrik real-time"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isSimulating ? 'Live IoT Active' : 'IoT Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-800/80">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Rekomendasi Arsitektur Sistem</span>
          </button>

          <button
            onClick={() => setActiveTab('org-structure')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'org-structure'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Network className="h-4 w-4" />
            <span>Bagan Organisasi & Jabatan</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Dashboard Real-Time & OEE</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'ai-assistant'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Karyawan AI & Pelaporan Otomatis</span>
          </button>

          <button
            onClick={() => setActiveTab('excise-cukai')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'excise-cukai'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Pita Cukai & Bea Cukai (CK-4)</span>
          </button>

          <button
            onClick={() => setActiveTab('sql-schema')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'sql-schema'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Kamus Data & Schema SQL</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
