import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Table, 
  Key, 
  Sparkles, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const SqlSchemaExplorer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('production_shifts');
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryExecuted, setQueryExecuted] = useState(false);

  const tables = [
    {
      name: 'ref_products',
      desc: 'Master SKU rokok, spesifikasi batang/bungkus/slop/bal, tarif cukai PMK & HJE',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Identifikasi unik produk' },
        { name: 'code', type: 'VARCHAR(32)', key: 'UQ', desc: 'Kode SKU unik (e.g. SKM-BOLD-16)' },
        { name: 'name', type: 'VARCHAR(128)', key: '', desc: 'Nama merek dagang rokok' },
        { name: 'category', type: 'VARCHAR(16)', key: 'CHK', desc: 'SKM / SKT / SPM' },
        { name: 'sticks_per_pack', type: 'INT', key: '', desc: 'Isi batang per bungkus (12, 16, 20)' },
        { name: 'excise_tariff_per_stick', type: 'NUMERIC(12,2)', key: '', desc: 'Tarif cukai per batang (Bea Cukai)' },
        { name: 'hje_retail_price', type: 'NUMERIC(12,2)', key: '', desc: 'Harga Jual Eceran banderol' }
      ]
    },
    {
      name: 'production_shifts',
      desc: 'Transaksi shift harian (Pagi/Siang/Malam), target vs aktual, supervisor, OEE',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'ID unik sesi shift' },
        { name: 'shift_code', type: 'VARCHAR(32)', key: 'UQ', desc: 'Kode shift (e.g. 2026-09-30-S1)' },
        { name: 'shift_name', type: 'VARCHAR(24)', key: 'CHK', desc: 'SHIFT_1_PAGI / SHIFT_2 / SHIFT_3' },
        { name: 'shift_date', type: 'DATE', key: 'IDX', desc: 'Tanggal operasional pabrik' },
        { name: 'supervisor_name', type: 'VARCHAR(128)', key: '', desc: 'Penanggung jawab shift' },
        { name: 'total_sticks_produced', type: 'BIGINT', key: '', desc: 'Jumlah total batang lolos sortir' },
        { name: 'overall_oee_pct', type: 'NUMERIC(5,2)', key: '', desc: 'Efisiensi OEE terhitung' }
      ]
    },
    {
      name: 'excise_stamp_inventory',
      desc: 'Buku rekening pita cukai (Bea Cukai), penerimaan, pemakaian packer, afkir rusak tempel',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'ID unik rekening pita cukai' },
        { name: 'product_id', type: 'UUID', key: 'FK', desc: 'Relasi ke ref_products.id' },
        { name: 'series_code', type: 'VARCHAR(64)', key: '', desc: 'Nomor seri lembar pita cukai tahun berjalan' },
        { name: 'total_stamps_received', type: 'INT', key: '', desc: 'Total keping diterima dari KPPBC' },
        { name: 'stamps_used_in_production', type: 'INT', key: '', desc: 'Keping tertempel di kemasan masuk gudang' },
        { name: 'stamps_damaged_affkir', type: 'INT', key: '', desc: 'Keping rusak penempelan (lampiran CK-4)' },
        { name: 'stamps_balance', type: 'INT', key: 'GEN', desc: 'Saldo sisa (Generated Stored Column)' }
      ]
    },
    {
      name: 'raw_materials',
      desc: 'Persediaan rajangan tembakau, cengkeh, saus, bobbin papir, dan filter rod',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'ID unik bahan baku' },
        { name: 'code', type: 'VARCHAR(32)', key: 'UQ', desc: 'Kode bahan (e.g. RAW-TOB-MD)' },
        { name: 'name', type: 'VARCHAR(128)', key: '', desc: 'Nama deskriptif bahan baku' },
        { name: 'category', type: 'VARCHAR(32)', key: '', desc: 'TEMBAKAU / CENGKEH / SAUS / PAPIR' },
        { name: 'stock_on_hand', type: 'NUMERIC(12,2)', key: '', desc: 'Jumlah fisik di gudang primary' },
        { name: 'unit', type: 'VARCHAR(16)', key: '', desc: 'kg / liter / bobbin / rod' },
        { name: 'moisture_target_pct', type: 'VARCHAR(32)', key: '', desc: 'Batas kadar air ideal (12.5% - 13.5%)' }
      ]
    }
  ];

  const sampleQueries = [
    {
      title: "Query 1: Hitung OEE per Shift per Mesin Maker & Packer",
      desc: "Menghitung Availability, Performance, Quality, dan Overall OEE secara otomatis dari tabel log telemetri.",
      sql: `-- QUERY 1: ANALISIS OEE MESIN PABRIK ROKOK
SELECT 
    m.code AS machine_code,
    m.name AS machine_name,
    m.machine_type,
    ROUND((s.operating_minutes::numeric / s.planned_minutes::numeric) * 100, 2) AS availability_pct,
    ROUND((s.actual_sticks_output::numeric / (s.operating_minutes * m.target_speed_bpm)::numeric) * 100, 2) AS performance_pct,
    ROUND(((s.actual_sticks_output - s.reject_sticks)::numeric / s.actual_sticks_output::numeric) * 100, 2) AS quality_pct,
    ROUND(
        ((s.operating_minutes::numeric / s.planned_minutes::numeric) *
         (s.actual_sticks_output::numeric / (s.operating_minutes * m.target_speed_bpm)::numeric) *
         ((s.actual_sticks_output - s.reject_sticks)::numeric / s.actual_sticks_output::numeric)) * 100,
        2
    ) AS overall_oee_pct
FROM machines m
JOIN machine_shift_logs s ON m.id = s.machine_id
WHERE s.shift_date = CURRENT_DATE
ORDER BY overall_oee_pct DESC;`,
      result: [
        { machine_code: 'MKR-01', machine_name: 'Protos-M8 High-Speed', machine_type: 'MAKER', availability_pct: '93.6%', performance_pct: '96.0%', quality_pct: '98.8%', overall_oee_pct: '88.8%' },
        { machine_code: 'PCK-01', machine_name: 'HLP-250 Packer Boxer', machine_type: 'PACKER', availability_pct: '92.0%', performance_pct: '96.2%', quality_pct: '99.3%', overall_oee_pct: '87.9%' },
        { machine_code: 'MKR-02', machine_name: 'Molins MK-9 Cig Maker', machine_type: 'MAKER', availability_pct: '86.3%', performance_pct: '90.7%', quality_pct: '98.3%', overall_oee_pct: '76.9%' }
      ]
    },
    {
      title: "Query 2: Deteksi Selisih Pita Cukai (Zero-Discrepancy Audit CK-4)",
      desc: "Audit kepatuhan Bea Cukai untuk mendeteksi apakah ada deviasi antara keping cukai yang dipakai vs jumlah kemasan fisik yang masuk gudang.",
      sql: `-- QUERY 2: AUDIT REKONSILIASI PITA CUKAI BEA CUKAI
SELECT 
    p.code AS product_code,
    p.name AS product_name,
    e.series_code,
    e.stamps_used_in_production AS keping_cukai_terpakai,
    (g.total_packs_received) AS kemasan_masuk_gudang,
    e.stamps_damaged_affkir AS keping_rusak_mesin,
    (e.stamps_used_in_production - g.total_packs_received) AS selisih_keping,
    CASE 
        WHEN (e.stamps_used_in_production - g.total_packs_received) = 0 THEN 'VALID (NOL SELISIH)'
        ELSE 'ALERT INVESTIGASI'
    END AS status_audit_cukai
FROM excise_stamp_inventory e
JOIN ref_products p ON e.product_id = p.id
JOIN finished_goods_reconciliation g ON g.product_id = p.id AND g.audit_date = CURRENT_DATE;`,
      result: [
        { product_code: 'SKM-BKR-16', product_name: 'Batu Karang Filter Bold 16s', series_code: 'SERI-II-SKM-2026-B', keping_cukai_terpakai: '195.312', kemasan_masuk_gudang: '195.312', keping_rusak_mesin: '142', selisih_keping: '0', status_audit_cukai: 'VALID (NOL SELISIH)' },
        { product_code: 'SKM-MLD-16', product_name: 'Batu Karang Mild Menthol 16s', series_code: 'SERI-II-SKM-2026-M', keping_cukai_terpakai: '167.500', kemasan_masuk_gudang: '167.500', keping_rusak_mesin: '185', selisih_keping: '0', status_audit_cukai: 'VALID (NOL SELISIH)' },
        { product_code: 'SKT-KLB-12', product_name: 'Batu Karang Kretek Tangan 12s', series_code: 'SERI-II-SKT-2026-A', keping_cukai_terpakai: '66.033', kemasan_masuk_gudang: '66.033', keping_rusak_mesin: '42', selisih_keping: '0', status_audit_cukai: 'VALID (NOL SELISIH)' }
      ]
    },
    {
      title: "Query 3: Proyeksi Kebutuhan Tembakau & Hari Ketahanan Stok",
      desc: "Menghitung laju pemakaian tembakau dan cengkeh berdasarkan target produksi 7 hari ke depan untuk otomatisasi Purchase Order.",
      sql: `-- QUERY 3: PROYEKSI KEBUTUHAN BAHAN BAKU (PRIMARY BLENDING)
SELECT 
    r.code AS material_code,
    r.name AS material_name,
    r.stock_on_hand AS stok_saat_ini_kg,
    r.daily_consumption_kg AS konsumsi_harian_kg,
    ROUND((r.stock_on_hand / NULLIF(r.daily_consumption_kg, 0)), 1) AS hari_ketahanan_stok,
    CASE 
        WHEN (r.stock_on_hand / NULLIF(r.daily_consumption_kg, 0)) < 7 THEN 'KRITIS - SEGERA PO'
        WHEN (r.stock_on_hand / NULLIF(r.daily_consumption_kg, 0)) < 14 THEN 'WASPADA - RESTOCK'
        ELSE 'AMAN'
    END AS status_pengadaan
FROM raw_materials r
WHERE r.category IN ('TEMBAKAU', 'CENGKEH', 'SAUS_FLAVOR')
ORDER BY hari_ketahanan_stok ASC;`,
      result: [
        { material_code: 'RAW-FLV-04B', material_name: 'Saus Aroma Formula #04B', stok_saat_ini_kg: '4.200 liter', konsumsi_harian_kg: '380 liter', hari_ketahanan_stok: '11.0 hari', status_pengadaan: 'WASPADA - RESTOCK' },
        { material_code: 'RAW-CLV-MND', material_name: 'Cengkeh Pilihan Rajang Manado', stok_saat_ini_kg: '18.600 kg', konsumsi_harian_kg: '1.450 kg', hari_ketahanan_stok: '12.8 hari', status_pengadaan: 'WASPADA - RESTOCK' },
        { material_code: 'RAW-TOB-TMG', material_name: 'Tembakau Temanggung Srintil', stok_saat_ini_kg: '24.200 kg', konsumsi_harian_kg: '1.800 kg', hari_ketahanan_stok: '13.4 hari', status_pengadaan: 'WASPADA - RESTOCK' },
        { material_code: 'RAW-TOB-MD', material_name: 'Tembakau Madura Grade A', stok_saat_ini_kg: '48.500 kg', konsumsi_harian_kg: '3.200 kg', hari_ketahanan_stok: '15.1 hari', status_pengadaan: 'AMAN' }
      ]
    }
  ];

  const currentTableData = tables.find(t => t.name === selectedTable) || tables[0];
  const activeQuery = sampleQueries[activeQueryIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleExecuteQuery = () => {
    setQueryRunning(true);
    setTimeout(() => {
      setQueryRunning(false);
      setQueryExecuted(true);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>KAMUS DATA RELASIONAL & ANALYTICS SQL ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight mt-1">
            Skema Database Relasional & Query Kinerja Pabrik
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Arsitektur tabel SQL ternormalisasi (3NF) dirancang khusus untuk mematuhi regulasi Bea Cukai dan kalkulasi OEE frekuensi tinggi.
          </p>
        </div>
      </div>

      {/* Table Structure Explorer */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-stone-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Table className="h-4 w-4 text-amber-500" />
            <span>Kamus Kolom Tabel SQL:</span>
          </h3>

          <div className="flex items-center gap-1 overflow-x-auto bg-stone-950 p-1 rounded-lg border border-stone-800 max-w-full">
            {tables.map(tbl => (
              <button
                key={tbl.name}
                onClick={() => setSelectedTable(tbl.name)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                  selectedTable === tbl.name
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tbl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Table Metadata */}
        <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 text-xs">
          <span className="font-mono text-amber-500 font-bold text-sm block">{currentTableData.name}</span>
          <span className="text-stone-400 text-xs mt-0.5 block">{currentTableData.desc}</span>
        </div>

        {/* Column Definition Grid */}
        <div className="overflow-x-auto border border-stone-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
              <tr>
                <th className="py-2.5 px-3">Kolom</th>
                <th className="py-2.5 px-3">Tipe Data</th>
                <th className="py-2.5 px-3">Key / Constraint</th>
                <th className="py-2.5 px-3">Deskripsi Lapangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 bg-stone-950/60 text-stone-300">
              {currentTableData.columns.map((col, idx) => (
                <tr key={idx} className="hover:bg-stone-900/50">
                  <td className="py-2 px-3 font-bold text-stone-100">{col.name}</td>
                  <td className="py-2 px-3 text-cyan-400">{col.type}</td>
                  <td className="py-2 px-3">
                    {col.key ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800/40">
                        {col.key}
                      </span>
                    ) : (
                      <span className="text-stone-600">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-stone-400">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive SQL Query Runner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-amber-500" />
              <span>Query Analitik Eksekutif Siap Pakai</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Simulasi eksekusi kueri langsung terhadap model data SQL pabrik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeQuery.sql)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs transition-colors"
            >
              {copiedQuery ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedQuery ? 'Tersalin' : 'Salin SQL'}</span>
            </button>

            <button
              onClick={handleExecuteQuery}
              disabled={queryRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors shadow"
            >
              <Play className={`h-3.5 w-3.5 ${queryRunning ? 'animate-spin' : ''}`} />
              <span>{queryRunning ? 'Menjalankan...' : 'Jalankan Query'}</span>
            </button>
          </div>
        </div>

        {/* Query Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveQueryIndex(idx);
                setQueryExecuted(true);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeQueryIndex === idx
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {q.title.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-400 font-mono">
          <strong className="text-stone-200">{activeQuery.title}:</strong> {activeQuery.desc}
        </div>

        {/* SQL Code Box */}
        <pre className="p-4 bg-stone-950 rounded-lg border border-stone-800 overflow-x-auto text-xs font-mono text-cyan-300 max-h-56 scrollbar-thin">
          <code>{activeQuery.sql}</code>
        </pre>

        {/* Simulated Query Execution Output */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Hasil Kueri Real-time (Execution Time: 4.8ms):</span>
            </span>
            <span>{activeQuery.result.length} baris data ditemukan</span>
          </div>

          <div className="overflow-x-auto border border-stone-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                <tr>
                  {Object.keys(activeQuery.result[0] || {}).map((colName) => (
                    <th key={colName} className="py-2.5 px-3 capitalize">
                      {colName.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 bg-stone-950/60 text-stone-300">
                {activeQuery.result.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-stone-900/50">
                    {Object.values(row).map((val: any, cIdx) => (
                      <td key={cIdx} className="py-2 px-3">
                        {String(val).includes('VALID') || String(val).includes('AMAN') ? (
                          <span className="text-emerald-400 font-bold">{val}</span>
                        ) : String(val).includes('WASPADA') ? (
                          <span className="text-amber-400 font-bold">{val}</span>
                        ) : (
                          val
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
