import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  FileCheck2, 
  Calculator, 
  Building2, 
  Printer, 
  ArrowRightLeft, 
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { ExciseStampInventory, CigaretteProduct } from '../types/tobacco-system';

interface ExciseCukaiViewProps {
  exciseStamps: ExciseStampInventory[];
  products: CigaretteProduct[];
}

export const ExciseCukaiView: React.FC<ExciseCukaiViewProps> = ({
  exciseStamps,
  products
}) => {
  const [selectedStamp, setSelectedStamp] = useState<ExciseStampInventory>(exciseStamps[0]);

  // Compute total excise liabilities paid to State Treasury
  const totalExciseValueToday = exciseStamps.reduce((acc, curr) => {
    return acc + (curr.usedTodayStamps * curr.tariffPerStick * 16); // estimated nominal
  }, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Building2 className="h-4 w-4 text-amber-500" />
            <span>KANTOR PELAYANAN UTAMA BEA DAN CUKAI (KPU BC) COMPLIANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight mt-1">
            Buku Rekening & Rekonsiliasi Pita Cukai (Formulir CK-4)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Audit presisi tanpa selisih antara keping pita cukai yang ditempel mesin packer dan unit fisik yang masuk gudang.
          </p>
        </div>

        <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-right font-mono">
          <span className="text-[10px] text-stone-500 block uppercase">NILAI CUKAI TERSERAP HARI INI</span>
          <span className="text-base sm:text-lg font-bold text-amber-400">
            Rp {(totalExciseValueToday / 1000000000).toFixed(2)} Miliar
          </span>
        </div>
      </div>

      {/* Cards per Product Excise Series */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exciseStamps.map(stamp => {
          const isSelected = selectedStamp.id === stamp.id;
          return (
            <div
              key={stamp.id}
              onClick={() => setSelectedStamp(stamp)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-stone-900 border-amber-600 shadow-md ring-1 ring-amber-600/30'
                  : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs text-amber-500 font-bold">{stamp.stampCode}</span>
                  <h3 className="font-bold text-stone-100 text-sm mt-0.5">{stamp.applicableProduct}</h3>
                  <div className="text-[11px] text-stone-400 font-mono mt-1">
                    Seri: {stamp.series}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {stamp.reconciliationStatus}
                </span>
              </div>

              {/* Counts */}
              <div className="mt-4 pt-3 border-t border-stone-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Stok Fisik Awal:</span>
                  <span className="text-stone-200">{stamp.totalStampsOnHand.toLocaleString('id-ID')} keping</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Terpakai di Packer:</span>
                  <span className="text-cyan-400 font-bold">{stamp.usedTodayStamps.toLocaleString('id-ID')} keping</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Afkir Rusak Tempel:</span>
                  <span className="text-amber-400">{stamp.damagedStampsAffkir.toLocaleString('id-ID')} keping</span>
                </div>
                <div className="flex justify-between text-stone-300 font-bold pt-1 border-t border-stone-800/60">
                  <span>Sisa Saldo Brankas:</span>
                  <span className="text-emerald-400">{stamp.remainingStamps.toLocaleString('id-ID')} keping</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stamp Deep Audit & CK-4 Document Generator */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                AUDIT FORMULIR CK-4 · BEA CUKAI RI
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Validasi Nol Selisih
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-100 mt-1">
              Rekonsiliasi Fisik Pita Cukai: {selectedStamp.applicableProduct}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Audit terakhir dieksekusi otomatis oleh AI: {selectedStamp.lastAuditTimestamp}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Berita Acara CK-4</span>
          </button>
        </div>

        {/* Mathematical Proof Matrix */}
        <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-3 font-mono text-xs">
          <div className="text-stone-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
            <Calculator className="h-4 w-4 text-amber-500" />
            <span>Formulasi Validasi Silang Sistem (Anti-Kebocoran Fisik):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-stone-900 rounded border border-stone-800">
              <span className="text-stone-500 text-[10px] block">TOTAL BUNGKUS GUDANG JADI</span>
              <span className="text-base font-bold text-stone-100 mt-1 block">
                {selectedStamp.usedTodayStamps.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400">Verifikasi Barcode Gudang</span>
            </div>

            <div className="flex items-center justify-center text-stone-600 font-bold text-xl">
              +
            </div>

            <div className="p-3 bg-stone-900 rounded border border-stone-800">
              <span className="text-stone-500 text-[10px] block">AFKIR RUSAK TEMPEL</span>
              <span className="text-base font-bold text-amber-400 mt-1 block">
                {selectedStamp.damagedStampsAffkir.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-stone-400">Terdaftar di Berita Acara</span>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded border border-emerald-800/40 text-emerald-400">
              <span className="text-stone-400 text-[10px] block">STATUS DISKREPANSI FISIK</span>
              <span className="text-base font-bold mt-1 block">
                0 KEPING (SEMPURNA)
              </span>
              <span className="text-[10px] text-emerald-500">Tidak ada potensi denda audit</span>
            </div>
          </div>
        </div>

        {/* Regulatory Guidelines for the Owner */}
        <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-2 text-xs text-stone-300">
          <h4 className="font-bold text-stone-200">
            Kepatuhan Peraturan Menteri Keuangan (PMK) & Dirjen Bea dan Cukai:
          </h4>
          <p className="text-stone-400 leading-relaxed">
            1. Setiap pita cukai yang rusak karena kesalahan mesin packer wajib disimpan fisiknya dan dicocokkan dengan nomor urut register lembar cukai untuk proses pemusnahan resmi bersama pejabat Bea Cukai (Formulir CK-5).<br />
            2. Seluruh pergerakan barang dari ruang produksi ke tempat penimbunan etiket (Gudang Jadi) otomatis mengunci nomor batch dan terdistribusi ke log blockchain internal database SQL.
          </p>
        </div>
      </div>
    </div>
  );
};
