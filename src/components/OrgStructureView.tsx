import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bot, 
  Printer, 
  Search, 
  Filter, 
  ChevronRight, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Cpu, 
  Factory, 
  Network, 
  ListOrdered, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { JobPosition, ORG_POSITIONS, COMPANY_PROFILE } from '../data/orgStructureData';

export const OrgStructureView: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabMode, setActiveTabMode] = useState<'tree' | 'catalog' | 'ai-matrix'>('tree');
  const [selectedPosition, setSelectedPosition] = useState<JobPosition>(ORG_POSITIONS[0]);

  const filteredPositions = ORG_POSITIONS.filter(pos => {
    const matchesDiv = selectedDivision === 'ALL' || pos.division === selectedDivision;
    const matchesSearch = pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pos.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pos.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const level1 = ORG_POSITIONS.filter(p => p.level === 1);
  const level2 = ORG_POSITIONS.filter(p => p.level === 2);
  const level3 = ORG_POSITIONS.filter(p => p.level === 3);
  const level4 = ORG_POSITIONS.filter(p => p.level === 4);

  const getDivisionBadge = (division: string) => {
    switch (division) {
      case 'DIREKSI':
        return 'bg-purple-950/60 text-purple-400 border-purple-800/40';
      case 'PRODUKSI':
        return 'bg-amber-950/60 text-amber-400 border-amber-800/40';
      case 'QC_LAB':
        return 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40';
      case 'CUKAI_GUDANG':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40';
      case 'HRD_GA':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/40';
      case 'KEUANGAN':
        return 'bg-rose-950/60 text-rose-400 border-rose-800/40';
      default:
        return 'bg-stone-800 text-stone-400 border-stone-700';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Official Company Banner with Full Identity & Address */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              <span>Struktur Organisasi & Tata Kelola Perusahaan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              {COMPANY_PROFILE.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300">
              <span className="flex items-center gap-1 font-mono text-amber-400">
                <MapPin className="h-3.5 w-3.5" />
                {COMPANY_PROFILE.address}
              </span>
              <span>·</span>
              <span className="text-stone-400">{COMPANY_PROFILE.industry}</span>
              <span>·</span>
              <span className="text-stone-400">Kontak: {COMPANY_PROFILE.email}</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed pt-1">
              Bagan hirarki jabatan terpadu yang memadukan kepemimpinan eksekutif, divisi manufaktur berkecepatan tinggi (SKM), padat karya pelinting tangan (SKT), kepatuhan mutlak pita cukai Bea Cukai (CK-4/CK-5), serta penempatan <strong>Karyawan Berbasis AI (Aria)</strong> sebagai pendamping operasional langsung Direksi.
            </p>
          </div>

          <div className="w-full lg:w-auto p-4 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono space-y-2 text-stone-300 min-w-[260px]">
            <div className="text-amber-400 font-bold border-b border-stone-800 pb-2 flex items-center justify-between">
              <span>STATISTIK KETENAGAKERJAAN</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="flex justify-between py-1">
              <span>Total Formasi Jabatan:</span>
              <span className="font-bold text-stone-100">{ORG_POSITIONS.length} Posisi</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Pengrajin Padat Karya SKT:</span>
              <span className="font-bold text-amber-400">384 Orang</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Teknisi & Operator SKM:</span>
              <span className="font-bold text-cyan-400">24 Orang</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Asisten Intelijen AI:</span>
              <span className="font-bold text-purple-400">1 Unit Aktif</span>
            </div>
          </div>
        </div>

        {/* View Mode Switcher & Filter Controls */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setActiveTabMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTabMode === 'tree'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Bagan Visual Hirarki (Tree)</span>
            </button>

            <button
              onClick={() => setActiveTabMode('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTabMode === 'catalog'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Katalog Jabatan & Tupoksi</span>
            </button>

            <button
              onClick={() => setActiveTabMode('ai-matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTabMode === 'ai-matrix'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Matriks Integrasi Karyawan AI</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Bagan Resmi PT Batu Karang</span>
          </button>
        </div>
      </div>

      {/* MODE 1: VISUAL TREE STRUCTURE */}
      {activeTabMode === 'tree' && (
        <div className="space-y-8">
          {/* Level 1: Dewan Direksi & Staf Khusus AI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
              <span>LEVEL 1: DEWAN DIREKSI & ASISTEN KHUSUS INTELIJEN AI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {level1.map(pos => {
                const isSelected = selectedPosition.id === pos.id;
                const isAi = pos.id === 'pos-ai-officer';
                return (
                  <div
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : isAi
                          ? 'bg-purple-950/20 border-purple-700/50 hover:border-purple-600'
                          : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-amber-500 font-bold">{pos.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getDivisionBadge(pos.division)}`}>
                        {pos.division}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h4 className="font-bold text-stone-100 text-sm flex items-center gap-1.5">
                        {isAi && <Bot className="h-4 w-4 text-purple-400" />}
                        <span>{pos.title}</span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-1">{pos.holderName}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                      <span>{pos.location.split(' ')[0]}</span>
                      <span className="font-mono text-amber-400 font-semibold">{pos.headcount} Personel</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center text-stone-600">
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </div>

          {/* Level 2: Manajer Divisi Utama */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <span>LEVEL 2: KEPALA PABRIK & MANAJER DIVISI FUNGSIONAL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {level2.map(pos => {
                const isSelected = selectedPosition.id === pos.id;
                return (
                  <div
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-amber-500 font-bold">{pos.code}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${getDivisionBadge(pos.division)}`}>
                        {pos.division}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h4 className="font-bold text-stone-100 text-xs">{pos.title}</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">{pos.holderName}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{pos.headcount} Manajer</span>
                      <span className="text-amber-400 font-mono">Lapor: Direksi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center text-stone-600">
            <ArrowDown className="h-5 w-5" />
          </div>

          {/* Level 3: Supervisor & Mandor Lapangan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              <span>LEVEL 3: SUPERVISOR & MANDOR OPERASIONAL PABRIK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {level3.map(pos => {
                const isSelected = selectedPosition.id === pos.id;
                return (
                  <div
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-amber-500 font-bold">{pos.code}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${getDivisionBadge(pos.division)}`}>
                        {pos.division}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h4 className="font-bold text-stone-100 text-xs">{pos.title}</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">{pos.holderName}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{pos.headcount} Supervisor/Mandor</span>
                      <span className="text-stone-300 font-mono">Shift Lapangan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connector Down */}
          <div className="flex justify-center text-stone-600">
            <ArrowDown className="h-5 w-5" />
          </div>

          {/* Level 4: Operator, Teknisi & Pengrajin Padat Karya SKT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <span>LEVEL 4: OPERATOR MESIN SKM & PENGRAJIN PELINTING TANGAN SKT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {level4.map(pos => {
                const isSelected = selectedPosition.id === pos.id;
                return (
                  <div
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-stone-900/70 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-amber-500 font-bold">{pos.code}</span>
                      <span className="font-mono text-xs text-emerald-400 font-bold">{pos.headcount} Personel</span>
                    </div>

                    <div className="mt-2">
                      <h4 className="font-bold text-stone-100 text-sm">{pos.title}</h4>
                      <p className="text-xs text-stone-400 mt-1">{pos.holderName}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-800 text-[11px] text-stone-400">
                      <span>Lokasi: {pos.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CATALOG & JOB SPECIFICATION */}
      {activeTabMode === 'catalog' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-xl border border-stone-800">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nama jabatan, kode posisi, atau tugas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              <Filter className="h-3.5 w-3.5 text-stone-400 mr-1 hidden sm:inline" />
              {['ALL', 'DIREKSI', 'PRODUKSI', 'CUKAI_GUDANG', 'QC_LAB', 'HRD_GA', 'KEUANGAN'].map(div => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap ${
                    selectedDivision === div
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-950'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          {/* Positions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPositions.map(pos => (
              <div
                key={pos.id}
                onClick={() => setSelectedPosition(pos)}
                className="p-5 bg-stone-900/80 border border-stone-800 rounded-xl space-y-3 cursor-pointer hover:border-stone-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-500 font-bold">{pos.code}</span>
                      <span className="text-stone-500 text-xs">·</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getDivisionBadge(pos.division)}`}>
                        Level {pos.level} · {pos.division}
                      </span>
                    </div>
                    <h3 className="font-bold text-stone-100 text-base mt-1">{pos.title}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">Pemegang: {pos.holderName}</p>
                  </div>

                  <span className="font-mono text-xs text-stone-400 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                    {pos.headcount} Org
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {pos.description}
                </p>

                <div className="space-y-1 pt-1 border-t border-stone-800">
                  <span className="text-[11px] font-mono text-stone-400 uppercase font-semibold">Tugas Pokok:</span>
                  <ul className="text-xs text-stone-400 space-y-1 list-disc list-inside">
                    {pos.keyResponsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="truncate">{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: AI INTEGRATION MATRIX */}
      {activeTabMode === 'ai-matrix' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-400">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="text-purple-400 font-mono text-xs uppercase tracking-wider">Arsitektur Kolaborasi Manusia-AI</span>
              <h3 className="text-xl font-bold text-stone-100 mt-0.5">
                Bagaimana Karyawan AI (Aria) Mendukung Setiap Jabatan di PT Batu Karang
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Agen AI tidak menggantikan personel manufaktur, melainkan mempercepat pengambilan keputusan, mengeliminasi pekerjaan administratif manual, dan mengamankan kepatuhan hukum.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Posisi Jabatan</th>
                  <th className="py-3 px-4">Divisi</th>
                  <th className="py-3 px-4">Peran & Bantuan Karyawan AI</th>
                  <th className="py-3 px-4">Dampak Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 bg-stone-950/60 text-stone-300">
                {ORG_POSITIONS.map(pos => (
                  <tr key={pos.id} className="hover:bg-stone-900/50">
                    <td className="py-3 px-4 font-bold text-stone-100 whitespace-nowrap">
                      {pos.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getDivisionBadge(pos.division)}`}>
                        {pos.division}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-300 leading-relaxed font-sans">
                      {pos.aiIntegrationRole}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                      Otomatisasi 100%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SELECTED POSITION DETAIL CARD (INTERACTIVE DRAWER) */}
      {selectedPosition && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-500 font-bold">{selectedPosition.code}</span>
                <span className="text-stone-500">·</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getDivisionBadge(selectedPosition.division)}`}>
                  {selectedPosition.division}
                </span>
                <span className="text-stone-500">·</span>
                <span className="text-xs text-stone-400 font-mono">Tingkat Hirarki: Level {selectedPosition.level}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-100 mt-1">
                {selectedPosition.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Lokasi Penugasan: {selectedPosition.location} · Jumlah Formasi: {selectedPosition.headcount} Orang
              </p>
            </div>

            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono">
              <span className="text-stone-500 text-[10px] block">PEJABAT SAAT INI:</span>
              <span className="text-amber-400 font-bold text-sm">{selectedPosition.holderName}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-300 leading-relaxed">
            <span className="font-mono text-xs font-bold text-amber-500 uppercase block mb-1">Ikhtisar Jabatan:</span>
            {selectedPosition.description}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Responsibilities */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <span className="font-mono font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-amber-500" />
                <span>Tugas Pokok & Tanggung Jawab Utama:</span>
              </span>
              <ul className="space-y-2 text-stone-400 list-disc list-inside">
                {selectedPosition.keyResponsibilities.map((resp, i) => (
                  <li key={i} className="leading-relaxed">{resp}</li>
                ))}
              </ul>
            </div>

            {/* KPI Metrics */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <span className="font-mono font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Indikator Kinerja Utama (KPI Posisi):</span>
              </span>
              <ul className="space-y-2 text-stone-400 list-disc list-inside">
                {selectedPosition.kpiMetrics.map((kpi, i) => (
                  <li key={i} className="leading-relaxed text-stone-300 font-medium">{kpi}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Collaboration Role */}
          <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-lg space-y-2 text-xs">
            <span className="font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="h-4 w-4" />
              <span>Dukungan Karyawan AI untuk Posisi Ini:</span>
            </span>
            <p className="text-stone-300 leading-relaxed">
              {selectedPosition.aiIntegrationRole}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
