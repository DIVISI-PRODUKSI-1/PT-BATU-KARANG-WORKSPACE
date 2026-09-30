import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Gauge, 
  Droplet, 
  Thermometer, 
  Package, 
  Wrench, 
  Play, 
  Pause, 
  ShieldCheck, 
  FileText,
  AlertTriangle,
  AlertOctagon,
  BellRing,
  ZapOff
} from 'lucide-react';
import { ProductionLine, MachineTelemetry, RawMaterialStock, CigaretteProduct } from '../types/tobacco-system';
import { PerformanceTrends } from './PerformanceTrends';
import { FactoryAlert } from '../types/alert';
import { AlertNotificationModal } from './AlertNotificationModal';

interface FactoryDashboardViewProps {
  lines: ProductionLine[];
  setLines: React.Dispatch<React.SetStateAction<ProductionLine[]>>;
  products: CigaretteProduct[];
  rawMaterials: RawMaterialStock[];
  totalSticksToday: number;
  plantOee: number;
  onOpenReportModal: () => void;
  onNavigateToAi?: (query: string) => void;
}

export const FactoryDashboardView: React.FC<FactoryDashboardViewProps> = ({
  lines,
  setLines,
  products,
  rawMaterials,
  totalSticksToday,
  plantOee,
  onOpenReportModal,
  onNavigateToAi
}) => {
  const [selectedLineId, setSelectedLineId] = useState<string>(lines[0]?.id || '');
  const [selectedMachine, setSelectedMachine] = useState<MachineTelemetry | null>(null);
  const [alerts, setAlerts] = useState<FactoryAlert[]>([]);
  const [activeModalAlert, setActiveModalAlert] = useState<FactoryAlert | null>(null);

  const activeLine = lines.find(l => l.id === selectedLineId) || lines[0];

  // Scan machines for OEE < 70% or Sudden Downtime (status IDLE)
  useEffect(() => {
    lines.forEach(line => {
      line.machines.forEach(machine => {
        // Condition 1: OEE < 70%
        if (machine.oee.overall < 70) {
          const alertId = `low-oee-${machine.id}-${Math.floor(machine.oee.overall)}`;
          setAlerts(prev => {
            const exists = prev.find(a => a.id === alertId || (a.machineId === machine.id && a.alertType === 'LOW_OEE' && !a.acknowledged));
            if (!exists) {
              const newAlert: FactoryAlert = {
                id: alertId,
                machineId: machine.id,
                machineCode: machine.code,
                machineName: machine.name,
                lineName: line.name.split('(')[0].trim(),
                alertType: 'LOW_OEE',
                severity: 'CRITICAL',
                title: `Nilai OEE di Bawah Ambang Kritis (${machine.oee.overall}%)`,
                message: `Efisiensi mesin ${machine.code} berada di angka ${machine.oee.overall}%, jauh di bawah batas minimum operasional 70.0% dan standar World Class 85.0%.`,
                currentOee: machine.oee.overall,
                aiDiagnosis: `Analisis sensor AI: Penurunan drastis OEE pada ${machine.code} disebabkan oleh lonjakan afkir reject batang (${machine.rejectSticksCount.toLocaleString('id-ID')} batang) dan ketidakstabilan penarikan kertas papir. Segera cek nozzle lem dan kalibrasi vakum hopper.`,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                acknowledged: false
              };
              setActiveModalAlert(newAlert);
              return [newAlert, ...prev];
            }
            return prev;
          });
        }

        // Condition 2: Sudden Downtime (status changed to IDLE or speed 0 while in shift)
        if (machine.status === 'IDLE') {
          const alertId = `downtime-${machine.id}-${Date.now().toString().slice(0, 7)}`;
          setAlerts(prev => {
            const exists = prev.find(a => a.machineId === machine.id && a.alertType === 'SUDDEN_DOWNTIME' && !a.acknowledged);
            if (!exists) {
              const newAlert: FactoryAlert = {
                id: alertId,
                machineId: machine.id,
                machineCode: machine.code,
                machineName: machine.name,
                lineName: line.name.split('(')[0].trim(),
                alertType: 'SUDDEN_DOWNTIME',
                severity: 'CRITICAL',
                title: `Terdeteksi Downtime Mendadak (Mesin Berhenti)`,
                message: `Mesin ${machine.code} (${machine.name}) berhenti beroperasi tanpa jadwal maintenance. Laju kecepatan turun ke 0 BPM.`,
                downtimeMinutes: machine.downtimeMinutes || 12,
                aiDiagnosis: `Sensor telemetri mendeteksi interupsi mendadak pada conveyor/suction belt. Kemungkinan penyebab: jamming batang rokok di drum filter tipping atau aktivasi emergency stop oleh operator ${machine.operatorInCharge}.`,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                acknowledged: false
              };
              setActiveModalAlert(newAlert);
              return [newAlert, ...prev];
            }
            return prev;
          });
        }
      });
    });
  }, [lines]);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    setActiveModalAlert(null);
  };

  const handleAskAi = (alert: FactoryAlert) => {
    setActiveModalAlert(null);
    if (onNavigateToAi) {
      onNavigateToAi(`Tolong investigasi anomali pada ${alert.machineCode} (${alert.machineName}). Masalah: ${alert.title}. Nilai OEE: ${alert.currentOee || 'N/A'}%. Apa tindakan preventif dan perbaikan tercepat untuk tim teknisi PT Batu Karang?`);
    }
  };

  const handleRestartMachine = (machineId: string) => {
    setLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        machines: line.machines.map(m => {
          if (m.id === machineId) {
            return {
              ...m,
              status: 'RUNNING',
              currentSpeedBpm: m.targetSpeedBpm * 0.96,
              oee: {
                availability: 94.0,
                performance: 95.0,
                quality: 98.5,
                overall: 88.0
              }
            };
          }
          return m;
        })
      }))
    );
    setAlerts(prev => prev.map(a => a.machineId === machineId ? { ...a, acknowledged: true } : a));
    setActiveModalAlert(null);
  };

  // Test Simulation Trigger 1: Trigger OEE < 70% on MKR-02
  const handleSimulateLowOee = () => {
    setLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        machines: line.machines.map(m => {
          if (m.code === 'MKR-02') {
            return {
              ...m,
              oee: {
                availability: 72.0,
                performance: 82.0,
                quality: 96.0,
                overall: 64.8 // Strictly below 70%
              },
              currentSpeedBpm: 4200,
              rejectSticksCount: m.rejectSticksCount + 18500
            };
          }
          return m;
        })
      }))
    );
  };

  // Test Simulation Trigger 2: Trigger Sudden Downtime on MKR-01 Protos
  const handleSimulateSuddenDowntime = () => {
    setLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        machines: line.machines.map(m => {
          if (m.code === 'MKR-01') {
            return {
              ...m,
              status: 'IDLE',
              currentSpeedBpm: 0,
              downtimeMinutes: m.downtimeMinutes + 15,
              lastIssue: 'Jamming kertas papir mendadak di silinder pemotong'
            };
          }
          return m;
        })
      }))
    );
  };

  // Reset all machines to healthy running state
  const handleResetMachines = () => {
    setLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        machines: line.machines.map(m => ({
          ...m,
          status: 'RUNNING',
          currentSpeedBpm: m.targetSpeedBpm * 0.96,
          oee: {
            availability: 94.2,
            performance: 95.5,
            quality: 98.9,
            overall: 89.0
          }
        }))
      }))
    );
    setAlerts([]);
    setActiveModalAlert(null);
  };

  const handleToggleMachineStatus = (machineId: string) => {
    setLines(prevLines =>
      prevLines.map(line => ({
        ...line,
        machines: line.machines.map(m => {
          if (m.id === machineId) {
            const nextStatus = m.status === 'RUNNING' ? 'IDLE' : 'RUNNING';
            return {
              ...m,
              status: nextStatus,
              currentSpeedBpm: nextStatus === 'RUNNING' ? m.targetSpeedBpm * 0.95 : 0
            };
          }
          return m;
        })
      }))
    );
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Real-time Shift Overview & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 bg-stone-900/90 border border-stone-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span>PLANT OPERATIONAL MONITOR</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">SEMUA SISTEM TERKONEKSI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight mt-1">
            Status Operasional Shift 1 Pagi (06:00 - 14:00 WIB)
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Agregasi telemetri mesin SKM berkecepatan tinggi & stasiun linting tangan SKT secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Laporan Shift AI</span>
          </button>
        </div>
      </div>

      {/* Visual Alert & Diagnostic Testing Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            unacknowledgedAlerts.length > 0 
              ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80 animate-pulse' 
              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
          }`}>
            <BellRing className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-200 uppercase tracking-wider">
                Sistem Peringatan Dini & Sensor Anomali OEE
              </span>
              {unacknowledgedAlerts.length > 0 ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800/60 animate-bounce">
                  {unacknowledgedAlerts.length} Alert Kritis Aktif
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/30">
                  Normal &bull; Siaga Otomatis
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Notifikasi pop-up otomatis muncul jika OEE mesin &lt; 70% atau terjadi penghentian mesin mendadak.
            </p>
          </div>
        </div>

        {/* Quick Simulation Buttons to Test Alert Notification System */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs w-full md:w-auto">
          <button
            onClick={handleSimulateLowOee}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            title="Simulasikan OEE Maker 02 anjlok ke 64.8% (< 70%)"
          >
            <Gauge className="h-3.5 w-3.5 text-rose-400" />
            <span>Tes Alert: OEE &lt; 70%</span>
          </button>

          <button
            onClick={handleSimulateSuddenDowntime}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            title="Simulasikan Maker 01 berhenti mendadak (0 BPM)"
          >
            <ZapOff className="h-3.5 w-3.5 text-amber-400" />
            <span>Tes Alert: Downtime</span>
          </button>

          {unacknowledgedAlerts.length > 0 && (
            <button
              onClick={() => setActiveModalAlert(unacknowledgedAlerts[0])}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium transition-colors flex items-center gap-1.5"
            >
              <span>Buka Pop-up ({unacknowledgedAlerts.length})</span>
            </button>
          )}

          <button
            onClick={handleResetMachines}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 font-medium transition-colors flex items-center gap-1.5"
            title="Reset semua mesin kembali ke status RUNNING normal"
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Reset Normal</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Dense Industrial Display) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sticks */}
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Produksi Batang</span>
            <Package className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-100 font-mono">
            {totalSticksToday.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span className="text-emerald-400 font-medium">94.8%</span>
            <span>dari target 7.570.000 btg</span>
          </div>
        </div>

        {/* Card 2: Plant OEE */}
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>OEE Efisiensi Pabrik</span>
            <Gauge className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            {plantOee.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span className="text-emerald-400 font-medium">World Class</span>
            <span>(Standar OEE &gt; 85%)</span>
          </div>
        </div>

        {/* Card 3: Total Packs */}
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>Packs Masuk Gudang Jadi</span>
            <CheckCircle className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
            {(Math.round(totalSticksToday / 15.5)).toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span>Bungkus Tersegel Rapi</span>
          </div>
        </div>

        {/* Card 4: Cukai Compliance */}
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>Kepatuhan Pita Cukai</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            100% KLOP
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <span className="text-emerald-400 font-medium">0 Selisih</span>
            <span>(Audit Bea Cukai CK-4)</span>
          </div>
        </div>
      </div>

      {/* Recharts Performance Trends (OEE Scores & Throughput Over Time) */}
      <PerformanceTrends />

      {/* Line Selector & Line Status Drill-Down */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-amber-500" />
            <span>Pemantauan Jalur Produksi (SKM Mesin & SKT Tangan)</span>
          </h3>

          {/* Line Switcher */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
            {lines.map(line => (
              <button
                key={line.id}
                onClick={() => setSelectedLineId(line.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedLineId === line.id
                    ? 'bg-amber-600 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {line.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Line Detail Card */}
        {activeLine && (
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-amber-500 font-mono text-xs uppercase tracking-wider font-semibold">
                  Kategori: {activeLine.type} · Kapasitas: {(activeLine.capacityPerShift / 1000000).toFixed(2)} Juta Batang/Shift
                </span>
                <h4 className="text-lg font-bold text-stone-100 mt-0.5">{activeLine.name}</h4>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-stone-500 text-[10px] block">OUTPUT JALUR</span>
                  <span className="text-stone-200 font-bold text-sm">
                    {activeLine.currentShiftOutput.toLocaleString('id-ID')} / {activeLine.targetShiftOutput.toLocaleString('id-ID')} btg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 text-[10px] block">OEE JALUR</span>
                  <span className={`font-bold text-sm ${activeLine.oeeScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeLine.oeeScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Machines inside this line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLine.machines.map(machine => (
                <div
                  key={machine.id}
                  className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-4 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-500">{machine.code}</span>
                        <span className="text-stone-500 text-xs">·</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                          machine.status === 'RUNNING'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${machine.status === 'RUNNING' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                          {machine.status}
                        </span>
                      </div>
                      <h5 className="font-semibold text-stone-100 text-sm mt-1">{machine.name}</h5>
                      <p className="text-xs text-stone-400">Produk: {machine.activeProduct}</p>
                    </div>

                    <button
                      onClick={() => handleToggleMachineStatus(machine.id)}
                      className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                      title={machine.status === 'RUNNING' ? 'Hentikan Mesin (Simulasi Downtime)' : 'Nyalakan Mesin'}
                    >
                      {machine.status === 'RUNNING' ? (
                        <Pause className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Play className="h-4 w-4 text-emerald-400" />
                      )}
                    </button>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-stone-900/60 rounded border border-stone-800/60 text-xs font-mono">
                    <div>
                      <span className="text-stone-500 text-[10px] block">KECEPATAN</span>
                      <span className="text-stone-200 font-bold">
                        {machine.currentSpeedBpm.toLocaleString('id-ID')}{' '}
                        <span className="text-[10px] text-stone-500 font-normal">
                          {machine.type === 'PACKER' ? 'ppm' : 'bpm'}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">AFKIR/REJECT</span>
                      <span className="text-red-400 font-bold">
                        {machine.rejectSticksCount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">DOWNTIME</span>
                      <span className="text-amber-400 font-bold">{machine.downtimeMinutes} mnt</span>
                    </div>
                  </div>

                  {/* OEE Breakdown Progress */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-400 text-[11px] font-mono">
                      <span>OEE Machine Score:</span>
                      <span className="font-bold text-amber-400">{machine.oee.overall}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-stone-400">
                      <div className="bg-stone-900 p-1.5 rounded text-center">
                        <span className="block text-stone-500">Avail</span>
                        <span className="font-bold text-stone-200">{machine.oee.availability}%</span>
                      </div>
                      <div className="bg-stone-900 p-1.5 rounded text-center">
                        <span className="block text-stone-500">Perf</span>
                        <span className="font-bold text-stone-200">{machine.oee.performance}%</span>
                      </div>
                      <div className="bg-stone-900 p-1.5 rounded text-center">
                        <span className="block text-stone-500">Quality</span>
                        <span className="font-bold text-stone-200">{machine.oee.quality}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Sensors if Maker / Bench */}
                  {(machine.temperatureC || machine.tobaccoMoisturePct) && (
                    <div className="flex items-center gap-4 text-xs font-mono text-stone-400 pt-1 border-t border-stone-800/80">
                      {machine.temperatureC && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3.5 w-3.5 text-red-400" />
                          <span>Suhu: {machine.temperatureC}°C</span>
                        </div>
                      )}
                      {machine.tobaccoMoisturePct && (
                        <div className="flex items-center gap-1">
                          <Droplet className="h-3.5 w-3.5 text-cyan-400" />
                          <span>Kadar Air: {machine.tobaccoMoisturePct}% (Optimal)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Operator in Charge */}
                  <div className="text-[11px] text-stone-500 flex items-center justify-between">
                    <span>Operator: {machine.operatorInCharge}</span>
                    <span>{machine.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Raw Material Inventory Section (Tembakau, Cengkeh, Saus) */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-stone-100">
              Ketahanan Stok Bahan Baku Utama (Tembakau & Cengkeh)
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Integrasi Gudang Primary & Lab Formula
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rawMaterials.map(mat => (
            <div key={mat.id} className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-amber-500">{mat.code}</span>
                  <div className="font-medium text-stone-200 text-xs mt-0.5">{mat.name}</div>
                  <div className="text-[11px] text-stone-500">Asal: {mat.supplierOrigin}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {mat.status}
                </span>
              </div>

              <div className="flex items-end justify-between font-mono text-xs pt-1 border-t border-stone-800">
                <div>
                  <span className="text-[10px] text-stone-500 block">STOK FISIK</span>
                  <span className="text-stone-200 font-bold">
                    {mat.stockOnHand.toLocaleString('id-ID')} {mat.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">KETAHANAN</span>
                  <span className="text-emerald-400 font-bold">
                    {mat.estimatedDaysLeft.toFixed(1)} Hari
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Alert Notification Modal */}
      <AlertNotificationModal
        alert={activeModalAlert}
        onClose={() => setActiveModalAlert(null)}
        onAcknowledge={handleAcknowledge}
        onAskAi={handleAskAi}
        onRestartMachine={handleRestartMachine}
      />
    </div>
  );
};
