import React from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  X, 
  CheckCircle2, 
  Bot, 
  Wrench, 
  Gauge, 
  Clock, 
  ArrowRight, 
  ZapOff,
  BellRing
} from 'lucide-react';
import { FactoryAlert } from '../types/alert';

interface AlertNotificationModalProps {
  alert: FactoryAlert | null;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
  onAskAi: (alert: FactoryAlert) => void;
  onRestartMachine?: (machineId: string) => void;
}

export const AlertNotificationModal: React.FC<AlertNotificationModalProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onAskAi,
  onRestartMachine
}) => {
  if (!alert) return null;

  const isLowOee = alert.alertType === 'LOW_OEE';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border-2 border-rose-600/90 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(225,29,72,0.35)] overflow-hidden">
        {/* Urgent Industrial Hazard Bar */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-black/25 rounded-lg animate-pulse">
              {isLowOee ? (
                <Gauge className="h-6 w-6 text-white" />
              ) : (
                <ZapOff className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest font-black bg-black/40 px-2 py-0.5 rounded">
                  {alert.severity} ALERT · PT BATU KARANG
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-0.5">
                {alert.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/90 transition-colors"
            title="Tutup Peringatan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs font-mono">
          {/* Machine & Line Location */}
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
            <div className="flex items-center justify-between text-stone-400 text-[11px]">
              <span>KODE UNIT & LOKASI:</span>
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                STATUS: {alert.alertType}
              </span>
            </div>
            <div className="font-bold text-stone-100 text-sm font-sans flex items-center gap-2">
              <span className="text-amber-500 font-mono font-extrabold">{alert.machineCode}</span>
              <span>·</span>
              <span>{alert.machineName}</span>
            </div>
            <div className="text-stone-400 text-[11px] font-sans">
              Jalur: <strong className="text-stone-300">{alert.lineName}</strong> · Terdeteksi: {alert.timestamp}
            </div>
          </div>

          {/* Metric Alert Callout */}
          <div className="grid grid-cols-2 gap-3">
            {isLowOee ? (
              <>
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-center">
                  <span className="text-rose-300 text-[10px] block uppercase font-bold">NILAI OEE TERDETEKSI</span>
                  <span className="text-2xl font-black text-rose-400 mt-0.5 block">
                    {alert.currentOee?.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-stone-400">Ambang Kritis: &lt; 70.0%</span>
                </div>

                <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-center">
                  <span className="text-stone-400 text-[10px] block uppercase">STATUS WORLD CLASS</span>
                  <span className="text-lg font-bold text-stone-400 mt-1 block">
                    DEVIASI -19.2%
                  </span>
                  <span className="text-[10px] text-stone-500">Benchmark: &ge; 85.0%</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-center">
                  <span className="text-rose-300 text-[10px] block uppercase font-bold">DOWNTIME MENDADAK</span>
                  <span className="text-2xl font-black text-rose-400 mt-0.5 block">
                    {alert.downtimeMinutes || 1} Mnt
                  </span>
                  <span className="text-[10px] text-stone-400">Mesin Berhenti Mendadak</span>
                </div>

                <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-center">
                  <span className="text-stone-400 text-[10px] block uppercase">LAJU KECEPATAN (BPM)</span>
                  <span className="text-2xl font-black text-rose-400 mt-0.5 block">
                    0 <span className="text-xs text-stone-400 font-normal">BPM</span>
                  </span>
                  <span className="text-[10px] text-stone-500">Target: 7.500 BPM</span>
                </div>
              </>
            )}
          </div>

          {/* AI Officer Diagnosis Box */}
          <div className="p-3.5 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs font-sans">
              <Bot className="h-4 w-4" />
              <span>Diagnostik Awal Karyawan AI (Aria):</span>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              {alert.aiDiagnosis}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 border border-stone-700"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Konfirmasi Mandor</span>
              </button>

              <button
                onClick={() => onAskAi(alert)}
                className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Bot className="h-4 w-4" />
                <span>Investigasi via Aria AI</span>
              </button>
            </div>

            {onRestartMachine && alert.alertType === 'SUDDEN_DOWNTIME' && (
              <button
                onClick={() => onRestartMachine(alert.machineId)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Wrench className="h-4 w-4" />
                <span>Perbaiki & Nyalakan Ulang Mesin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
