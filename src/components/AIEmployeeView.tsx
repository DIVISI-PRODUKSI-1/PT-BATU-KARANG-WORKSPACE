import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  FileText, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  Share2, 
  MessageSquare,
  TrendingDown,
  Cpu
} from 'lucide-react';
import { AIMessage, ShiftReport, AIAutonomousTask, ProductionLine, RawMaterialStock, ExciseStampInventory } from '../types/tobacco-system';
import { askFactoryAiOfficer } from '../services/aiService';

interface AIEmployeeViewProps {
  lines: ProductionLine[];
  rawMaterials: RawMaterialStock[];
  exciseStamps: ExciseStampInventory[];
  shiftReports: ShiftReport[];
  tasks: AIAutonomousTask[];
  onGenerateReportNow: () => void;
}

export const AIEmployeeView: React.FC<AIEmployeeViewProps> = ({
  lines,
  rawMaterials,
  exciseStamps,
  shiftReports,
  tasks,
  onGenerateReportNow
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-initial',
      sender: 'assistant',
      timestamp: '06:05 WIB',
      text: `Selamat pagi Bapak/Ibu Direktur. Saya **Aria**, Karyawan AI Eksekutif Bidang Operasional & Kepatuhan Pabrik Rokok (PT Batu Karang - Jl. Raya Parangargo 153 Wagir - Malang).

Saya terus memantau telemetri mesin, persediaan pita cukai, timbangan tembakau, dan kepatuhan Bea Cukai 24/7. Anda dapat menugaskan saya untuk:
1. Menyusun laporan shift otomatis untuk jajaran Direksi.
2. Melakukan audit rekonsiliasi fisik pita cukai vs output kemasan (Formulir CK-4).
3. Menganalisis penyebab penurunan OEE atau lonjakan reject pada mesin pembuat batang (Maker).
4. Memproyeksikan kebutuhan bahan baku tembakau Madura & saus formula untuk minggu depan.

Silakan pilih perintah cepat di bawah atau ketik instruksi spesifik Anda.`
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'chat' | 'official-report' | 'autonomous-tasks'>('chat');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Buatkan laporan ringkas produksi Shift Pagi untuk Direksi",
    "Cek rekonsiliasi pita cukai vs produksi hari ini, apakah ada selisih?",
    "Analisis penyebab penurunan OEE pada Mesin Maker SKM Line 2",
    "Proyeksikan kebutuhan tembakau Madura & cengkeh 7 hari ke depan"
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askFactoryAiOfficer(query, {
        currentShift: 'Shift 1 Pagi',
        lines,
        rawMaterials,
        exciseStamps,
        shiftReports
      });

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        text: response.text,
        metadata: {
          actionType: response.actionType,
          dataPayload: response.dataPayload
        }
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const latestReport = shiftReports[0];

  return (
    <div className="space-y-6 pb-12">
      {/* AI Officer Profile Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-xl bg-purple-950/70 border border-purple-700/50 flex items-center justify-center text-purple-400">
              <Bot className="h-8 w-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-stone-100">
                Aria · AI Administrative & Operations Officer
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-800/40">
                Autonomous Agent
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Tugas: Agregasi telemetri mesin, rekonsiliasi pita cukai (CK-4), deteksi anomali OEE, & pelaporan otomatis.
            </p>
          </div>
        </div>

        {/* View Switcher: Chat, Official Report, Background Tasks */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
          <button
            onClick={() => setActiveReportTab('chat')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeReportTab === 'chat'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat Tanya-Jawab</span>
          </button>

          <button
            onClick={() => setActiveReportTab('official-report')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeReportTab === 'official-report'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Laporan Memo Shift Resmi</span>
          </button>

          <button
            onClick={() => setActiveReportTab('autonomous-tasks')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
              activeReportTab === 'autonomous-tasks'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Jadwal Tugas Otonom ({tasks.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeReportTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Chat Window */}
          <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 rounded-xl flex flex-col h-[600px]">
            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-stone-500">
                    <span>{msg.sender === 'user' ? 'Pemilik Pabrik (Owner)' : 'Aria (AI Officer)'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-amber-600 text-stone-950 font-medium'
                        : 'bg-stone-950 border border-stone-800 text-stone-200 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs font-mono p-3 bg-stone-950 border border-stone-800 rounded-lg max-w-xs">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                  <span>Aria sedang menganalisis data pabrik...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="p-3 border-t border-stone-800 bg-stone-950/60 overflow-x-auto flex gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 rounded border border-stone-700/60 transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-stone-800 bg-stone-950 flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan status OEE, cek pita cukai, atau instruksikan laporan produksi..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputQuery.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </div>
          </div>

          {/* Right Col: Instant Action Card */}
          <div className="space-y-4">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider font-mono">
                <FileText className="h-4 w-4" />
                <span>Otomasi Laporan Sekali-Klik</span>
              </div>
              <h3 className="text-base font-bold text-stone-100">
                Terbitkan Laporan Shift 1 Pagi
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                AI akan mengumpulkan output seluruh mesin maker, packer, meja linting SKT, dan buku rekening cukai untuk diterbitkan dalam memo resmi.
              </p>
              <button
                onClick={onGenerateReportNow}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs transition-colors shadow flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Generate Laporan Resmi Sekarang</span>
              </button>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 text-xs">
              <div className="text-stone-300 font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Audit Kepatuhan Cukai Aktif</span>
              </div>
              <div className="space-y-2 text-stone-400">
                <div className="flex justify-between py-1 border-b border-stone-800">
                  <span>Pita Cukai Terpakai:</span>
                  <span className="text-stone-200 font-mono font-bold">428.845 keping</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800">
                  <span>Pack Masuk Gudang Jadi:</span>
                  <span className="text-stone-200 font-mono font-bold">428.845 pack</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-800">
                  <span>Afkir Rusak Tempel:</span>
                  <span className="text-amber-400 font-mono font-bold">369 keping</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-400 font-bold">
                  <span>Deviasi Fisik:</span>
                  <span className="font-mono">0 KEPING (VALID)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Shift Report Memorandum Tab */}
      {activeReportTab === 'official-report' && latestReport && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                DOKUMEN RESMI PABRIK · PT BATU KARANG (WAGIR - MALANG)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-100 mt-1">
                Laporan Produksi Harian & Rekonsiliasi Cukai (Shift 1)
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-stone-400 mt-1">
                <span>No: {latestReport.reportNumber}</span>
                <span>·</span>
                <span>Tanggal: {latestReport.date}</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">Terverifikasi AI (Zero Discrepancy)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak Dokumen</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              Ringkasan Eksekutif (AI Executive Brief):
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {latestReport.aiExecutiveSummary}
            </p>
          </div>

          {/* Performance Data Tables */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-stone-950 border border-stone-800 rounded">
              <span className="text-stone-500 block text-[10px]">TOTAL BATANG</span>
              <span className="text-stone-100 font-bold text-base">
                {latestReport.totalSticksProduced.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded">
              <span className="text-stone-500 block text-[10px]">TOTAL PACK BUNGKUS</span>
              <span className="text-stone-100 font-bold text-base">
                {latestReport.totalPacksProduced.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded">
              <span className="text-stone-500 block text-[10px]">TOTAL BAL GUDANG</span>
              <span className="text-stone-100 font-bold text-base">
                {latestReport.totalBalesProduced.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-3 bg-stone-950 border border-stone-800 rounded">
              <span className="text-stone-500 block text-[10px]">OEE KESELURUHAN</span>
              <span className="text-emerald-400 font-bold text-base">
                {latestReport.overallPlantOEE}%
              </span>
            </div>
          </div>

          {/* Major Incidents & Downtime Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-300 font-mono uppercase tracking-wider">
              Catatan Insiden & Tindakan Korektif (Log Shift):
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {latestReport.majorIncidents.map((inc, i) => (
                <li key={i} className="flex items-start gap-2 p-2 bg-stone-950 border border-stone-800 rounded">
                  <span className="text-amber-500 font-bold">{i + 1}.</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Signatures & Approvals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-800 text-xs">
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg">
              <span className="text-stone-500 text-[10px] block font-mono">DIVERIFIKASI OLEH AGEN AI:</span>
              <div className="font-bold text-purple-400 mt-1">{latestReport.aiVerifier}</div>
              <div className="text-[11px] text-stone-400 mt-1">Audit Rekonsiliasi Otomatis · SHA-256 Valid</div>
            </div>

            <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg">
              <span className="text-stone-500 text-[10px] block font-mono">SUPERVISOR KEPALA PRODUKSI:</span>
              <div className="font-bold text-stone-200 mt-1">{latestReport.supervisor}</div>
              <div className="text-[11px] text-stone-400 mt-1">Disahkan pada 30 Sep 2026, 14:02 WIB</div>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Background Tasks Timeline Tab */}
      {activeReportTab === 'autonomous-tasks' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>Jadwal Pekerjaan Otonom Karyawan AI Pabrik (Background Workers)</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Menunjukkan tugas-tugas administratif rutin yang dieksekusi agen AI secara otomatis tanpa perlu diperintah manual.
            </p>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-4 bg-stone-950 border border-stone-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-500">{task.timeScheduled}</span>
                    <span className="text-stone-500 text-xs">·</span>
                    <span className="text-xs font-semibold text-stone-200">{task.taskTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-400">
                      {task.targetModule}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{task.description}</p>
                  <p className="text-xs text-stone-300 font-mono mt-1">
                    <span className="text-stone-500">Hasil: </span>
                    {task.resultSummary}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
