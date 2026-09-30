import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';
import { OrgStructureView } from './components/OrgStructureView';
import { FactoryDashboardView } from './components/FactoryDashboardView';
import { AIEmployeeView } from './components/AIEmployeeView';
import { ExciseCukaiView } from './components/ExciseCukaiView';
import { SqlSchemaExplorer } from './components/SqlSchemaExplorer';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_LINES, 
  INITIAL_RAW_MATERIALS, 
  INITIAL_EXCISE_STAMPS, 
  INITIAL_SHIFT_REPORTS,
  INITIAL_AI_TASKS 
} from './data/mockFactoryData';
import { ShiftReport } from './types/tobacco-system';
import { 
  X, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Database, 
  Server, 
  Bot 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('architecture');
  const [lines, setLines] = useState(INITIAL_LINES);
  const [products] = useState(INITIAL_PRODUCTS);
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [exciseStamps, setExciseStamps] = useState(INITIAL_EXCISE_STAMPS);
  const [shiftReports, setShiftReports] = useState(INITIAL_SHIFT_REPORTS);
  const [tasks, setTasks] = useState(INITIAL_AI_TASKS);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Compute live plant summary
  const totalSticksToday = lines.reduce((acc, l) => acc + l.currentShiftOutput, 0);
  const plantOee = lines.reduce((acc, l) => acc + l.oeeScore, 0) / (lines.length || 1);

  // Real-time telemetry pulse effect (simulating high-speed cigarette maker pulses)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setLines(prevLines =>
        prevLines.map(line => {
          let additionalSticks = 0;
          const updatedMachines = line.machines.map(m => {
            if (m.status === 'RUNNING') {
              // slight speed jitter
              const jitter = (Math.random() - 0.5) * 40;
              const newSpeed = Math.round(Math.max(100, m.targetSpeedBpm + jitter));
              const increment = Math.round(newSpeed / 60); // sticks/packs per second
              if (m.type === 'MAKER' || m.type === 'ROLLING_BENCH') {
                additionalSticks += increment;
              }
              return {
                ...m,
                currentSpeedBpm: newSpeed,
                outputSticksCount: m.outputSticksCount + increment,
                rejectSticksCount: m.rejectSticksCount + (Math.random() < 0.2 ? 1 : 0)
              };
            }
            return m;
          });

          return {
            ...line,
            currentShiftOutput: line.currentShiftOutput + additionalSticks,
            machines: updatedMachines
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleGenerateReportNow = () => {
    setIsReportModalOpen(true);
    setIsGeneratingReport(true);

    setTimeout(() => {
      const newReport: ShiftReport = {
        id: `rep-${Date.now()}`,
        reportNumber: `RPT/PABRIK/2026/09/30-S1-REV${shiftReports.length}`,
        date: '30 September 2026',
        shift: 'SHIFT_1_PAGI',
        supervisor: 'Ir. Hendro Wibowo (Kabag Produksi)',
        aiVerifier: 'Aria - AI Autonomous Operations Officer v3.2',
        totalSticksProduced: totalSticksToday,
        totalPacksProduced: Math.round(totalSticksToday / 15.5),
        totalBalesProduced: Math.round(totalSticksToday / (15.5 * 10 * 20)),
        totalRejectSticks: 91400,
        overallPlantOEE: Number(plantOee.toFixed(1)),
        exciseStampsReconciled: true,
        tobaccoConsumedKg: 5840,
        cloveConsumedKg: 2620,
        sauceConsumedLiter: 642,
        majorIncidents: [
          'Line SKM 1: Operasi stabil pada kecepatan 7.200 bpm. Kualitas pengeleman filter 99.3%.',
          'Line SKM 2: Mengalami downtime suction belt 42 mnt pkl 09:15, pisau pemotong diganti.',
          'Pita Cukai: Saldo brankas dan keping terpakai 100% klop terhadap pack masuk Gudang Jadi (Nol Selisih).'
        ],
        aiExecutiveSummary: `Laporan shift diperbarui secara otomatis: Total produksi mencapai ${totalSticksToday.toLocaleString('id-ID')} batang (${((totalSticksToday / 7570000) * 100).toFixed(1)}% dari target). OEE rata-rata ${plantOee.toFixed(1)}%. Buku rekening pita cukai (CK-4) diverifikasi bersih tanpa deviasi fisik. Seluruh mesin siap untuk serah-terima (handover) ke Shift 2 Siang.`,
        status: 'VERIFIED_AI'
      };

      setShiftReports(prev => [newReport, ...prev]);
      setIsGeneratingReport(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Sticky Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        totalSticksToday={totalSticksToday}
        plantOee={plantOee}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'architecture' && <ArchitectureBlueprintView />}

        {activeTab === 'org-structure' && <OrgStructureView />}

        {activeTab === 'dashboard' && (
          <FactoryDashboardView
            lines={lines}
            setLines={setLines}
            products={products}
            rawMaterials={rawMaterials}
            totalSticksToday={totalSticksToday}
            plantOee={plantOee}
            onOpenReportModal={handleGenerateReportNow}
            onNavigateToAi={() => setActiveTab('ai-assistant')}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AIEmployeeView
            lines={lines}
            rawMaterials={rawMaterials}
            exciseStamps={exciseStamps}
            shiftReports={shiftReports}
            tasks={tasks}
            onGenerateReportNow={handleGenerateReportNow}
          />
        )}

        {activeTab === 'excise-cukai' && (
          <ExciseCukaiView
            exciseStamps={exciseStamps}
            products={products}
          />
        )}

        {activeTab === 'sql-schema' && <SqlSchemaExplorer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-6 text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">PT Batu Karang</span>
            <span>·</span>
            <span>Jl. Raya Parangargo 153 Wagir - Malang</span>
            <span>·</span>
            <span>Sistem AI Pabrik Rokok & Analitik Operasional</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>PostgreSQL / Cloud SQL</span>
            <span>·</span>
            <span>Node.js Express API</span>
            <span>·</span>
            <span>React 19</span>
            <span>·</span>
            <span>Gemini LLM Agent</span>
          </div>
        </div>
      </footer>

      {/* Shift Report Generator Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-stone-100 text-base">
                  {isGeneratingReport ? 'Menyusun Laporan Shift...' : 'Memorandum Resmi Shift 1 Pagi'}
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded hover:bg-stone-800 text-stone-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isGeneratingReport ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-stone-300">
                <Sparkles className="h-8 w-8 text-amber-500 animate-spin" />
                <p className="text-xs font-mono text-stone-400">
                  Aria sedang mengagregasi data maker, packer, meja linting, dan saldo pita cukai...
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-stone-950 border border-stone-800 rounded text-stone-300 leading-relaxed font-mono">
                  {shiftReports[0]?.aiExecutiveSummary}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="p-2.5 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 text-[10px] block">TOTAL BATANG</span>
                    <span className="text-stone-100 font-bold">{totalSticksToday.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 text-[10px] block">OEE PABRIK</span>
                    <span className="text-emerald-400 font-bold">{plantOee.toFixed(1)}%</span>
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 text-[10px] block">PACKS GUDANG</span>
                    <span className="text-cyan-400 font-bold">{(Math.round(totalSticksToday / 15.5)).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="p-2.5 bg-stone-950 rounded border border-stone-800">
                    <span className="text-stone-500 text-[10px] block">SEPARASI CUKAI</span>
                    <span className="text-emerald-400 font-bold">0 KEPING</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsReportModalOpen(false);
                      setActiveTab('ai-assistant');
                    }}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded text-xs transition-colors"
                  >
                    Buka di Portal Karyawan AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
