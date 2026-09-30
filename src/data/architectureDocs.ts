export interface ArchitectureSection {
  id: string;
  title: string;
  badge: string;
  description: string;
  highlights: string[];
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
}

export const ARCHITECTURE_BLUEPRINT = {
  overview: {
    systemName: "SIGAP-BatuKarang (Sistem Informasi & Gerak Pintar Pabrik Rokok PT Batu Karang)",
    subtitle: "Rekomendasi Arsitektur Enterprise Berbasis Node.js, SQL Relasional, React, dan Agen AI",
    targetFactoryProfile: "PT Batu Karang (Jl. Raya Parangargo 153 Wagir - Malang), Kombinasi SKM berkecepatan tinggi & SKT padat karya, Kepatuhan Pita Cukai Bea Cukai RI (CK-4/CK-5)."
  },
  layers: [
    {
      id: "database-sql",
      number: "01",
      title: "Lapisan 1: Integrasi Database Relasional SQL (PostgreSQL / Cloud SQL)",
      tagline: "Integritas Data Transaksional, Traceability Batch, & Kepatuhan Audit Cukai Tanpa Selisih",
      whySql: "Industri rokok memiliki regulasi sangat ketat terkait pita cukai dan mutasi tembakau. Transaksi wajib berprinsip ACID (Atomicity, Consistency, Isolation, Durability) agar tidak ada 1 keping pun pita cukai atau 1 kg tembakau yang hilang atau tidak balance.",
      keyFeatures: [
        "Skema Terisolasi per Domain: Master Produk, Bahan Baku (Tembakau, Cengkeh, Saus), Jalur Produksi, Log Mesin, Pita Cukai, dan Audit AI.",
        "Strict Foreign Keys & Check Constraints untuk mencegah input cacat (misal: reject count tidak boleh melebihi total output).",
        "Append-Only Audit Logs & Database Triggers untuk setiap mutasi pita cukai (Persiapan audit Bea Cukai).",
        "Partisi Tabel Berdasarkan Waktu (Range Partitioning bulanan) pada tabel log sensor telemetri mesin (`machine_telemetry_logs`).",
        "Optimasi Indeks B-Tree & Composite Indexes untuk kueri agregasi OEE real-time per shift dan per mesin."
      ],
      tables: [
        {
          name: "ref_products",
          description: "Katalog SKU rokok (SKM Filter, SKT Kretek Tangan, SPM Putih) lengkap dengan tarif cukai, HJE, dan konversi pack/slop/bal."
        },
        {
          name: "raw_materials & inventory_batches",
          description: "Stok tembakau (Madura, Temanggung, Virginia), cengkeh, saus, papir bobbin, filter tow, dengan atribut moisture % dan nomor batch panen."
        },
        {
          name: "production_lines & machines",
          description: "Hirarki jalur produksi: Mesin Maker (pembuat batang), Mesin Packer (pembungkus), Boxer, dan Stasiun Meja Linting SKT."
        },
        {
          name: "production_shifts & shift_logs",
          description: "Catatan transaksi operasional per shift (Pagi/Siang/Malam), target vs aktual output, konsumsi bahan baku, dan supervisor in charge."
        },
        {
          name: "machine_downtime_events",
          description: "Log insiden penghentian mesin: kategori breakdown, planned maintenance, kehabisan material, atau pembersihan nozzle saus/lem."
        },
        {
          name: "excise_stamp_inventory & reconciliation",
          description: "Buku rekening pita cukai (Bea Cukai): lembar diterima, nomor seri, terpakai di packer, afkir rusak tempel, dan saldo fisik harian (CK-4)."
        },
        {
          name: "quality_control_inspections",
          description: "Inspeksi laboratorium QC: uji kadar air tembakau, berat batang rata-rata, uji hisap (draw resistance), tar & nikotin."
        },
        {
          name: "ai_agent_reports & audit_actions",
          description: "Penyimpanan permanen hasil analisis AI, memo shift otomatis, log intervensi AI, dan verifikasi tanda tangan digital."
        }
      ],
      ddlCode: `-- ============================================================
-- SCHEMA REKOMENDASI PABRIK ROKOK: POSTGRESQL / CLOUD SQL
-- ============================================================

-- 1. Master Produk & Konfigurasi Cukai
CREATE TABLE ref_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'SKM-BOLD-16'
    name VARCHAR(128) NOT NULL,
    category VARCHAR(16) NOT NULL CHECK (category IN ('SKM', 'SKT', 'SPM')),
    sticks_per_pack INT NOT NULL CHECK (sticks_per_pack IN (10, 12, 16, 20, 50)),
    packs_per_slop INT NOT NULL DEFAULT 10,
    slops_per_bal INT NOT NULL DEFAULT 20,
    excise_tariff_per_stick NUMERIC(12,2) NOT NULL, -- Tarif Cukai PMK RI
    hje_retail_price NUMERIC(12,2) NOT NULL,        -- Harga Jual Eceran per bungkus
    excise_stamp_series VARCHAR(64) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Master Mesin & Line Produksi
CREATE TABLE production_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(16) NOT NULL CHECK (category IN ('SKM', 'SKT', 'SPM')),
    nominal_capacity_per_hour BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_id UUID NOT NULL REFERENCES production_lines(id) ON DELETE RESTRICT,
    code VARCHAR(32) UNIQUE NOT NULL, -- e.g. 'MKR-01', 'PCK-01'
    name VARCHAR(128) NOT NULL,
    machine_type VARCHAR(32) NOT NULL CHECK (machine_type IN ('MAKER', 'PACKER', 'CUTTER', 'ROLLING_BENCH')),
    target_speed_bpm INT NOT NULL DEFAULT 6000, -- Batang / Bungkus per menit
    status VARCHAR(24) NOT NULL DEFAULT 'IDLE' CHECK (status IN ('RUNNING', 'IDLE', 'MAINTENANCE', 'ALERT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Transaksi Shift Produksi & OEE Log
CREATE TABLE production_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_code VARCHAR(32) UNIQUE NOT NULL, -- e.g. '2026-09-30-S1'
    shift_name VARCHAR(24) NOT NULL CHECK (shift_name IN ('SHIFT_1_PAGI', 'SHIFT_2_SIANG', 'SHIFT_3_MALAM')),
    shift_date DATE NOT NULL,
    supervisor_name VARCHAR(128) NOT NULL,
    total_sticks_produced BIGINT NOT NULL DEFAULT 0,
    total_packs_produced BIGINT NOT NULL DEFAULT 0,
    total_reject_sticks BIGINT NOT NULL DEFAULT 0,
    overall_oee_pct NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'CLOSED', 'AUDITED_AI')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 4. Rekonsiliasi Pita Cukai Bea Cukai (Zero Discrepancy Enforced)
CREATE TABLE excise_stamp_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES ref_products(id),
    series_code VARCHAR(64) NOT NULL,
    total_stamps_received INT NOT NULL DEFAULT 0,
    stamps_used_in_production INT NOT NULL DEFAULT 0,
    stamps_damaged_affkir INT NOT NULL DEFAULT 0, -- Wajib BA Pemusnahan/Retur Bea Cukai
    stamps_balance INT GENERATED ALWAYS AS (total_stamps_received - stamps_used_in_production - stamps_damaged_affkir) STORED,
    last_reconciliation_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabel Laporan & Rekomendasi Asisten AI Karyawan
CREATE TABLE ai_shift_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID NOT NULL REFERENCES production_shifts(id) ON DELETE CASCADE,
    report_number VARCHAR(64) UNIQUE NOT NULL,
    executive_summary TEXT NOT NULL,
    root_cause_analysis JSONB NOT NULL,
    cukai_reconciliation_data JSONB NOT NULL,
    cost_efficiency_score NUMERIC(5,2) NOT NULL,
    generated_by_agent VARCHAR(64) NOT NULL DEFAULT 'Aria-AI-Officer',
    is_approved_by_owner BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index Penting untuk Analitik Cepat Real-time
CREATE INDEX idx_shifts_date_name ON production_shifts(shift_date, shift_name);
CREATE INDEX idx_machines_line_status ON machines(line_id, status);
CREATE INDEX idx_cukai_product ON excise_stamp_inventory(product_id);`
    },
    {
      id: "backend-api",
      number: "02",
      title: "Lapisan 2: Backend API Terpusat (Node.js + Express / Fastify)",
      tagline: "Event-Driven Telemetry Ingestion, Pipeline Analitik OEE, & Agen AI Terisolasi",
      whySql: "Node.js unggul dalam penanganan I/O asinkron frekuensi tinggi (menerima pulsa telemetri ratusan mesin dan timbangan digital tanpa bottleneck) serta integrasi mulus dengan LLM SDK dan scheduler otomatis.",
      keyFeatures: [
        "Modular Clean Architecture: Pemisahan tegas antara Route Controller, Service Layer, Repository Layer, dan Worker Threads.",
        "Edge Telemetry Ingestion: Menerima data PLC / IoT dari mesin maker (batang/detik) dan packer (bungkus/detik) melalui REST & WebSocket.",
        "OEE Calculation Engine: Algoritma otomatis penghitung Availability × Performance × Quality secara real-time setiap 60 detik.",
        "Excise Reconciliation Worker: Validasi otomatis antara total pack yang diproduksi dengan keping pita cukai yang terpakai; mendeteksi deviasi secara instan.",
        "Automated AI Worker (Gemini API Integration): Cron trigger setiap akhir shift untuk membaca metrik pabrik, merangkum anomali, menyusun draft CK-4, dan mengirim laporan ringkas ke WhatsApp Direksi."
      ],
      apiStructure: [
        { path: "/api/v1/factory/overview", method: "GET", desc: "Ringkasan metrik eksekutif (Total batang, OEE keseluruhan, reject rate, status cukai)." },
        { path: "/api/v1/telemetry/ingest", method: "POST", desc: "Endpoint cepat untuk mesin maker & packer mengirim detak produksi (speed bpm, reject, moisture)." },
        { path: "/api/v1/production/shifts/current", method: "GET", desc: "Data real-time shift yang sedang berjalan (Shift Pagi, Siang, atau Malam)." },
        { path: "/api/v1/excise/reconciliation", method: "GET / POST", desc: "Audit rekonsiliasi pita cukai harian dan pencatatan afkir rusak tempel." },
        { path: "/api/v1/ai/generate-shift-report", method: "POST", desc: "Memanggil Agen AI untuk menganalisis data shift dan menyusun memo resmi." },
        { path: "/api/v1/ai/chat-assistant", method: "POST", desc: "Endpoint tanya-jawab natural language dengan konteks operasional pabrik terkini." },
        { path: "/api/v1/reports/export/pdf", method: "POST", desc: "Export dokumen resmi (Laporan Shift & Rekap CK-4 Bea Cukai) ke PDF." }
      ],
      backendCode: `// ============================================================
// STRUKTUR BACKEND NODE.JS TERPUSAT (EXPRESS + TYPESCRIPT)
// ============================================================

// 1. Service: Kalkulator OEE Mesin Otomatis
export class OeeCalculationService {
  public calculateOEE(data: {
    plannedProductionMinutes: number;
    downtimeMinutes: number;
    actualSpeedBpm: number;
    idealSpeedBpm: number;
    totalSticksProduced: number;
    rejectSticksCount: number;
  }) {
    // 1. Availability = Operating Time / Planned Production Time
    const operatingMinutes = Math.max(0, data.plannedProductionMinutes - data.downtimeMinutes);
    const availability = data.plannedProductionMinutes > 0 ? (operatingMinutes / data.plannedProductionMinutes) : 0;

    // 2. Performance = (Total Batang / Operating Time) / Ideal Speed
    const expectedSticks = operatingMinutes * data.idealSpeedBpm;
    const performance = expectedSticks > 0 ? Math.min(1.0, data.totalSticksProduced / expectedSticks) : 0;

    // 3. Quality = Good Sticks / Total Sticks
    const goodSticks = Math.max(0, data.totalSticksProduced - data.rejectSticksCount);
    const quality = data.totalSticksProduced > 0 ? (goodSticks / data.totalSticksProduced) : 1;

    // Overall OEE
    const overallOee = availability * performance * quality;

    return {
      availabilityPct: Number((availability * 100).toFixed(1)),
      performancePct: Number((performance * 100).toFixed(1)),
      qualityPct: Number((quality * 100).toFixed(1)),
      overallOeePct: Number((overallOee * 100).toFixed(1)),
      isWorldClass: overallOee >= 0.85 // Standar World Class OEE > 85%
    };
  }
}

// 2. Service: Integrasi AI Employee (Gemini API) untuk Laporan Shift
import { GoogleGenAI } from '@google/genai';

export class FactoryAiOfficerService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  public async generateExecutiveShiftReport(shiftData: any) {
    const prompt = \`
Anda adalah "Aria", Karyawan AI Eksekutif Bidang Operasional & Kepatuhan Pabrik Rokok.
Tugas Anda adalah memeriksa data shift berikut dan menghasilkan:
1. Ringkasan Eksekutif untuk Direktur / Owner Pabrik.
2. Analisis Akar Masalah (Root Cause) jika ada downtime mesin atau reject tinggi.
3. Verifikasi Kepatuhan Pita Cukai (Pastikan tidak ada selisih keping cukai vs pack masuk gudang).
4. Rekomendasi Operasional preventif untuk shift berikutnya.

Data Operasional Shift:
\${JSON.stringify(shiftData, null, 2)}

Gunakan bahasa Indonesia profesional, tegas, berbasis data numerik, dan ringkas.
\`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      generatedReport: response.text,
      timestamp: new Date().toISOString(),
      agentName: 'Aria - AI Operations Officer'
    };
  }
}`
    },
    {
      id: "frontend-react",
      number: "03",
      title: "Lapisan 3: Frontend React Responsif & Dashboard Interaktif",
      tagline: "Observabilitas Pabrik Tanpa Distraksi, Visualisasi OEE, & Portal Asisten AI",
      whySql: "Memberikan pengalaman pengguna yang sangat cepat, interaktif, dan responsif baik untuk tablet mandor di lantai produksi maupun laptop/smartphone Owner.",
      keyFeatures: [
        "Desain Industri Modern Tanpa Slop (Clean Industrial Aesthetic): Tata letak data-dense, kontras tinggi, bebas dari badge pil dekoratif, tipografi fungsional.",
        "Live Polling / WebSocket Telemetry Hook: Pembaruan kecepatan mesin dan output batang tanpa reload halaman.",
        "Interactive Line Drill-down: Owner dapat mengklik Line SKM 1 untuk memeriksa detail suhu maker, kelembaban tembakau di hopper, dan log pisau potong.",
        "One-Click Automated Reporting: Tombol instan untuk memerintahkan Asisten AI menyusun draft laporan shift, mengecek kepatuhan cukai, atau mencetak PDF.",
        "Excise Stamp Balancing Matrix: Visualizer khusus pergerakan pita cukai dari gudang brankas ke mesin packer hingga gudang jadi."
      ]
    },
    {
      id: "ai-employee-workflow",
      number: "04",
      title: "Lapisan 4: Karyawan Berbasis AI (AI Autonomous Administrative Officer)",
      tagline: "Otomasi Pelaporan, Diagnostik Anomali, dan Asistensi Keputusan Eksekutif",
      whySql: "Menghilangkan beban kerja manual staf administrasi pabrik (yang sering menghabiskan 2-3 jam setiap pergantian shift hanya untuk merekap kertas kerja, menghitung pita cukai di Excel, dan menulis notulen kendala mesin).",
      keyFeatures: [
        "Shift Handover Automation: Tepat pada menit ke-5 setelah shift berakhir, AI menarik data timbangan tembakau, output maker, output packer, dan stok cukai secara otomatis.",
        "Zero-Variance Excise Audit: AI mencocokkan rumus matematika: (Output Batang / Isi per Pack) + Afkir Rusak == Pemakaian Pita Cukai. Jika ada selisih >0 keping, alarm instan berbunyi.",
        "Root Cause Diagnostics: Ketika terjadi lonjakan reject >2%, AI membaca korelasi sensor (misal: kelembaban tembakau turun di bawah 12% menyebabkan daun getas/patah).",
        "Executive Q&A: Owner dapat bertanya langsung melalui chat natural language: 'Berapa biaya pita cukai yang kita pakai hari ini?' atau 'Mesin mana yang paling sering macet minggu ini?'",
        "Direct Dispatch: Menghubungkan draft memo ke saluran komunikasi eksekutif (WhatsApp Bot / Email Digest otomatis)."
      ]
    }
  ]
};
