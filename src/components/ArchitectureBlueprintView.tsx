import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Layout, 
  Bot, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Workflow, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { ARCHITECTURE_BLUEPRINT } from '../data/architectureDocs';

export const ArchitectureBlueprintView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'sql' | 'backend' | 'frontend' | 'ai'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Executive Briefing for Owner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Blueprint Arsitektur Enterprise · Industri Hasil Tembakau (IHT)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              Rekomendasi Struktur Ideal Sistem Operasional & Karyawan AI Pabrik Rokok
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Bapak/Ibu Pemilik Pabrik, industri rokok memiliki dua karakteristik mutlak: <strong className="text-amber-400">kecepatan mesin maker yang luar biasa tinggi (3.000–8.000 batang/menit)</strong> dan <strong className="text-amber-400">kepatuhan pita cukai tanpa toleransi selisih (Zero Discrepancy)</strong>. Berikut rancangan arsitektur terpadu 3 pilar: Database SQL Relasional, Backend API Node.js Terpusat, Frontend React Responsif, serta Agen Karyawan AI Otonom.
            </p>
          </div>

          <div className="w-full lg:w-auto p-4 bg-stone-950/80 border border-stone-800 rounded-lg space-y-2 text-xs font-mono text-stone-400 min-w-[280px]">
            <div className="text-stone-300 font-semibold flex items-center gap-1.5 border-b border-stone-800 pb-2">
              <Workflow className="h-4 w-4 text-amber-500" />
              <span>Pipeline Data 4 Tahap</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>1. Edge IoT Mesin & RFID</span>
              <span className="text-emerald-400 font-bold">100ms</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>2. Backend Node.js Engine</span>
              <span className="text-amber-400 font-bold">OEE & Cukai</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>3. Relational SQL Storage</span>
              <span className="text-cyan-400 font-bold">ACID Strict</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>4. AI Autonomous Officer</span>
              <span className="text-purple-400 font-bold">Auto-Report</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Filter Tabs */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Fokus Lapisan:
          </span>
          {[
            { id: 'all', label: 'Ringkasan Seluruh Sistem' },
            { id: 'sql', label: '1. Database SQL Relasional' },
            { id: 'backend', label: '2. Backend API Node.js' },
            { id: 'frontend', label: '3. Frontend React Responsif' },
            { id: 'ai', label: '4. Agen Karyawan AI Otonom' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLayer(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedLayer === tab.id
                  ? 'bg-amber-600 text-stone-950 font-semibold shadow-sm'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer 1: Database SQL */}
      {(selectedLayer === 'all' || selectedLayer === 'sql') && (
        <section className="bg-stone-900/70 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider">Lapisan 01 · Fondasi Integritas Data</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                  Integrasi Database Relasional SQL (PostgreSQL / Cloud SQL)
                </h2>
                <p className="text-stone-300 text-sm mt-1">
                  Mengapa SQL mutlak untuk pabrik rokok? Karena regulasi Bea Cukai Republik Indonesia mewajibkan akurasi mutasi pita cukai dan bahan baku secara <em>append-only</em> dengan prinsip <strong>ACID</strong> (Zero Lost Record).
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Rationale & Best Practices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-950 border border-stone-800/80 rounded-lg space-y-2">
              <div className="text-amber-400 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero Discrepancy Pita Cukai</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Tabel <code className="text-stone-200">excise_stamp_inventory</code> menggunakan <code className="text-stone-200">GENERATED ALWAYS AS</code> untuk memastikan saldo sisa keping cukai selalu sinkron secara matematis terhadap jumlah pack yang dihasilkan mesin packer.
              </p>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800/80 rounded-lg space-y-2">
              <div className="text-cyan-400 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Traceability Batch Tembakau</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Setiap batch rajangan tembakau (Madura, Temanggung, Virginia) memiliki atribut kadar air (moisture %) dan formula saus yang terhubung langsung dengan ID shift produksi dan reject rate.
              </p>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800/80 rounded-lg space-y-2">
              <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Auditing Terenkripsi Bea Cukai</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Setiap keping pita cukai yang rusak saat penempelan mesin (afkir tempel) tercatat dengan nomor register unik dan langsung menghasilkan draf lampiran Berita Acara CK-4 resmi.
              </p>
            </div>
          </div>

          {/* Key SQL Tables for Tobacco Industry */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider font-mono">
              Entitas Inti Skema Pabrik Rokok:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'ref_products', desc: 'SKM, SKT, SPM, isi 12/16/20 batang, tarif cukai, HJE' },
                { name: 'raw_materials', desc: 'Tembakau Madura/Temanggung, Cengkeh, Saus, Papir, Filter' },
                { name: 'production_shifts', desc: 'Shift Pagi/Siang/Malam, target vs aktual, supervisor, OEE' },
                { name: 'machines', desc: 'Maker (Protos/Molins), Packer (HLP/GD), Meja Linting SKT' },
                { name: 'machine_downtime', desc: 'Log insiden: ganti pisau, nozzle lem, putus papir' },
                { name: 'excise_stamp_inventory', desc: 'Buku rekening pita cukai, terima Bea Cukai, pakai, afkir' },
                { name: 'quality_inspections', desc: 'Moisture %, berat per batang, tar & nicotine, hisapan' },
                { name: 'ai_shift_reports', desc: 'Memo analisis AI, root cause breakdown, rekomendasi' }
              ].map((tbl) => (
                <div key={tbl.name} className="p-3 bg-stone-950 border border-stone-800 rounded-lg">
                  <div className="font-mono text-xs text-amber-400 font-bold">{tbl.name}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{tbl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DDL Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">
                Struktur DDL SQL (PostgreSQL Standard):
              </span>
              <button
                onClick={() => handleCopy(ARCHITECTURE_BLUEPRINT.layers[0].ddlCode || '', 'sql-ddl')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
              >
                {copiedKey === 'sql-ddl' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'sql-ddl' ? 'Tersalin' : 'Salin DDL SQL'}</span>
              </button>
            </div>
            <pre className="p-4 bg-stone-950 rounded-lg border border-stone-800 overflow-x-auto text-xs font-mono text-stone-300 max-h-72 scrollbar-thin">
              <code>{ARCHITECTURE_BLUEPRINT.layers[0].ddlCode}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Layer 2: Centralized Node.js API */}
      {(selectedLayer === 'all' || selectedLayer === 'backend') && (
        <section className="bg-stone-900/70 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400">
                <Server className="h-6 w-6" />
              </div>
              <div>
                <span className="text-amber-400 font-mono text-xs uppercase tracking-wider">Lapisan 02 · Pusat Otomasi & Telemetri</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                  Backend API Terpusat (Node.js + Express / Fastify)
                </h2>
                <p className="text-stone-300 text-sm mt-1">
                  Arsitektur backend berperan sebagai orkestrator yang mengumpulkan pulsa telemetri sensor mesin pembuat batang, menghitung OEE secara terus-menerus, memvalidasi pemakaian pita cukai, dan mengeksekusi agen AI saat pergantian shift.
                </p>
              </div>
            </div>
          </div>

          {/* Node.js Pipeline Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                <span>1. Ingestion & OEE Worker Engine</span>
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Menerima data telemetri pulsa kecepatan (BPM) dari PLC mesin maker (Protos/Molins) dan packer (HLP/GD). Setiap 60 detik, worker menghitung metrik OEE standar:
              </p>
              <div className="p-2.5 bg-stone-900 rounded font-mono text-[11px] text-stone-300 space-y-1">
                <div>Availability = Operating Time / Planned Time</div>
                <div>Performance = Actual Sticks / Ideal Target Speed</div>
                <div>Quality = (Total Batang - Reject) / Total Batang</div>
                <div className="text-amber-400 font-bold">OEE = Availability × Performance × Quality</div>
              </div>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                <span>2. Cron Shift Auto-Reporter (Gemini LLM)</span>
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Jadwal cron otomatis berjalan pada menit ke-5 setelah shift berakhir:
              </p>
              <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
                <li>Pukul <strong className="text-stone-200">14:05 WIB</strong>: Wrap-up Shift 1 (Pagi)</li>
                <li>Pukul <strong className="text-stone-200">22:05 WIB</strong>: Wrap-up Shift 2 (Siang)</li>
                <li>Pukul <strong className="text-stone-200">06:05 WIB</strong>: Wrap-up Shift 3 (Malam)</li>
              </ul>
              <p className="text-xs text-stone-400">
                Agen AI mengekstrak data dari SQL, melakukan penalaran akar masalah (root cause), dan menyusun memo siap kirim ke WhatsApp / Email Owner.
              </p>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
              Spesifikasi Endpoint REST API Utama:
            </h4>
            <div className="overflow-x-auto rounded-lg border border-stone-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                  <tr>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3">Endpoint Route</th>
                    <th className="py-2.5 px-3">Fungsi Bisnis Pabrik Rokok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 bg-stone-950/60 text-stone-300">
                  {ARCHITECTURE_BLUEPRINT.layers[1].apiStructure?.map((api, idx) => (
                    <tr key={idx} className="hover:bg-stone-900/50">
                      <td className="py-2 px-3 font-bold text-amber-500">{api.method}</td>
                      <td className="py-2 px-3 text-stone-200">{api.path}</td>
                      <td className="py-2 px-3 text-stone-400">{api.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backend Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-400">
                Implementasi Service OEE & AI Worker (TypeScript):
              </span>
              <button
                onClick={() => handleCopy(ARCHITECTURE_BLUEPRINT.layers[1].backendCode || '', 'backend-ts')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
              >
                {copiedKey === 'backend-ts' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'backend-ts' ? 'Tersalin' : 'Salin Kode Node.js'}</span>
              </button>
            </div>
            <pre className="p-4 bg-stone-950 rounded-lg border border-stone-800 overflow-x-auto text-xs font-mono text-stone-300 max-h-72 scrollbar-thin">
              <code>{ARCHITECTURE_BLUEPRINT.layers[1].backendCode}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Layer 3: Frontend React Responsif */}
      {(selectedLayer === 'all' || selectedLayer === 'frontend') && (
        <section className="bg-stone-900/70 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                <Layout className="h-6 w-6" />
              </div>
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider">Lapisan 03 · Observabilitas Visual</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                  Frontend React Responsif & Dashboard Interaktif
                </h2>
                <p className="text-stone-300 text-sm mt-1">
                  Antarmuka pengguna didesain dengan prinsip <em>Industrial High-Density & Clean Typography</em>. Memberikan visibilitas instan tanpa clutter visual, baik diakses dari monitor control room maupun tablet mandor lapangan.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <span className="text-amber-400 font-mono text-xs font-semibold">1. Telemetri Real-Time</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Menggunakan WebSocket / Server-Sent Events (SSE) dengan reconnection backoff otomatis, menampilkan laju batang per menit (BPM) dan reject count secara live tanpa refresh.
              </p>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <span className="text-emerald-400 font-mono text-xs font-semibold">2. Zero-Pill Typography</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Metadata pabrik seperti nomor batch, suhu bearing, kelembaban tembakau, dan nama mandor dirender bersih dengan separator tipografi tanpa pill badge yang mengganggu pandangan teknis.
              </p>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <span className="text-cyan-400 font-mono text-xs font-semibold">3. Multi-Role UI</span>
              <p className="text-xs text-stone-400 leading-relaxed">
                Tampilan dapat beralih otomatis sesuai peran: View Ringkas Eksekutif untuk Owner, View Telemetri Mesin untuk Supervisor Teknik, dan View Rekonsiliasi Cukai untuk Petugas Kepatuhan.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Layer 4: AI Autonomous Employee */}
      {(selectedLayer === 'all' || selectedLayer === 'ai') && (
        <section className="bg-stone-900/70 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-400">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="text-purple-400 font-mono text-xs uppercase tracking-wider">Lapisan 04 · Otomasi Kognitif</span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                  Implementasi Karyawan Berbasis AI (AI Operations & Admin Officer)
                </h2>
                <p className="text-stone-300 text-sm mt-1">
                  Karyawan AI bukan sekadar chatbot biasa, melainkan <strong>agen otonom</strong> yang memiliki wewenang membaca data database, melakukan rekonsiliasi angka, menyusun laporan resmi, dan memberi peringatan dini sebelum kerugian terjadi.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="bg-stone-950 border border-stone-800 rounded-lg p-5">
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-4">
              Siklus Kerja Mandiri Karyawan AI Pabrik:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-stone-900/70 border border-stone-800 rounded">
                <div className="text-purple-400 font-bold mb-1">TAHAP 1: INGEST</div>
                <p className="text-stone-400 text-[11px]">
                  Mengambil data sensor mesin maker, timbangan tembakau, output packer, dan mutasi pita cukai dari SQL.
                </p>
              </div>
              <div className="p-3 bg-stone-900/70 border border-stone-800 rounded">
                <div className="text-amber-400 font-bold mb-1">TAHAP 2: RECONCILE</div>
                <p className="text-stone-400 text-[11px]">
                  Memvalidasi formula: Output Batang = (Packs × Batang/Pack) + Reject. Mencocokkan dengan keping pita cukai terpakai.
                </p>
              </div>
              <div className="p-3 bg-stone-900/70 border border-stone-800 rounded">
                <div className="text-cyan-400 font-bold mb-1">TAHAP 3: REASONING</div>
                <p className="text-stone-400 text-[11px]">
                  Menganalisis korelasi kelembaban tembakau vs reject rate dan mengidentifikasi penyebab bottleneck OEE.
                </p>
              </div>
              <div className="p-3 bg-stone-900/70 border border-stone-800 rounded">
                <div className="text-emerald-400 font-bold mb-1">TAHAP 4: DISPATCH</div>
                <p className="text-stone-400 text-[11px]">
                  Menghasilkan memo laporan resmi shift, Berita Acara Bea Cukai, dan notifikasi instan ke smartphone Owner.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Summary Advice for the Cigarette Company Owner */}
      <div className="bg-amber-950/20 border border-amber-700/40 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="h-5 w-5" />
          <span>Panduan Eksekusi Bertahap (Roadmap Implementasi):</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          <strong>Fase 1 (Bulan 1):</strong> Bangun skema SQL relasional dan integrasikan timbangan bahan baku serta pencatatan pita cukai manual untuk menutup celah kebocoran fisik.<br />
          <strong>Fase 2 (Bulan 2):</strong> Pasang edge gateway pada PLC mesin maker (Protos/Molins) dan packer untuk telemetri real-time ke backend Node.js.<br />
          <strong>Fase 3 (Bulan 3):</strong> Aktifkan Dashboard React dan Asisten AI untuk mengotomatiskan pembuatan laporan shift, audit CK-4, dan prediksi kebutuhan bahan baku.
        </p>
      </div>
    </div>
  );
};
